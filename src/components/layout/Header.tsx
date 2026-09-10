/**
 * ============================================================================
 * FILE: Header.tsx
 * ============================================================================
 * 
 * @description Componente de header reutilizable con navegación.
 *              Muestra el nombre del usuario autenticado, acceso a /dashboard
 *              y botón funcional de Cerrar Sesión.
 * 
 * @module Presentation/Components/Layout
 * ============================================================================
 */

'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useCart } from '@/features/cart/hooks/useCart';
import AppIcon from '@/components/ui/icons/AppIcon';
import VisualSearchModal from '@/components/search/VisualSearchModal';
import { useState } from 'react';

export interface HeaderProps {
  title?: string;
  cartItemCount?: number;
  cartTotal?: number;
  ordersCount?: number;
  isMarketplacePublic?: boolean;
}

export default function Header({
  title,
  cartItemCount,
  cartTotal,
  ordersCount,
}: HeaderProps) {
  const router = useRouter();
  const { user, profile, isAuthenticated, logout } = useAuth();
  const { cart } = useCart(user?.id || null);
  const [showVisualSearch, setShowVisualSearch] = useState(false);

  const displayCount = cartItemCount !== undefined ? cartItemCount : cart.itemCount;
  const displayTotal = cartTotal !== undefined ? cartTotal : cart.total;

  const formattedTotal = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(displayTotal || 0);

  const handleLogout = async () => {
    await logout();
    router.push('/marketplace');
  };

  const displayName = profile?.store_name || user?.email?.split('@')[0] || 'Mi Cuenta';

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 sticky top-0 z-40 shadow-xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex flex-row justify-between items-center gap-4">
          {/* Logo / Nombre del sitio + Nombre de usuario/tienda */}
          <div className="flex items-center gap-3">
            <Link href="/marketplace" className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition flex items-center gap-2">
              <AppIcon name="cart" size="lg" />
              <span>Marketplace</span>
            </Link>
            {title && <h1 className="text-lg font-semibold text-gray-700 dark:text-slate-200 hidden sm:inline-block border-l border-gray-300 dark:border-slate-700 pl-3">{title}</h1>}
            {isAuthenticated && (
              <Link
                href="/dashboard"
                className="text-gray-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-semibold text-sm transition border-l border-gray-300 dark:border-slate-700 pl-3"
                title="Ir a Mi Panel de Usuario"
              >
                {displayName}
              </Link>
            )}
          </div>

          {/* Acciones del Header: Búsqueda Visual + Cart Pill Widget + Indicadores + Botón de Salir */}
          <div className="flex items-center gap-3">
            {/* Botón de Búsqueda Visual por Imagen con IA */}
            <button
              type="button"
              onClick={() => setShowVisualSearch(true)}
              className="p-2 border border-gray-300 dark:border-slate-700 hover:border-blue-500 bg-white dark:bg-slate-800 hover:bg-blue-50/40 dark:hover:bg-slate-700/60 rounded-full transition shadow-xs text-gray-600 dark:text-slate-300 hover:text-blue-600 cursor-pointer flex items-center justify-center"
              title="Búsqueda Visual por Imagen con IA"
            >
              <AppIcon name="camera" size="sm" />
            </button>

            {/* Widget de Carrito */}
            <Link
              href="/marketplace/cart"
              className="flex items-center gap-2.5 border border-gray-300 dark:border-slate-700 hover:border-blue-500 bg-white dark:bg-slate-800 hover:bg-blue-50/40 dark:hover:bg-slate-700/60 px-3.5 py-1.5 rounded-full transition shadow-xs group"
              title="Ver Carrito de Compras"
            >
              <div className="relative flex items-center justify-center">
                <span className="w-5 h-5 bg-blue-600 group-hover:bg-blue-700 text-white text-xs font-bold rounded-full flex items-center justify-center transition">
                  {displayCount}
                </span>
              </div>
              <span className="font-semibold text-gray-800 dark:text-slate-100 text-sm group-hover:text-blue-700 dark:group-hover:text-blue-400 transition">
                {formattedTotal}
              </span>
              <AppIcon name="cart" size="sm" className="text-gray-500 dark:text-slate-400 group-hover:text-blue-600" />
            </Link>

            {/* Cantidad escueta de pedidos (si está autenticado) */}
            {isAuthenticated && ordersCount !== undefined && (
              <Link
                href="/dashboard/orders"
                className="hidden md:flex items-center gap-1.5 text-xs font-medium text-gray-600 dark:text-slate-300 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 px-3 py-1.5 rounded-full transition"
                title="Ver mis pedidos"
              >
                <AppIcon name="package" size="xs" />
                <span>{ordersCount} {ordersCount === 1 ? 'pedido' : 'pedidos'}</span>
              </Link>
            )}

            {/* Estado de Cuenta del Usuario en el Header */}
            {isAuthenticated ? (
              <div className="flex items-center gap-1">
                {/* Icono de Usuario (Hombrecito) -> Mi Panel */}
                <Link
                  href="/dashboard"
                  className="p-2 text-gray-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition cursor-pointer flex items-center justify-center"
                  title="Ir a Mi Panel de Usuario"
                  aria-label="Ir a Mi Panel de Usuario"
                >
                  <AppIcon name="user" size="md" />
                </Link>

                {/* Botón de Cerrar Sesión */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="p-2 text-gray-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition cursor-pointer flex items-center justify-center"
                  title="Cerrar Sesión"
                  aria-label="Cerrar Sesión"
                >
                  <AppIcon name="logout" size="md" />
                </button>
              </div>
            ) : (
              <Link
                href="/auth"
                className="flex items-center gap-1.5 border border-gray-300 dark:border-slate-700 hover:border-blue-500 text-gray-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 px-3.5 py-1.5 rounded-lg hover:bg-blue-50/40 dark:hover:bg-slate-800 transition text-sm font-medium"
              >
                <AppIcon name="user" size="sm" />
                <span>Cuenta</span>
              </Link>
            )}
          </div>
        </div>
      </div>
      {/* Modal de Búsqueda Visual por Imagen con IA */}
      {showVisualSearch && (
        <VisualSearchModal
          isOpen={showVisualSearch}
          onClose={() => setShowVisualSearch(false)}
        />
      )}
    </header>
  );
}