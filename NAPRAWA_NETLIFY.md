# Naprawa błędu builda na Netlify

## Problem
Netlify próbuje użyć `pnpm`, ale `pnpm-lock.yaml` nie jest zsynchronizowany z `package.json` po dodaniu `@supabase/supabase-js`.

**Błąd:**
```
ERR_PNPM_OUTDATED_LOCKFILE  Cannot install with "frozen-lockfile" because pnpm-lock.yaml is not up to date
specifiers in the lockfile don't match specifiers in package.json:
* 1 dependencies were added: @supabase/supabase-js@^2.89.0
```

## Rozwiązanie - KROK PO KROKU:

### Krok 1: Usuń pnpm-lock.yaml z repozytorium

W terminalu w folderze projektu:

```bash
git rm pnpm-lock.yaml
git commit -m "Remove pnpm-lock.yaml to use npm on Netlify"
git push
```

**Dlaczego?** Netlify automatycznie wykryje `package-lock.json` i użyje `npm` zamiast `pnpm`.

### Krok 2: Sprawdź czy zmiany zostały wypushowane

Po pushu, Netlify automatycznie zacznie nowy deploy. Powinien teraz:
- Użyć `npm` zamiast `pnpm`
- Użyć `package-lock.json` (który jest już zaktualizowany)
- Build powinien przejść pomyślnie ✅

## Co już jest gotowe:

✅ `package.json` - zawiera `@supabase/supabase-js`  
✅ `package-lock.json` - zaktualizowany z nowym pakietem  
✅ `netlify.toml` - skonfigurowany z pluginem Next.js  
✅ `@netlify/plugin-nextjs` - zainstalowany jako devDependency  
✅ Build lokalnie działa (sprawdzone: `npm run build` przechodzi)

## Jeśli build nadal nie działa:

1. **Sprawdź logi Netlify:**
   - Wejdź do Netlify Dashboard → Deploys → Otwórz najnowszy deploy → "Deploy log"
   - Skopiuj błędy i sprawdź co poszło nie tak

2. **Sprawdź czy wszystkie pliki są w repo:**
   ```bash
   git status
   ```
   - Upewnij się że `netlify.toml` jest zacommitowany
   - Upewnij się że `package.json` jest zaktualizowany

3. **Zrób retry deploy w Netlify:**
   - Netlify Dashboard → Deploys → Kliknij "..." → "Retry deploy"

## Po naprawieniu:

Po usunięciu `pnpm-lock.yaml` i pushu, Netlify powinien:
- ✅ Wykryć zmiany
- ✅ Zrobić nowy deploy
- ✅ Użyć npm (zamiast pnpm)
- ✅ Build powinien przejść pomyślnie

