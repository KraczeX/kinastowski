# Synchronizacja ustawień między urządzeniami

## Problem
Ustawienia (prowizje, dostępność produktów) są zapisywane w `localStorage`, które działa tylko lokalnie w przeglądarce. Aby synchronizować dane między urządzeniami na Netlify, potrzebujemy backend storage.

## Rozwiązanie - Użycie Supabase (darmowe)

Najprostsze i darmowe rozwiązanie to użycie Supabase jako bazy danych.

### Kroki instalacji:

1. **Utwórz konto na Supabase** (https://supabase.com) - darmowe

2. **Utwórz nowy projekt** w Supabase

3. **Utwórz tabelę w SQL Editor:**
```sql
CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

4. **Zainstaluj Supabase client:**
```bash
npm install @supabase/supabase-js
```

5. **Utwórz plik `.env.local`** z kluczami Supabase:
```
NEXT_PUBLIC_SUPABASE_URL=twoj-url-supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=twoj-anon-key
```

6. **Zaktualizuj API endpoints** aby używały Supabase zamiast plików JSON.

## Alternatywne rozwiązania:

### Option 2: Netlify KV (wymaga płatnego planu)
- Netlify KV to key-value store dla Netlify Functions
- Wymaga Netlify Pro plan ($19/miesiąc)

### Option 3: MongoDB Atlas (darmowe tier)
- Darmowe do 512MB
- Wymaga instalacji drivera MongoDB

### Option 4: PlanetScale (darmowe tier)
- MySQL-compatible database
- Darmowe do 5GB storage

---

**Uwaga:** Obecne rozwiązanie z plikiem JSON działa lokalnie, ale **NIE będzie działać na Netlify** w produkcji, ponieważ Netlify Functions nie mogą zapisywać do systemu plików (tylko /tmp, który jest tymczasowy).

Aktualnie kod ma fallback do localStorage, więc aplikacja będzie działać, ale synchronizacja między urządzeniami nie zadziała bez bazy danych.



