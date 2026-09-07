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
              <div className="flex items-center gap-2">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 font-extrabold px-3 py-1.5 rounded-xl transition text-xs shadow-2xs"
                  title="Ir a Mi Panel de Usuario"
                >
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-black uppercase">
                    {displayName[0]}
                  </span>
                  <span className="max-w-[120px] truncate">{displayName}</span>
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="p-1.5 px-2.5 text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900 border border-rose-200 dark:border-rose-800 rounded-xl transition cursor-pointer flex items-center gap-1"
                  title="Cerrar Sesión"
                >
                  <span>🚪</span>
                  <span className="hidden md:inline">Salir</span>
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