import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import dynamic from "next/dynamic";
import ScrollToTop from "@/components/ScrollToTop";

const CookieBanner = dynamic(() => import("@/components/CookieBanner"));

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
  preload: false,
});

export const metadata: Metadata = {
  title: "Serwis Opon Kinastowski - Profesjonalna Wulkanizacja w Sycowie",
  description: "Profesjonalna wulkanizacja w Sycowie. Wymiana opon, naprawa opon, sprzedaż opon i felg, TPMS.",
  metadataBase: new URL('https://www.kinastowski.pl'),
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ScrollToTop />
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
