/**
 * ============================================================================
 * FILE: Sidebar.tsx
 * ============================================================================
 * @description Componente de navegación lateral alineado al tema visual limpio (#2563eb)
 *              y estándares de UX/UI de Marketplace SaaS.
 * @module Presentation/Components/Layout
 */

'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/features/auth/hooks/useAuth';

function SidebarContent() {
  const { user, profile, logout, isLoading } = useAuth();
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

  const linkClass = (path: string, param?: string) =>
    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all duration-150 ${
      isActiveLink(path, param)
        ? 'bg-blue-600 text-white font-bold shadow-xs'
        : 'text-gray-600 hover:bg-blue-50/80 hover:text-blue-600 font-semibold'
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
      <div className="p-5 border-b border-gray-100 bg-slate-50/50">
        <Link href="/marketplace" className="flex items-center gap-2 group mb-3">
          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center text-base shadow-xs group-hover:bg-blue-700 transition">
            🛍️
          </div>
          <div>
            <h2 className="text-base font-black tracking-tight text-gray-900 group-hover:text-blue-600 transition">
              Marketplace
            </h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">SaaS Platform</p>
          </div>
        </Link>

        <div className="pt-2 border-t border-gray-200/60">
          <p className="text-xs font-bold text-gray-800 truncate">{storeName}</p>
          <p className="text-[11px] text-gray-400 font-medium truncate">{email}</p>

          <div className="mt-2 flex items-center gap-2">
            <span className={`inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border ${
              role === 'seller' 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                : 'bg-blue-50 text-blue-700 border-blue-200'
            }`}>
              <span>{role === 'seller' ? '✓ Vendedor' : '👤 Comprador'}</span>
            </span>

            {isAdmin && (
              <span className="inline-flex items-center text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                Admin
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Menú de navegación contextual */}
      <nav className="flex-1 p-3 space-y-1">
        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-3.5 mt-2 mb-1">
          Navegación
        </p>

        {/* Opciones comunes para todos */}
        <Link href="/marketplace" className={linkClass('/marketplace')}>
          <div className="flex items-center gap-2.5">
            <span className="text-sm">🛒</span>
            <span>Explorar Marketplace</span>
          </div>
        </Link>

        {/* SECCIÓN ADMINISTRACIÓN: SOLO si is_admin es true */}
        {isAdmin && (
          <>
            <p className="text-[10px] font-bold uppercase tracking-wider text-purple-600 px-3.5 mt-5 mb-1">
              Administración
            </p>
            <Link href="/dashboard/admin" className={linkClass('/dashboard/admin')}>
              <div className="flex items-center gap-2.5">
                <span className="text-sm">🛡️</span>
                <span>Panel Admin</span>
              </div>
            </Link>
            <Link href="/dashboard/admin/products" className={linkClass('/dashboard/admin/products')}>
              <div className="flex items-center gap-2.5">
                <span className="text-sm">📦</span>
                <span>Gestión de Productos</span>
              </div>
            </Link>
          </>
        )}

        {/* Botón para compradores que quieren vender */}
        {role === 'buyer' && (
          <>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-3.5 mt-5 mb-1">
              ¿Quieres vender?
            </p>
            <Link href="/dashboard/products/new" className={linkClass('/dashboard/products/new')}>
              <div className="flex items-center gap-2.5">
                <span className="text-sm">🚀</span>
                <span>Publicar Producto</span>
              </div>
            </Link>
          </>
        )}

        {/* SECCIÓN VENDEDOR: SOLO si role es 'seller' */}
        {role === 'seller' && (
          <>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-3.5 mt-5 mb-1">
              Panel de Vendedor
            </p>
            <Link href="/dashboard/products" className={linkClass('/dashboard/products')}>
              <div className="flex items-center gap-2.5">
                <span className="text-sm">📦</span>
                <span>Mis Productos</span>
              </div>
            </Link>
            <Link href="/dashboard/products/new" className={linkClass('/dashboard/products/new')}>
              <div className="flex items-center gap-2.5">
                <span className="text-sm">➕</span>
                <span>Nuevo Producto</span>
              </div>
            </Link>
            <Link href="/dashboard/questions" className={linkClass('/dashboard/questions')}>
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
                  <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full" title="Pendientes de responder">
                    {pendingCount}
                  </span>
                )}
              </div>
            </Link>
            <Link href="/dashboard/orders?view=sales" className={linkClass('/dashboard/orders', 'sales')}>
              <div className="flex items-center gap-2.5">
                <span className="text-sm">📋</span>
                <span>Historial de Pedidos</span>
              </div>
            </Link>
          </>
        )}

        {/* SECCIÓN CUENTA: PARA TODOS */}
        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-3.5 mt-5 mb-1">
          Mi Cuenta
        </p>
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
            <span className="text-sm">👤</span>
            <span>Mi Perfil</span>
          </div>
        </Link>
        
        {/* Botón Cerrar Sesión */}
        <div className="pt-4 mt-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white border border-rose-200/80 rounded-xl px-3.5 py-2.5 text-xs font-bold transition flex items-center justify-center gap-2 shadow-2xs"
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