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

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createSupabaseClient();

    if (supabase) {
      const { data, error } = await supabase
        .from('settings')
        .select('value')
        .eq('key', SETTINGS_KEYS.PRODUCT_SETTINGS)
        .single();

      if (!error && data) {
        const productSettings = data.value || {};
        return NextResponse.json(productSettings[id] || {});
      }
    }

    // Fallback do pliku
    const settings = readSettingsFromFile();
    const productSettings = settings.productSettings?.[id] || {};
    return NextResponse.json(productSettings);
  } catch (error) {
    console.error('Błąd podczas ładowania ustawień produktu:', error);
    return NextResponse.json({ error: 'Błąd podczas ładowania ustawień' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const url = new URL(request.url);
    const key = url.searchParams.get('key'); // Klucz do usunięcia (np. 'customCommission')

    const supabase = createSupabaseClient();

    if (supabase) {
      // Pobierz aktualne ustawienia
      const { data: existingData } = await supabase
        .from('settings')
        .select('value')
        .eq('key', SETTINGS_KEYS.PRODUCT_SETTINGS)
        .single();

      const currentSettings = existingData?.value || {};

      if (key && currentSettings[id]) {
        // Usuń konkretny klucz
        delete currentSettings[id][key];
        if (Object.keys(currentSettings[id]).length === 0) {
          delete currentSettings[id];
        }
      } else if (!key) {
        // Usuń wszystkie ustawienia dla produktu
        delete currentSettings[id];
      }

      // Zapisz zaktualizowane ustawienia
      const { error } = await supabase
        .from('settings')
        .upsert({
          key: SETTINGS_KEYS.PRODUCT_SETTINGS,
          value: currentSettings,
          updated_at: new Date().toISOString(),
        });

      if (!error) {
        return NextResponse.json({ success: true });
      }
    }

    // Fallback do pliku
    const fileSettings = readSettingsFromFile();
    if (!fileSettings.productSettings) {
      fileSettings.productSettings = {};
    }
    if (key && fileSettings.productSettings[id]) {
      delete fileSettings.productSettings[id][key];
      if (Object.keys(fileSettings.productSettings[id]).length === 0) {
        delete fileSettings.productSettings[id];
      }
    } else if (!key) {
      delete fileSettings.productSettings[id];
    }
    writeSettingsToFile(fileSettings);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Błąd podczas usuwania ustawień produktu:', error);
    return NextResponse.json({ error: 'Błąd podczas usuwania ustawień' }, { status: 500 });
  }
}
