import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { parseCSV } from '@/lib/felgi-data';

// Cache dla danych (w pamięci serwera)
let cachedData: any = null;
let lastModified: number = 0;

export async function GET() {
  try {
    const csvPath = path.join(process.cwd(), 'app', 'sklep', 'felgeo.csv');
    const stats = fs.statSync(csvPath);
    
    // Sprawdź czy plik został zmodyfikowany
    if (cachedData && stats.mtimeMs === lastModified) {
      return NextResponse.json(cachedData, {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      });
    }

    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const data = parseCSV(csvContent);
    
    cachedData = data;
    lastModified = stats.mtimeMs;

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Błąd podczas ładowania danych felg:', error);
    return NextResponse.json({ error: 'Błąd podczas ładowania danych' }, { status: 500 });
  }
}


