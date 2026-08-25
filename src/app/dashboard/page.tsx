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

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';

export default function DashboardPage() {
  const router = useRouter();
  const { user, profile, isLoading, logout } = useAuth();
  const [pendingUnmutedCount, setPendingUnmutedCount] = useState<number>(0);

  useEffect(() => {
    if (user && profile?.role === 'seller') {
      checkPendingQuestions();
    }
  }, [user, profile]);

  const checkPendingQuestions = async () => {
    if (!user) return;
    try {
      const { data: products } = await supabase
        .from('products')
        .select('id')
        .eq('seller_id', user.id)
        .eq('is_deleted', false);

      if (products && products.length > 0) {
        const pIds = products.map(p => p.id);
        const { data: questions } = await supabase
          .from('questions')
          .select('id')
          .in('product_id', pIds)
          .eq('is_answered', false);

        if (questions) {
          const savedMuted = localStorage.getItem('seller_muted_questions');
          const mutedList: string[] = savedMuted ? JSON.parse(savedMuted) : [];
          const activePending = questions.filter(q => !mutedList.includes(q.id));
          setPendingUnmutedCount(activePending.length);
        }
      }
    } catch (e) {
      console.error('Error al verificar preguntas pendientes:', e);
    }
  };

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
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
      <nav className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-2">
              <span className="text-xl">🛍️</span>
              <h1 className="text-lg font-extrabold text-gray-900 dark:text-slate-100">
                Marketplace Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-xs font-medium text-gray-600 dark:text-slate-400">{profile.email}</span>
              <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full border ${
                profile.role === 'seller' ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900' : 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-900'
              }`}>
                {profile.role === 'seller' ? '✓ Vendedor' : '👤 Comprador'}
              </span>
              <Button
                onClick={handleLogout}
                variant="secondary"
                size="sm"
              >
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-4 sm:px-0 space-y-6">

          {/* BANNER NOTIFICACIÓN DE PREGUNTAS PENDIENTES */}
          {profile.role === 'seller' && pendingUnmutedCount > 0 && (
            <div className="bg-amber-50 dark:bg-amber-950/50 border-2 border-amber-300 dark:border-amber-800 rounded-3xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🔔</span>
                <div>
                  <h3 className="text-sm font-extrabold text-amber-950 dark:text-amber-200">
                    Atención Vendedor: Tienes {pendingUnmutedCount} pregunta(s) de compradores pendientes de respuesta
                  </h3>
                  <p className="text-xs text-amber-800 dark:text-amber-300 font-medium mt-0.5">
                    Responder oportunamente incrementa tu tasa de conversión y eleva tu puntuación de reputación.
                  </p>
                </div>
              </div>
              <Link
                href="/dashboard/questions"
                className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-extrabold rounded-2xl text-xs transition shadow-2xs flex-shrink-0"
              >
                ✉️ Ver Preguntas Recibidas
              </Link>
            </div>
          )}

          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-8 text-center space-y-4 shadow-2xs">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-slate-100">
              ¡Bienvenido al Panel del Marketplace!
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 font-medium">
              Gestiona tu catálogo, ventas y consultas de clientes de manera centralizada.
            </p>

            <div className="flex justify-center gap-3 pt-2">
              {profile.role === 'seller' && (
                <>
                  <Link href="/dashboard/sales" className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl text-xs shadow-2xs">
                    📊 Ver Panel de Ventas
                  </Link>
                  <Link href="/dashboard/products" className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold rounded-2xl text-xs border border-slate-300 dark:border-slate-700">
                    📦 Gestionar Productos
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}