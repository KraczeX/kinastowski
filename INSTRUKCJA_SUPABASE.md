# Instrukcja: Synchronizacja ustawień między urządzeniami na Netlify

## ⚠️ WAŻNE - Przeczytaj najpierw!

**Produkty są w pliku `felgeo.csv` - to się NIE zmienia!**

W Supabase przechowujemy **TYLKO ustawienia**:
- ✅ Globalna prowizja (włączona/wyłączona, wartość %)
- ✅ Ustawienia produktów (customowa prowizja, dostępność, ukrycie)

Wszystkie produkty nadal są w pliku CSV i są czytane przez `/api/felgi`.

---

## Krok 1: Instalacja pakietu Supabase

**W terminalu w folderze projektu** uruchom:

```bash
npm install @supabase/supabase-js
```

---

## Krok 2: Założenie konta na Supabase

1. Wejdź na stronę: https://supabase.com
2. Kliknij **"Start your project"** lub **"Sign up"**
3. Zarejestruj się (możesz użyć GitHub, Google lub email)
4. Potwierdź email jeśli trzeba

---

## Krok 3: Utworzenie nowego projektu

1. Po zalogowaniu kliknij **"New Project"**
2. Wypełnij formularz:
   - **Organization**: Wybierz organizację (lub utwórz nową)
   - **Name**: Nadaj nazwę projektowi (np. `wulkanizacja-settings`)
   - **Database Password**: Wymyśl silne hasło (ZAPISZ JE - będziesz potrzebować później!)
   - **Region**: Wybierz najbliższy region (np. `West EU (Ireland)` dla Polski)
3. Kliknij **"Create new project"**
4. Poczekaj 1-2 minuty aż projekt się utworzy

---

## Krok 4: Utworzenie tabeli w bazie danych

1. W lewym menu kliknij **"SQL Editor"** (ikona bazy danych)
2. Kliknij **"New query"**
3. Skopiuj i wklej poniższy kod SQL:

```sql
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Utwórz indeks dla szybszego wyszukiwania
CREATE INDEX IF NOT EXISTS idx_settings_updated_at ON settings(updated_at);
```

4. Kliknij **"Run"** (lub naciśnij Ctrl+Enter / Cmd+Enter)
5. Powinieneś zobaczyć komunikat "Success. No rows returned"

---

## Krok 5: Pobranie kluczy API

1. W lewym menu kliknij **"Project Settings"** (ikona koła zębatego ⚙️)
2. Kliknij **"API"** w lewym menu ustawień
3. Znajdź i skopiuj:
   - **Project URL** - to będzie `NEXT_PUBLIC_SUPABASE_URL`
     - Przykład: `https://abcdefghijklmnop.supabase.co`
   - **anon/public key** - to będzie `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - To długi ciąg zaczynający się od `eyJhbGci...`
   - (Opcjonalnie zapisz też **service_role key** - na wszelki wypadek, ale NIE używaj go w kodzie frontend!)

---

## Krok 6: Dodanie zmiennych środowiskowych lokalnie

1. W głównym folderze projektu utwórz plik `.env.local` (jeśli nie istnieje)
2. Otwórz go w edytorze
3. Dodaj do niego:

```
NEXT_PUBLIC_SUPABASE_URL=twoj-project-url-z-kroku-5
NEXT_PUBLIC_SUPABASE_ANON_KEY=twoj-anon-key-z-kroku-5
```

**WAŻNE**: Zamień `twoj-project-url-z-kroku-5` i `twoj-anon-key-z-kroku-5` na prawdziwe wartości z Supabase!

**Przykład jak to może wyglądać:**
```
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.abcdefghijklmnopqrstuvwxyz1234567890
```

4. Zapisz plik

---

## Krok 7: Dodanie zmiennych środowiskowych w Netlify

1. Zaloguj się do Netlify: https://app.netlify.com
2. Wybierz swój projekt (site)
3. Przejdź do **"Site configuration"** (lub **"Site settings"**)
4. Kliknij **"Environment variables"** w lewym menu
5. Kliknij **"Add a variable"** lub **"Add variable"**
6. Dodaj pierwszą zmienną:
   - **Key**: `NEXT_PUBLIC_SUPABASE_URL`
   - **Value**: (wklej URL z Supabase z Kroku 5)
   - **Scopes**: Wybierz "All scopes" (lub zaznacz "Production", "Deploy Previews", "Branch Deploys")
   - Kliknij **"Create variable"** lub **"Add variable"**
7. Kliknij ponownie **"Add a variable"**
8. Dodaj drugą zmienną:
   - **Key**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Value**: (wklej anon key z Supabase z Kroku 5)
   - **Scopes**: Wybierz "All scopes"
   - Kliknij **"Create variable"** lub **"Add variable"**

---

## Krok 8: Deploy projektu na Netlify

Po dodaniu zmiennych środowiskowych:

1. W Netlify przejdź do **"Deploys"**
2. Jeśli masz automatyczny deploy z Git:
   - Zrób commit i push zmian
   - Deploy nastąpi automatycznie
3. Jeśli NIE masz automatycznego deployu:
   - Zbuduj projekt: `npm run build`
   - Przeciągnij folder do Netlify (Drag & Drop)

**WAŻNE**: Po pierwszym deployu z nowymi zmiennymi środowiskowymi, **zrób "Retry deploy"** lub **"Trigger deploy"** aby upewnić się że zmienne zostały załadowane!

---

## Krok 9: Testowanie

1. Po deployu wejdź na swoją stronę na Netlify
2. Zaloguj się do panelu administracyjnego (`/admin`)
3. Zmień ustawienia prowizji globalnej (np. włącz prowizję 10%)
4. Zapisz zmiany
5. Otwórz stronę na **innym urządzeniu** lub w **innej przeglądarce** (lub oknie incognito)
6. Zaloguj się do panelu administracyjnego
7. **Ustawienia powinny być zsynchronizowane!** (prowizja 10% powinna być widoczna)

---

## Rozwiązywanie problemów

### Błąd: "Failed to fetch" przy zapisie ustawień
- ✅ Sprawdź czy zmienne środowiskowe są poprawnie ustawione w Netlify
- ✅ Sprawdź czy URL i klucz API są poprawne (bez spacji, całkowicie skopiowane)
- ✅ Sprawdź konsolę przeglądarki (F12 → Console) czy nie ma błędów
- ✅ Sprawdź czy zrobiłeś retry deploy po dodaniu zmiennych środowiskowych

### Błąd: "relation settings does not exist"
- ✅ Upewnij się że tabela została utworzona w SQL Editor (Krok 4)
- ✅ Sprawdź czy wykonałeś kod SQL (kliknąłeś "Run")
- ✅ Sprawdź czy nie było błędów w SQL Editor

### Dane nie synchronizują się między urządzeniami
- ✅ Sprawdź czy zmienne środowiskowe są ustawione zarówno lokalnie (`.env.local`) jak i w Netlify
- ✅ Sprawdź czy kod został zaktualizowany (commit + push)
- ✅ Sprawdź czy deploy się powiódł (Netlify → Deploys)
- ✅ Odśwież stronę (Ctrl+F5 / Cmd+Shift+R) aby wyczyścić cache
- ✅ Sprawdź czy w Netlify Functions nie ma błędów (Netlify → Functions)

### Aplikacja działa lokalnie ale nie na Netlify
- ✅ Sprawdź czy zmienne środowiskowe są w Netlify (Krok 7)
- ✅ Sprawdź czy zrobiłeś retry deploy po dodaniu zmiennych
- ✅ Sprawdź logi Netlify (Netlify → Functions → View logs)

---

## Co dalej?

Po skonfigurowaniu wszystko powinno działać automatycznie:
- ✅ Ustawienia zapisują się do Supabase
- ✅ Synchronizują się między wszystkimi urządzeniami
- ✅ Działa w czasie rzeczywistym
- ✅ Produkty nadal są w CSV (nic się nie zmienia)

**Uwaga**: Kod ma fallback do localStorage i plików, więc jeśli Supabase nie jest skonfigurowane, aplikacja nadal działa lokalnie.

---

## Pomoc

Jeśli masz problemy:
1. Sprawdź konsolę przeglądarki (F12 → Console)
2. Sprawdź logi Netlify Functions (Netlify Dashboard → Functions → View logs)
3. Sprawdź logi Supabase (Supabase Dashboard → Logs → API logs)
