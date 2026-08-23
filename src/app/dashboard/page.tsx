/**
 * ============================================================================
 * FILE: page.tsx
 * ============================================================================
 * 
 * @description Página principal del dashboard.
 *              Utiliza el hook useAuth para gestionar autenticación y perfil.
 * 
 * @module Presentation/Pages/Dashboard
 * 
 * @author System
 * @created 2026-07-16
 * 
 * @dependencies
 * - react
 * - @/features/auth/hooks/useAuth
 * - @/components/ui/Button
 * 
 * @related-files
 * - @/features/auth/hooks/useAuth.ts
 * - @/components/layout/Sidebar.tsx
 * 
 * @exports
 * - DashboardPage (default)
 * 
 * ============================================================================
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Button } from '@/components/ui/Button';

export default function DashboardPage() {
  const router = useRouter();
  const { user, profile, isLoading, logout } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth');
    }
  }, [user, isLoading, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/auth');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Cargando...</p>
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Marketplace Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{profile.email}</span>
              <span className="text-sm px-2 py-1 bg-indigo-100 text-indigo-800 rounded">
                {profile.role === 'seller' ? 'Vendedor' : 'Comprador'}
              </span>
              <Button
                onClick={handleLogout}
                variant="danger"
                size="sm"
              >
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                ¡Bienvenido al Dashboard!
              </h2>
              <p className="text-gray-600">
                Rol: {profile.role === 'seller' ? 'Vendedor' : 'Comprador'}
              </p>
              <p className="text-sm text-gray-500 mt-4">
                Aquí es donde irá el contenido multi-tenant
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}