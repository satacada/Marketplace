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
          {/* Logo / Nombre del sitio */}
          <div className="flex items-center gap-3">
            <Link href="/marketplace" className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition flex items-center gap-2">
              <span className="text-2xl">🛒</span>
              <span>Marketplace</span>
            </Link>
            {title && <h1 className="text-lg font-semibold text-gray-700 dark:text-slate-200 hidden sm:inline-block border-l border-gray-300 dark:border-slate-700 pl-3">{title}</h1>}
          </div>

          {/* Acciones del Header: Cart Pill Widget + Indicadores + Cuenta de Usuario */}
          <div className="flex items-center gap-3">
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
              <span className="text-base text-gray-500 dark:text-slate-400 group-hover:text-blue-600 transition">🛒</span>
            </Link>

            {/* Cantidad escueta de pedidos (si está autenticado) */}
            {isAuthenticated && ordersCount !== undefined && (
              <Link
                href="/dashboard/orders"
                className="hidden md:flex items-center gap-1.5 text-xs font-medium text-gray-600 dark:text-slate-300 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 px-3 py-1.5 rounded-full transition"
                title="Ver mis pedidos"
              >
                <span>📦</span>
                <span>{ordersCount} {ordersCount === 1 ? 'pedido' : 'pedidos'}</span>
              </Link>
            )}

            {/* Estado de Cuenta del Usuario en el Header */}
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard"
                  className="text-gray-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-semibold text-sm transition"
                  title="Ir a Mi Panel de Usuario"
                >
                  {displayName}
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="p-2 text-gray-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition cursor-pointer flex items-center justify-center"
                  title="Cerrar Sesión"
                  aria-label="Cerrar Sesión"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                    <polyline points="10 17 15 12 10 7" />
                    <line x1="15" y1="12" x2="3" y2="12" />
                  </svg>
                </button>
              </div>
            ) : (
              <Link
                href="/auth"
                className="flex items-center gap-1.5 border border-gray-300 dark:border-slate-700 hover:border-blue-500 text-gray-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 px-3.5 py-1.5 rounded-lg hover:bg-blue-50/40 dark:hover:bg-slate-800 transition text-sm font-medium"
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