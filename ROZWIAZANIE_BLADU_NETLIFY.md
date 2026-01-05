# Rozwiązanie błędu builda na Netlify

## Problem
Netlify próbuje użyć `pnpm`, ale `pnpm-lock.yaml` nie jest zsynchronizowany z `package.json` po dodaniu `@supabase/supabase-js`.

## Rozwiązanie - Opcja 1: Usuń pnpm-lock.yaml (REKOMENDOWANE)

Netlify automatycznie użyje `npm` jeśli nie ma `pnpm-lock.yaml` (a masz `package-lock.json`).

**W terminalu w folderze projektu:**
```bash
git rm pnpm-lock.yaml
git commit -m "Remove pnpm-lock.yaml to use npm on Netlify"
git push
```

To spowoduje, że Netlify użyje `npm` zamiast `pnpm`, co rozwiąże problem.

---

## Rozwiązanie - Opcja 2: Zaktualizuj pnpm-lock.yaml (jeśli chcesz używać pnpm)

Jeśli chcesz używać `pnpm` na Netlify:

1. **Zainstaluj pnpm lokalnie:**
   ```bash
   npm install -g pnpm
   ```

2. **Zaktualizuj lockfile:**
   ```bash
   pnpm install
   ```

3. **Zacommituj zmiany:**
   ```bash
   git add pnpm-lock.yaml
   git commit -m "Update pnpm-lock.yaml with @supabase/supabase-js"
   git push
   ```

---

## Które rozwiązanie wybrać?

**Opcja 1 (usuń pnpm-lock.yaml)** jest prostsza, bo:
- Nie wymaga instalacji pnpm
- package-lock.json jest już zaktualizowany
- npm działa dobrze z Next.js na Netlify

**Opcja 2 (zaktualizuj pnpm-lock.yaml)** jeśli:
- Wolisz używać pnpm
- Masz już pnpm zainstalowany

---

## Po naprawieniu

Po wykonaniu jednej z opcji, Netlify powinien:
1. Wykryć zmiany w repo
2. Zrobić nowy deploy
3. Udać się bez błędów

