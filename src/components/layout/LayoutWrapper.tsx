/**
 * ============================================================================
 * FILE: LayoutWrapper.tsx
 * ============================================================================
 * 
 * @description Wrapper de layout que muestra/oculta sidebar según ruta.
 *              Controla qué rutas son públicas y cuáles requieren autenticación.
 * 
 * @module Presentation/Components/Layout
 * 
 * @author System
 * @created 2026-07-16
 * 
 * @dependencies
 * - react
 * - @/components/layout/Sidebar
 * 
 * @related-files
 * - @/components/layout/Sidebar.tsx
 * - @/components/layout/Header.tsx
 * 
 * @exports
 * - LayoutWrapper (default)
 * 
 * ============================================================================
 */

'use client';

import { Suspense } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';

function SidebarWrapper() {
  return (
    <Suspense fallback={<div className="w-64 bg-gray-800 min-h-screen" />}>
      <Sidebar />
    </Suspense>
  );
}

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Rutas donde NO debe mostrarse el sidebar (rutas públicas)
  const publicRoutes = ['/auth', '/marketplace'];

  // Verificar si la ruta actual es pública (match exacto o empieza con /auth/)
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );

  if (isPublicRoute) {
    return <>{children}</>;
  }

  // Para el resto, mostrar sidebar + contenido
  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarWrapper />
      <main className="flex-1 w-full pl-64">
        {children}
      </main>
    </div>
  );
}