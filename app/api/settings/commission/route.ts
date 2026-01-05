import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { createSupabaseClient, SETTINGS_KEYS } from '@/lib/supabase';

const SETTINGS_FILE = path.join(process.cwd(), 'data', 'settings.json');

function readSettingsFromFile() {
  try {
    const content = fs.readFileSync(SETTINGS_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    return {
      productSettings: {},
      globalCommission: { globalCommission: 0, enabled: false },
    };
  }
}

function writeSettingsToFile(settings: any) {
  const dataDir = path.dirname(SETTINGS_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2), 'utf-8');
}

export async function GET() {
  try {
    const supabase = createSupabaseClient();

    if (supabase) {
      const { data, error } = await supabase
        .from('settings')
        .select('value')
        .eq('key', SETTINGS_KEYS.GLOBAL_COMMISSION)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Błąd Supabase:', error);
        const fileSettings = readSettingsFromFile();
        return NextResponse.json(fileSettings.globalCommission || { globalCommission: 0, enabled: false });
      }

      if (data) {
        return NextResponse.json(data.value || { globalCommission: 0, enabled: false });
      }

      return NextResponse.json({ globalCommission: 0, enabled: false });
    }

    // Fallback do pliku
    const settings = readSettingsFromFile();
    return NextResponse.json(settings.globalCommission || { globalCommission: 0, enabled: false });
  } catch (error) {
    console.error('Błąd podczas ładowania ustawień prowizji:', error);
    const fileSettings = readSettingsFromFile();
    return NextResponse.json(fileSettings.globalCommission || { globalCommission: 0, enabled: false });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { globalCommission, enabled } = body;

    const supabase = createSupabaseClient();

    if (supabase) {
      const commissionSettings = {
        globalCommission: globalCommission || 0,
        enabled: enabled !== undefined ? enabled : false,
      };

      const { error } = await supabase
        .from('settings')
        .upsert({
          key: SETTINGS_KEYS.GLOBAL_COMMISSION,
          value: commissionSettings,
          updated_at: new Date().toISOString(),
        });

      if (error) {
        console.error('Błąd Supabase:', error);
        // Fallback do pliku
        const fileSettings = readSettingsFromFile();
        fileSettings.globalCommission = commissionSettings;
        writeSettingsToFile(fileSettings);
      } else {
        return NextResponse.json({ success: true });
      }
    } else {
      // Fallback do pliku
      const fileSettings = readSettingsFromFile();
      fileSettings.globalCommission = {
        globalCommission: globalCommission || 0,
        enabled: enabled !== undefined ? enabled : false,
      };
      writeSettingsToFile(fileSettings);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Błąd podczas zapisywania ustawień prowizji:', error);
    return NextResponse.json({ error: 'Błąd podczas zapisywania ustawień' }, { status: 500 });
  }
}
