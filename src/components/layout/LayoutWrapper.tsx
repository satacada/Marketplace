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
    <Suspense fallback={<div className="w-64 bg-white border-r border-gray-200 min-h-screen" />}>
      <Sidebar />
    </Suspense>
  );
}

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Rutas que SIEMPRE deben mostrar el Sidebar para navegación continua
  const forceSidebarRoutes = ['/dashboard', '/marketplace/cart', '/marketplace/favorites'];
  const isSidebarForced = forceSidebarRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );

  // Rutas públicas de catálogo, producto y auth donde NO se muestra sidebar
  const isPublicNoSidebar = !isSidebarForced && (
    pathname === '/marketplace' || 
    pathname.startsWith('/marketplace/product/') || 
    pathname.startsWith('/marketplace/store/') || 
    pathname.startsWith('/auth')
  );

  if (isPublicNoSidebar) {
    return <>{children}</>;
  }

  // Para el resto (Dashboard, Carrito, Favoritos, Pedidos, Perfil), mostrar sidebar + contenido
  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarWrapper />
      <main className="flex-1 w-full pl-64">
        {children}
      </main>
    </div>
  );
}