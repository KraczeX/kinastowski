# Instrukcja: Jak dodać zdjęcia z Facebooka do strony

## Metoda 1: Pobranie zdjęć ręcznie (Zalecane)

### Krok 1: Pobierz zdjęcia z Facebooka
1. Otwórz profil: https://www.facebook.com/profile.php?id=100071502295839&sk=photos
2. Kliknij prawym przyciskiem myszy na zdjęcie
3. Wybierz "Zapisz obraz jako..." (lub "Save image as...")
4. Zapisz zdjęcie w folderze `my-app/public/images/`

### Krok 2: Nazwij zdjęcia
- Główne zdjęcie (dla sekcji Hero): `hero.jpg`
- Zdjęcia do galerii: `gallery1.jpg`, `gallery2.jpg`, `gallery3.jpg`, itd.

### Krok 3: Zaktualizuj komponenty

#### Hero.tsx (linia ~7)
```typescript
const heroImage = '/images/hero.jpg';
```

#### Gallery.tsx (linia ~8)
```typescript
const images = [
  '/images/gallery1.jpg',
  '/images/gallery2.jpg',
  '/images/gallery3.jpg',
  // dodaj więcej zdjęć...
];
```

## Metoda 2: Użycie URL-i bezpośrednio z Facebooka

### Krok 1: Skopiuj URL zdjęcia
1. Kliknij prawym przyciskiem na zdjęcie na Facebooku
2. Wybierz "Kopiuj adres obrazu" (lub "Copy image address")
3. Skopiowany URL będzie wyglądał np.: `https://scontent-xxx.fbcdn.net/v/...`

### Krok 2: Użyj URL w komponentach

#### Hero.tsx
```typescript
const heroImage = 'https://scontent-xxx.fbcdn.net/v/...'; // wklej URL tutaj
```

#### Gallery.tsx
```typescript
const images = [
  'https://scontent-xxx.fbcdn.net/v/...', // URL pierwszego zdjęcia
  'https://scontent-xxx.fbcdn.net/v/...', // URL drugiego zdjęcia
  // dodaj więcej URL-i...
];
```

**Uwaga:** URL-e z Facebooka mogą wygasnąć po pewnym czasie. Zalecane jest pobranie zdjęć lokalnie (Metoda 1).

## Struktura folderów

```
my-app/
  public/
    images/
      hero.jpg          ← Główne zdjęcie
      gallery1.jpg      ← Zdjęcia do galerii
      gallery2.jpg
      gallery3.jpg
      ...
```

## Sprawdzenie

Po dodaniu zdjęć:
1. Uruchom serwer: `pnpm dev`
2. Sprawdź, czy zdjęcia się wyświetlają
3. Jeśli zdjęcie się nie wyświetla, sprawdź:
   - Czy plik istnieje w folderze `public/images/`
   - Czy nazwa pliku jest poprawna (bez spacji, małe litery)
   - Czy ścieżka w komponencie jest poprawna

