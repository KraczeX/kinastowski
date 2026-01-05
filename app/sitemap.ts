import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.kinastowski.pl';

  // Statyczne strony
  const routes = [
    '',
    '/felgi',
    '/gallery',
    '/sklep',
    '/sklep/felgi',
    '/sklep/opony',
    '/sklep/akcesoria',
    '/privacy',
    '/regulamin',
    '/faq',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' as const : 'weekly' as const,
    priority: route === '' ? 1 : route.startsWith('/sklep') ? 0.8 : 0.7,
  }));

  return routes;
}

