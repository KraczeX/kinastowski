import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { createSupabaseClient, SETTINGS_KEYS } from '@/lib/supabase';

const SETTINGS_FILE = path.join(process.cwd(), 'data', 'settings.json');

// Fallback: czytanie z pliku (działa lokalnie)
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

// Fallback: zapis do pliku (działa lokalnie)
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
    
    // Jeśli Supabase jest skonfigurowane, użyj go
    if (supabase) {
      const { data, error } = await supabase
        .from('settings')
        .select('value')
        .eq('key', SETTINGS_KEYS.PRODUCT_SETTINGS)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = not found
        console.error('Błąd Supabase:', error);
        // Fallback do pliku
        const fileSettings = readSettingsFromFile();
        return NextResponse.json(fileSettings.productSettings || {});
      }

      if (data) {
        return NextResponse.json(data.value || {});
      }
      
      // Jeśli nie ma danych, zwróć pusty obiekt
      return NextResponse.json({});
    }

    // Fallback: użyj pliku (działa lokalnie)
    const settings = readSettingsFromFile();
    return NextResponse.json(settings.productSettings || {});
  } catch (error) {
    console.error('Błąd podczas ładowania ustawień produktów:', error);
    const fileSettings = readSettingsFromFile();
    return NextResponse.json(fileSettings.productSettings || {});
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId, settings: newSettings } = body;

    if (!productId || typeof productId !== 'string') {
      return NextResponse.json({ error: 'Brak productId' }, { status: 400 });
    }

    const supabase = createSupabaseClient();

    if (supabase) {
      // Pobierz aktualne ustawienia z Supabase
      const { data: existingData } = await supabase
        .from('settings')
        .select('value')
        .eq('key', SETTINGS_KEYS.PRODUCT_SETTINGS)
        .single();

      const currentSettings = existingData?.value || {};
      
      // Zaktualizuj ustawienia dla konkretnego produktu
      currentSettings[productId] = {
        ...currentSettings[productId],
        ...newSettings,
      };

      // Zapisz do Supabase (upsert = insert or update)
      const { error } = await supabase
        .from('settings')
        .upsert({
          key: SETTINGS_KEYS.PRODUCT_SETTINGS,
          value: currentSettings,
          updated_at: new Date().toISOString(),
        });

      if (error) {
        console.error('Błąd Supabase:', error);
        // Fallback do pliku
        const fileSettings = readSettingsFromFile();
        fileSettings.productSettings = fileSettings.productSettings || {};
        fileSettings.productSettings[productId] = {
          ...fileSettings.productSettings[productId],
          ...newSettings,
        };
        writeSettingsToFile(fileSettings);
      } else {
        return NextResponse.json({ success: true });
      }
    } else {
      // Fallback: użyj pliku (działa lokalnie)
      const fileSettings = readSettingsFromFile();
      if (!fileSettings.productSettings) {
        fileSettings.productSettings = {};
      }
      fileSettings.productSettings[productId] = {
        ...fileSettings.productSettings[productId],
        ...newSettings,
      };
      writeSettingsToFile(fileSettings);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Błąd podczas zapisywania ustawień produktu:', error);
    return NextResponse.json({ error: 'Błąd podczas zapisywania ustawień' }, { status: 500 });
  }
}
