import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'scontent-*.fbcdn.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.facebook.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'felgeo.pl',
        pathname: '/**',
      },
    ],
  },
  compress: true,
  poweredByHeader: false,
};

export default nextConfig;
