# Jak sprawdzić czy Supabase działa?

## Szybki test:

1. **Otwórz konsolę przeglądarki** (F12 → Console)
2. **Wejdź na stronę** (np. `/sklep` lub `/admin`)
3. **Sprawdź czy są błędy** w konsoli:
   - ❌ `Błąd podczas synchronizacji ustawień prowizji z API` → Problem z API/Supabase
   - ❌ `Failed to fetch` → Problem z połączeniem do API
   - ✅ Brak błędów → Prawdopodobnie działa

## Główny problem - brak zmiennych środowiskowych w Netlify

**Jeśli prowizja działa lokalnie, ale NIE na Netlify**, oznacza to że:
- ✅ Kod działa (lokalnie)
- ❌ **Brakuje zmiennych środowiskowych w Netlify** (Krok 7)

## Rozwiązanie - KROK PO KROKU:

### 1. Sprawdź czy masz zmienne w Netlify:

**W Netlify Dashboard:**
1. Wejdź do swojego projektu
2. Przejdź do **"Site configuration"** (lub **"Site settings"**)
3. Kliknij **"Environment variables"** w lewym menu
4. Sprawdź czy masz:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 2. Jeśli NIE MASZ tych zmiennych:

**Wykonaj Krok 7 z `INSTRUKCJA_SUPABASE.md`:**

1. W Netlify Dashboard → **Environment variables**
2. Kliknij **"Add variable"**
3. Dodaj pierwszą zmienną:
   - **Key**: `NEXT_PUBLIC_SUPABASE_URL`
   - **Value**: (wklej URL z Supabase - Krok 5 instrukcji)
   - **Scopes**: Wybierz "All scopes"
   - Kliknij **"Create variable"**
4. Kliknij ponownie **"Add variable"**
5. Dodaj drugą zmienną:
   - **Key**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Value**: (wklej anon key z Supabase - Krok 5 instrukcji)
   - **Scopes**: Wybierz "All scopes"
   - Kliknij **"Create variable"**

### 3. PO DODANIU ZMIENNYCH - WAŻNE!

**Musisz zrobić retry deploy:**
1. W Netlify Dashboard → **Deploys**
2. Kliknij **"..."** (trzy kropki) przy najnowszym deployu
3. Wybierz **"Retry deploy"**

**Dlaczego?** Netlify ładuje zmienne środowiskowe tylko przy starcie buildu. Jeśli dodałeś zmienne po deployu, musisz zrobić retry.

### 4. Sprawdź czy działa:

1. Po retry deploy, poczekaj aż build się skończy
2. Wejdź na stronę na Netlify
3. Otwórz w **incognito** lub na **innym urządzeniu**
4. Zaloguj się do panelu admina
5. **Prowizja powinna być zsynchronizowana!** ✅

## Jeśli nadal nie działa:

1. **Sprawdź konsolę przeglądarki** (F12) - są błędy?
2. **Sprawdź logi Netlify Functions:**
   - Netlify Dashboard → Functions → View logs
   - Sprawdź `/api/settings/commission`
3. **Sprawdź czy Supabase działa:**
   - Supabase Dashboard → Table Editor → Sprawdź czy tabela `settings` ma dane

## Co zrobiłem w kodzie:

✅ Dodałem automatyczną synchronizację z API w `Sklep.tsx` (przy starcie strony)
✅ Dodałem automatyczną synchronizację z API w `ProduktDetails.tsx` (przy starcie strony)
✅ Komponenty teraz automatycznie ładują ustawienia z Supabase

**Teraz musisz tylko dodać zmienne środowiskowe w Netlify i zrobić retry deploy!**



