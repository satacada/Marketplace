/**
 * ============================================================================
 * FILE: LayoutWrapper.tsx
 * ============================================================================
 * 
 * @description Wrapper de layout que muestra/oculta sidebar según ruta.
 *              Las rutas del Marketplace (/marketplace, /marketplace/cart, etc.)
 *              son públicas y usan la barra superior Header.
 *              El Sidebar se reserva exclusivamente para las rutas de /dashboard.
 * 
 * @module Presentation/Components/Layout
 * ============================================================================
 */

'use client';

import { Suspense } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import { ThemeProvider } from '@/shared/theme/ThemeContext';

function SidebarWrapper() {
  return (
    <Suspense fallback={<div className="w-64 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 min-h-screen" />}>
      <Sidebar />
    </Suspense>
  );
}

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // El Sidebar se muestra ÚNICAMENTE en las rutas privadas del Dashboard
  const isDashboardRoute = pathname.startsWith('/dashboard');

  return (
    <ThemeProvider>
      {!isDashboardRoute ? (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 transition-colors duration-300">
          {children}
        </div>
      ) : (
        <div className="flex min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 transition-colors duration-300">
          <SidebarWrapper />
          <main className="flex-1 overflow-x-hidden">
            {children}
          </main>
        </div>
      )}
    </ThemeProvider>
  );
}