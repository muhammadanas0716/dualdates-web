import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientHydrationFix from "@/components/ClientHydrationFix";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DualDates – Islamic Calendar & Prayer Times for macOS",
  description:
    "A beautiful menu bar app that displays Islamic dates, prayer times, and inspirational quotes directly in your Mac menu bar.",
  keywords: [
    "Islamic calendar",
    "prayer times",
    "Hijri calendar",
    "macOS app",
    "menu bar app",
    "Muslim app",
  ],
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icon.png" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ClientHydrationFix />
        {children}
      </body>
    </html>
  );
}
