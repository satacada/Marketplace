/**
 * ============================================================================
 * FILE: Sidebar.tsx
 * ============================================================================
 * 
 * @description Componente de navegación lateral con menú contextual.
 *              Utiliza useAuth hook para gestión de autenticación y roles.
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
 * - @/components/layout/Header.tsx
 * - @/components/layout/LayoutWrapper.tsx
 * 
 * @exports
 * - Sidebar (default)
 * 
 * ============================================================================
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
    `block px-4 py-2 rounded transition flex items-center justify-between ${
      isActiveLink(path, param)
        ? 'bg-indigo-600 text-white'
        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
    }`;

  if (isLoading) return null;
  if (!user || !profile) return null;

  const role = profile.role || 'buyer';
  const isAdmin = profile.is_admin || false;
  const email = user.email || '';

  return (
    <aside className="w-64 bg-gray-800 text-white min-h-screen flex flex-col fixed left-0 top-0 bottom-0 overflow-y-auto z-40">
      {/* Cabecera */}
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-xl font-bold">Marketplace</h2>
        <p className="text-xs text-gray-400 mt-1 truncate">{email}</p>
        <span className={`inline-block mt-2 text-xs px-2 py-1 rounded ${
          role === 'seller' ? 'bg-green-600' : 'bg-blue-600'
        }`}>
          {role === 'seller' ? 'Vendedor' : 'Comprador'}
        </span>
      </div>

      {/* Menú de navegación */}
      <nav className="flex-1 p-4 space-y-2">
        {/* Opciones comunes para todos */}
        <Link href="/marketplace" className={linkClass('/marketplace')}>
          <span>🛒 Marketplace</span>
        </Link>

        {/* SECCIÓN ADMINISTRACIÓN: SOLO si is_admin es true */}
        {isAdmin && (
          <>
            <div className="pt-4 mt-4 border-t border-gray-700">
              <p className="text-xs text-purple-400 uppercase font-semibold mb-2 px-4">Administración</p>
            </div>
            <Link href="/dashboard/admin" className={linkClass('/dashboard/admin')}>
              <span>🛡️ Panel Admin</span>
            </Link>
            <Link href="/dashboard/admin/products" className={linkClass('/dashboard/admin/products')}>
              <span>📦 Gestión de Productos</span>
            </Link>
          </>
        )}

        {/* Botón para compradores que quieren vender */}
        {role === 'buyer' && (
          <>
            <div className="pt-4 mt-4 border-t border-gray-700">
              <p className="text-xs text-gray-500 uppercase mb-2 px-4">¿Quieres vender?</p>
            </div>
            <Link href="/dashboard/products/new" className={linkClass('/dashboard/products/new')}>
              <span>🚀 Publicar mi primer producto</span>
            </Link>
          </>
        )}

        {/* SECCIÓN VENDEDOR: SOLO si role es 'seller' */}
        {role === 'seller' && (
          <>
            <div className="pt-4 mt-4 border-t border-gray-700">
              <p className="text-xs text-gray-500 uppercase mb-2 px-4">Panel de Vendedor</p>
            </div>
            <Link href="/dashboard/products" className={linkClass('/dashboard/products')}>
              <span>📦 Mis Productos</span>
            </Link>
            <Link href="/dashboard/products/new" className={linkClass('/dashboard/products/new')}>
              <span>➕ Nuevo Producto</span>
            </Link>
            <Link href="/dashboard/questions" className={linkClass('/dashboard/questions')}>
              <span>✉️ Preguntas Recibidas</span>
              <div className="flex gap-1">
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full" title="Sin leer">
                    {unreadCount}
                  </span>
                )}
                {pendingCount > 0 && (
                  <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-0.5 rounded-full" title="Pendientes de responder">
                    {pendingCount}
                  </span>
                )}
              </div>
            </Link>
            <Link href="/dashboard/orders?view=sales" className={linkClass('/dashboard/orders', 'sales')}>
              <span>📋 Historial de Pedidos</span>
            </Link>
          </>
        )}

        {/* SECCIÓN CUENTA: PARA TODOS */}
        <div className="pt-4 mt-4 border-t border-gray-700">
          <p className="text-xs text-gray-500 uppercase mb-2 px-4">Cuenta</p>
        </div>
        <Link href="/marketplace/cart" className={linkClass('/marketplace/cart')}>
          <span>🛒 Carrito</span>
        </Link>
        <Link href="/dashboard/orders?view=purchases" className={linkClass('/dashboard/orders', 'purchases')}>
          <span>📋 Mis Compras</span>
        </Link>
        <Link href="/marketplace/favorites" className={linkClass('/marketplace/favorites')}>
          <span>❤️ Mis Favoritos</span>
        </Link>
        <Link href="/dashboard/profile" className={linkClass('/dashboard/profile')}>
          <span>👤 Mi Perfil</span>
        </Link>
        
        {/* Cerrar Sesión */}
        <button
          onClick={handleLogout}
          className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition text-sm"
        >
          🚪 Cerrar Sesión
        </button>
      </nav>
    </aside>
  );
}

export default function Sidebar() {
  return (
    <Suspense fallback={<div className="w-64 bg-gray-800 min-h-screen" />}>
      <SidebarContent />
    </Suspense>
  );
}