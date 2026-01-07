# Test synchronizacji prowizji

## Sprawdź czy działa krok po kroku:

### 1. Czy zrobiłeś retry deploy po dodaniu zmiennych?

**To jest WAŻNE!** Netlify ładuje zmienne środowiskowe tylko przy starcie buildu.

**Jak sprawdzić:**
- Netlify Dashboard → Deploys
- Sprawdź czy najnowszy deploy był **PO** dodaniu zmiennych środowiskowych
- Jeśli NIE - zrób retry deploy

**Jak zrobić retry deploy:**
- Netlify Dashboard → Deploys
- Kliknij **"..."** (trzy kropki) przy najnowszym deployu
- Wybierz **"Retry deploy"**

### 2. Sprawdź konsolę przeglądarki (F12)

**Na stronie Netlify:**
1. Otwórz konsolę (F12 → Console)
2. Odśwież stronę
3. Sprawdź czy są błędy:
   - `Błąd podczas synchronizacji ustawień prowizji z API`
   - `Failed to fetch`
   - `Supabase credentials not found`

**Co oznaczają błędy:**
- `Failed to fetch` → Problem z połączeniem do API (sprawdź czy deploy się powiódł)
- `Supabase credentials not found` → Zmienne środowiskowe nie są załadowane (retry deploy!)

### 3. Sprawdź czy API endpoint działa

**W konsoli przeglądarki (F12) wklej:**

```javascript
fetch('/api/settings/commission')
  .then(r => r.json())
  .then(d => console.log('Commission settings:', d))
  .catch(e => console.error('Error:', e));
```

**Jeśli zwraca błąd:**
- Sprawdź logi Netlify Functions (Netlify → Functions → View logs)
- Sprawdź czy deploy się powiódł

### 4. Sprawdź czy dane są w Supabase

**W Supabase Dashboard:**
1. Wejdź do **Table Editor**
2. Wybierz tabelę `settings`
3. Sprawdź czy jest wiersz z `key = 'globalCommission'`
4. Sprawdź czy `value` zawiera ustawienia prowizji

**Jeśli tabela jest pusta:**
- Zapisz prowizję w panelu admina (na Netlify)
- Sprawdź czy wiersz się pojawił
- Jeśli NIE - sprawdź logi API w Netlify

### 5. Test pełnej synchronizacji

**Krok 1:** Na Netlify (główna przeglądarka)
1. Wejdź do panelu admina
2. Ustaw prowizję (np. 15%)
3. Zapisz
4. Sprawdź w konsoli czy nie ma błędów

**Krok 2:** Sprawdź w Supabase
1. Supabase Dashboard → Table Editor → `settings`
2. Sprawdź czy wiersz `globalCommission` ma nową wartość

**Krok 3:** Na innym urządzeniu/incognito
1. Otwórz stronę Netlify
2. Wejdź do panelu admina
3. Sprawdź czy prowizja jest taka sama (15%)

**Jeśli nie działa:**
- Sprawdź konsolę przeglądarki na drugim urządzeniu
- Sprawdź czy są błędy synchronizacji

## Najczęstsze problemy:

### Problem 1: Nie zrobiłem retry deploy
**Rozwiązanie:** Zrób retry deploy po dodaniu zmiennych środowiskowych

### Problem 2: Zmienne są błędne
**Rozwiązanie:** 
- Sprawdź czy URL zaczyna się od `https://`
- Sprawdź czy key zaczyna się od `eyJ`
- Sprawdź czy nie ma spacji na początku/końcu

### Problem 3: Tabela nie istnieje w Supabase
**Rozwiązanie:** Wykonaj Krok 4 z instrukcji (utwórz tabelę SQL)

### Problem 4: API nie działa
**Rozwiązanie:** 
- Sprawdź logi Netlify Functions
- Sprawdź czy build się powiódł
- Sprawdź konsolę przeglądarki



