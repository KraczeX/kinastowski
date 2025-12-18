# Instrukcja dodawania zdjęć z Facebooka

## Sposób 1: Pobranie zdjęć ręcznie

1. Wejdź na profil Facebook: https://www.facebook.com/profile.php?id=100071502295839&sk=photos
2. Kliknij prawym przyciskiem na zdjęcie i wybierz "Zapisz obraz jako..."
3. Zapisz zdjęcia w tym folderze (`public/images/`)
4. Nazwij zdjęcia np.: `hero.jpg`, `gallery1.jpg`, `gallery2.jpg`, itd.

## Sposób 2: Użycie URL-i bezpośrednio z Facebooka

1. Kliknij prawym przyciskiem na zdjęcie na Facebooku
2. Wybierz "Kopiuj adres obrazu"
3. Wklej URL do komponentu Gallery.tsx lub Hero.tsx

## Aktualizacja komponentów

### Hero.tsx
Zmień linię z `heroImage` na:
```typescript
const heroImage = '/images/hero.jpg'; // lub URL z Facebooka
```

### Gallery.tsx
Dodaj zdjęcia do tablicy `images`:
```typescript
const images = [
  '/images/gallery1.jpg',
  '/images/gallery2.jpg',
  // lub URL-e z Facebooka
];
```

