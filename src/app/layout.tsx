import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import LayoutWrapper from "@/components/layout/LayoutWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Marketplace SaaS",
  description: "Marketplace Multi-Tenant construido con Next.js y Supabase",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-white dark:bg-slate-950 text-gray-900 dark:text-slate-100" suppressHydrationWarning>
        <Suspense fallback={<div className="min-h-screen bg-gray-50 dark:bg-slate-950" />}>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </Suspense>
      </body>
    </html>
  );
}