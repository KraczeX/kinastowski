import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
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
    ],
  },
};

export default nextConfig;
