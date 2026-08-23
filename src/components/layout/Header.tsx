/**
 * ============================================================================
 * FILE: Header.tsx
 * ============================================================================
 * 
 * @description Componente de header reutilizable con navegación.
 *              Utiliza useAuth hook para gestión de autenticación.
 * 
 * @module Presentation/Components/Layout
 * 
 * @author System
 * @created 2026-07-16
 * 
 * @dependencies
 * - react
 * - @/features/auth/hooks/useAuth
 * 
 * @related-files
 * - @/components/layout/Sidebar.tsx
 * - @/components/layout/LayoutWrapper.tsx
 * 
 * @exports
 * - Header (default)
 * 
 * ============================================================================
 */

'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/hooks/useAuth';

export interface HeaderProps {
  title: string;
  cartItemCount?: number;
  isMarketplacePublic?: boolean;
}

export default function Header({ title, cartItemCount, isMarketplacePublic = false }: HeaderProps) {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <Link href="/marketplace" className="text-2xl font-bold text-indigo-600 hover:text-indigo-800 transition">
              🛒 Marketplace
            </Link>
            {title && <h1 className="text-xl font-semibold text-gray-900">{title}</h1>}
          </div>
          <div className="flex gap-2">
            {isMarketplacePublic && !isAuthenticated ? (
              // Marketplace público sin login: solo botón de cuenta
              <Link href="/auth" className="flex items-center gap-2 border-2 border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition text-sm">
                 👤 Cuenta
              </Link>
            ) : isAuthenticated ? (
              // Usuario autenticado: carrito y dashboard
              <>
                <Link href="/marketplace/cart" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm">
                   🛒 Carrito {cartItemCount !== undefined ? `(${cartItemCount})` : ''}
                </Link>
                <Link href="/dashboard" className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition text-sm">
                   Mi Dashboard
                </Link>
              </>
            ) : (
              // No autenticado en otras páginas: carrito y cuenta
              <>
                <Link href="/marketplace/cart" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm">
                   🛒 Carrito
                </Link>
                <Link href="/auth" className="flex items-center gap-2 border-2 border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition text-sm">
                   👤 Cuenta
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}