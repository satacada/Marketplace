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
  title?: string;
  cartItemCount?: number;
  cartTotal?: number;
  ordersCount?: number;
  isMarketplacePublic?: boolean;
}

export default function Header({
  title,
  cartItemCount = 0,
  cartTotal = 0,
  ordersCount,
  isMarketplacePublic = false,
}: HeaderProps) {
  const { user, isAuthenticated } = useAuth();

  const formattedTotal = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(cartTotal || 0);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex flex-row justify-between items-center gap-4">
          {/* Logo / Nombre del sitio */}
          <div className="flex items-center gap-3">
            <Link href="/marketplace" className="text-2xl font-extrabold text-blue-600 hover:text-blue-700 transition flex items-center gap-2">
              <span className="text-2xl">🛒</span>
              <span>Marketplace</span>
            </Link>
            {title && <h1 className="text-lg font-semibold text-gray-700 hidden sm:inline-block border-l border-gray-300 pl-3">{title}</h1>}
          </div>

          {/* Acciones del Header: Cart Pill Widget + Indicadores + Cuenta */}
          <div className="flex items-center gap-3">
            {/* Widget de Carrito (Pill Button estilo Importadora Mitre) */}
            <Link
              href="/marketplace/cart"
              className="flex items-center gap-2.5 border border-gray-300 hover:border-blue-500 bg-white hover:bg-blue-50/40 px-3.5 py-1.5 rounded-full transition shadow-xs group"
              title="Ver Carrito de Compras"
            >
              <div className="relative flex items-center justify-center">
                <span className="w-5 h-5 bg-blue-600 group-hover:bg-blue-700 text-white text-xs font-bold rounded-full flex items-center justify-center transition">
                  {cartItemCount}
                </span>
              </div>
              <span className="font-semibold text-gray-800 text-sm group-hover:text-blue-700 transition">
                {formattedTotal}
              </span>
              <span className="text-base text-gray-500 group-hover:text-blue-600 transition">🛒</span>
            </Link>

            {/* Cantidad escueta de pedidos (si está autenticado) */}
            {isAuthenticated && ordersCount !== undefined && (
              <Link
                href="/dashboard/orders"
                className="hidden md:flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full transition"
                title="Ver mis pedidos"
              >
                <span>📦</span>
                <span>{ordersCount} {ordersCount === 1 ? 'pedido' : 'pedidos'}</span>
              </Link>
            )}

            {/* Botón de Cuenta / Dashboard */}
            {isAuthenticated ? (
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-3.5 py-1.5 rounded-lg transition text-sm border border-gray-200"
              >
                <span>👤</span>
                <span className="hidden sm:inline">Mi Cuenta</span>
              </Link>
            ) : (
              <Link
                href="/auth"
                className="flex items-center gap-1.5 border border-gray-300 hover:border-blue-500 text-gray-700 hover:text-blue-600 px-3.5 py-1.5 rounded-lg hover:bg-blue-50/40 transition text-sm font-medium"
              >
                <span>👤</span>
                <span>Cuenta</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}