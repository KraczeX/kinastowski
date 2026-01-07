# Sprawdzenie konfiguracji Supabase

## Problem: Prowizja nie synchronizuje się między urządzeniami

Jeśli prowizja działa tylko lokalnie, ale nie na innych urządzeniach, oznacza to że:
- ✅ Ustawienia zapisują się do localStorage (działa lokalnie)
- ❌ Ustawienia NIE zapisują się do Supabase (nie działają między urządzeniami)

## Sprawdź krok po kroku:

### 1. Czy dodałeś zmienne środowiskowe w Netlify? (KROK 7 instrukcji)

**W Netlify Dashboard:**
1. Wejdź do swojego projektu
2. Przejdź do **"Site configuration"** → **"Environment variables"**
3. Sprawdź czy masz:
   - `NEXT_PUBLIC_SUPABASE_URL` (z wartością)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (z wartością)

**Jeśli NIE masz tych zmiennych:**
- Wykonaj **Krok 7** z `INSTRUKCJA_SUPABASE.md`
- Dodaj obie zmienne
- Zrób **"Retry deploy"** w Netlify

### 2. Czy utworzyłeś tabelę w Supabase? (KROK 4 instrukcji)

**W Supabase Dashboard:**
1. Wejdź do SQL Editor
2. Sprawdź czy tabela `settings` istnieje:
   - Kliknij **"Table Editor"** w lewym menu
   - Powinna być tabela `settings` z kolumnami: `key`, `value`, `updated_at`

**Jeśli tabeli NIE ma:**
- Wykonaj **Krok 4** z `INSTRUKCJA_SUPABASE.md`
- Utwórz tabelę używając SQL

### 3. Sprawdź konsolę przeglądarki (F12)

Otwórz konsolę (F12 → Console) i sprawdź czy są błędy:
- `Błąd podczas zapisywania ustawień prowizji do API` - oznacza problem z API
- `Supabase credentials not found` - oznacza brak zmiennych środowiskowych
- `Failed to fetch` - oznacza problem z połączeniem do API

### 4. Sprawdź logi Netlify Functions

**W Netlify Dashboard:**
1. Wejdź do **"Functions"**
2. Sprawdź logi dla `/api/settings/commission`
3. Sprawdź czy są błędy połączenia z Supabase

## Najczęstsze problemy:

### Problem 1: Brak zmiennych środowiskowych w Netlify
**Rozwiązanie:** Wykonaj Krok 7 z instrukcji

### Problem 2: Supabase nie jest skonfigurowane
**Rozwiązanie:** Wykonaj Kroki 1-6 z instrukcji

### Problem 3: Tabela nie istnieje w Supabase
**Rozwiązanie:** Wykonaj Krok 4 z instrukcji (utwórz tabelę)

### Problem 4: Zmienne środowiskowe są błędne
**Rozwiązanie:** 
- Sprawdź czy URL i klucz są poprawnie skopiowane (bez spacji)
- Sprawdź czy wartości zaczynają się od `https://` (URL) i `eyJ` (key)

## Co zrobiłem w kodzie:

✅ Dodałem synchronizację z API w `Sklep.tsx` (przy starcie)
✅ Dodałem synchronizację z API w `ProduktDetails.tsx` (przy starcie)
✅ Kod automatycznie próbuje synchronizować ustawienia z Supabase

**Teraz musisz tylko:**
1. Ustawić zmienne środowiskowe w Netlify (jeśli jeszcze nie)
2. Zrobić retry deploy
3. Sprawdzić czy działa


