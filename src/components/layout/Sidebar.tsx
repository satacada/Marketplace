/**
 * ============================================================================
 * FILE: Sidebar.tsx
 * ============================================================================
 * @description Componente de navegación lateral con diferención clara de bloques
 *              (Administración, Panel de Vendedor, Mi Cuenta) y tokens de diseño.
 * @module Presentation/Components/Layout
 */

'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useTheme } from '@/shared/theme/ThemeContext';
import { useAuth } from '@/features/auth/hooks/useAuth';
import THEME_CONFIG from '@/shared/theme/theme.config';

function SidebarContent() {
  const { user, profile, logout, isLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [unreadCount, setUnreadCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth');
    }
  }, [user, isLoading, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/auth');
  };

  const isActiveLink = (path: string, param?: string) => {
    const currentParam = searchParams.get('view');
    if (param) {
      return pathname === path && currentParam === param;
    }
    return pathname === path;
  };

  const linkClass = (path: string, param?: string, activeBg = 'bg-blue-600') =>
    `flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all duration-150 ${
      isActiveLink(path, param)
        ? `${activeBg} text-white font-extrabold shadow-2xs`
        : 'text-slate-700 hover:bg-white hover:text-blue-700 font-bold border border-transparent hover:border-slate-200/70 hover:shadow-2xs'
    }`;

  if (isLoading) return null;
  if (!user || !profile) return null;

  const role = profile.role || 'buyer';
  const isAdmin = profile.is_admin || false;
  const email = user.email || profile.email || '';
  const storeName = profile.store_name || 'Mi Cuenta';

  return (
    <aside className="w-64 bg-white text-gray-900 min-h-screen border-r border-gray-200/80 shadow-xs flex flex-col fixed left-0 top-0 bottom-0 overflow-y-auto z-40">
      {/* Cabecera del Perfil estilo Marketplace */}
      <div className="p-5 border-b border-gray-100 bg-slate-50/60">
        <Link href="/marketplace" className="flex items-center gap-2 group mb-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center text-lg shadow-xs group-hover:bg-blue-700 transition">
            🛍️
          </div>
          <div>
            <h2 className="text-base font-black tracking-tight text-gray-900 group-hover:text-blue-600 transition">
              Marketplace
            </h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">SaaS Platform</p>
          </div>
        </Link>

        <div className="pt-2.5 border-t border-gray-200/60">
          <p className="text-xs font-extrabold text-gray-900 truncate">{storeName}</p>
          <p className="text-[11px] text-gray-400 font-medium truncate mb-2">{email}</p>

          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border ${
              role === 'seller' 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                : 'bg-blue-50 text-blue-700 border-blue-200'
            }`}>
              <span>{role === 'seller' ? '✓ Vendedor' : '👤 Comprador'}</span>
            </span>

            {isAdmin && (
              <span className="inline-flex items-center text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                🛡️ Admin
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Menú de navegación contextual con Bloques Diferenciados */}
      <nav className="flex-1 p-3 space-y-3">
        {/* NAVEGACIÓN GENERAL */}
        <div className="px-1 pt-1">
          <Link href="/marketplace" className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs bg-gray-50 hover:bg-blue-50/80 text-gray-800 hover:text-blue-600 font-bold transition border border-gray-200/60">
            <div className="flex items-center gap-2.5">
              <span className="text-sm">🛒</span>
              <span>Explorar Marketplace</span>
            </div>
            <span className="text-xs text-gray-400">→</span>
          </Link>
        </div>

        {/* 1. SECCIÓN ADMINISTRACIÓN (Bloque Púrpura) */}
        {isAdmin && (
          <div className={THEME_CONFIG.sectionCards.admin}>
            <div className="flex items-center justify-between px-2 mb-2">
              <span className={THEME_CONFIG.badges.admin}>
                🛡️ Administración
              </span>
            </div>
            <div className="space-y-1">
              <Link href="/dashboard/admin" className={linkClass('/dashboard/admin', undefined, 'bg-purple-600')}>
                <div className="flex items-center gap-2.5">
                  <span className="text-sm">📊</span>
                  <span>Panel Admin</span>
                </div>
              </Link>
              <Link href="/dashboard/admin/products" className={linkClass('/dashboard/admin/products', undefined, 'bg-purple-600')}>
                <div className="flex items-center gap-2.5">
                  <span className="text-sm">📦</span>
                  <span>Gestión de Productos</span>
                </div>
              </Link>
            </div>
          </div>
        )}

        {/* 2. SECCIÓN PANEL DE VENDEDOR (Bloque Esmeralda) */}
        {role === 'seller' && (
          <div className={THEME_CONFIG.sectionCards.seller}>
            <div className="flex items-center justify-between px-2 mb-2">
              <span className={THEME_CONFIG.badges.seller}>
                🏪 Panel de Vendedor
              </span>
            </div>
            <div className="space-y-1">
              <Link href="/dashboard" className={linkClass('/dashboard', undefined, 'bg-emerald-600')}>
                <div className="flex items-center gap-2.5">
                  <span className="text-sm">🏠</span>
                  <span>Panel Principal</span>
                </div>
              </Link>
              <Link href="/dashboard/sales" className={linkClass('/dashboard/sales', undefined, 'bg-emerald-600')}>
                <div className="flex items-center gap-2.5">
                  <span className="text-sm">📊</span>
                  <span>Panel de Ventas</span>
                </div>
              </Link>
              <Link href="/dashboard/products" className={linkClass('/dashboard/products', undefined, 'bg-emerald-600')}>
                <div className="flex items-center gap-2.5">
                  <span className="text-sm">📦</span>
                  <span>Mis Productos</span>
                </div>
              </Link>
              <Link href="/dashboard/products/new" className={linkClass('/dashboard/products/new', undefined, 'bg-emerald-600')}>
                <div className="flex items-center gap-2.5">
                  <span className="text-sm">➕</span>
                  <span>Nuevo Producto</span>
                </div>
              </Link>
              <Link href="/dashboard/questions" className={linkClass('/dashboard/questions', undefined, 'bg-emerald-600')}>
                <div className="flex items-center gap-2.5">
                  <span className="text-sm">✉️</span>
                  <span>Preguntas Recibidas</span>
                </div>
                <div className="flex gap-1">
                  {unreadCount > 0 && (
                    <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full" title="Sin leer">
                      {unreadCount}
                    </span>
                  )}
                  {pendingCount > 0 && (
                    <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full" title="Pendientes">
                      {pendingCount}
                    </span>
                  )}
                </div>
              </Link>
              <Link href="/dashboard/orders?view=sales" className={linkClass('/dashboard/orders', 'sales', 'bg-emerald-600')}>
                <div className="flex items-center gap-2.5">
                  <span className="text-sm">📋</span>
                  <span>Historial de Pedidos</span>
                </div>
              </Link>
            </div>
          </div>
        )}

        {/* Botón publicar para comprador */}
        {role === 'buyer' && (
          <div className="px-1">
            <Link href="/dashboard/products/new" className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs bg-emerald-50 text-emerald-800 font-bold border border-emerald-200 hover:bg-emerald-600 hover:text-white transition">
              <div className="flex items-center gap-2">
                <span>🚀</span>
                <span>Publicar Primer Producto</span>
              </div>
              <span>+</span>
            </Link>
          </div>
        )}

        {/* 3. SECCIÓN MI CUENTA (Bloque Azul) */}
        <div className={THEME_CONFIG.sectionCards.account}>
          <div className="flex items-center justify-between px-2 mb-2">
            <span className={THEME_CONFIG.badges.account}>
              👤 Mi Cuenta
            </span>
          </div>
          <div className="space-y-1">
            <Link href="/marketplace/cart" className={linkClass('/marketplace/cart')}>
              <div className="flex items-center gap-2.5">
                <span className="text-sm">🛒</span>
                <span>Carrito de Compras</span>
              </div>
            </Link>
            <Link href="/dashboard/orders?view=purchases" className={linkClass('/dashboard/orders', 'purchases')}>
              <div className="flex items-center gap-2.5">
                <span className="text-sm">📋</span>
                <span>Mis Compras</span>
              </div>
            </Link>
            <Link href="/marketplace/favorites" className={linkClass('/marketplace/favorites')}>
              <div className="flex items-center gap-2.5">
                <span className="text-sm">❤️</span>
                <span>Mis Favoritos</span>
              </div>
            </Link>
            <Link href="/dashboard/profile" className={linkClass('/dashboard/profile')}>
              <div className="flex items-center gap-2.5">
                <span className="text-sm">⚙️</span>
                <span>Mi Perfil y Ajustes</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Conmutador Modo Nocturno & Cerrar Sesión */}
        <div className="pt-2 px-1 space-y-2 border-t border-slate-200/80 dark:border-slate-800 mt-2">
          <button
            onClick={toggleTheme}
            className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-bold transition flex items-center justify-between shadow-2xs"
            title="Cambiar entre Modo Claro y Modo Nocturno"
          >
            <span className="flex items-center gap-2">
              <span>{theme === 'dark' ? '🌙' : '☀️'}</span>
              <span>{theme === 'dark' ? 'Modo Nocturno' : 'Modo Claro'}</span>
            </span>
            <span className="text-[10px] bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-extrabold px-2 py-0.5 rounded-full">
              {theme === 'dark' ? 'ON' : 'OFF'}
            </span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-600 text-rose-700 dark:text-rose-300 hover:text-white border border-rose-200 dark:border-rose-900 rounded-xl px-3.5 py-2.5 text-xs font-bold transition flex items-center justify-center gap-2 shadow-2xs"
          >
            <span>🚪</span>
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </nav>
    </aside>
  );
}

export default function Sidebar() {
  return (
    <Suspense fallback={<div className="w-64 bg-white border-r border-gray-200 min-h-screen" />}>
      <SidebarContent />
    </Suspense>
  );
}