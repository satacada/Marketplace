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
  const [totalProductsCount, setTotalProductsCount] = useState<number>(0);

  useEffect(() => {
    // Título dinámico de la pestaña del navegador
    document.title = 'Panel Principal | Marketplace SaaS';
  }, []);

  useEffect(() => {
    if (user && profile?.role === 'seller') {
      loadSellerOverview();
    }
  }, [user, profile]);

  const loadSellerOverview = async () => {
    if (!user) return;
    try {
      // 1. Cargar productos
      const { data: products } = await supabase
        .from('products')
        .select('id')
        .eq('seller_id', user.id)
        .eq('is_deleted', false);

      if (products) {
        setTotalProductsCount(products.length);

        if (products.length > 0) {
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
      }
    } catch (e) {
      console.error('Error al cargar resumen del vendedor:', e);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/auth');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xs text-gray-400">
        Cargando Panel Principal...
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* CABECERA EJECUTIVA DEL PANEL PRINCIPAL */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-200/90 dark:border-slate-800 shadow-2xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-colors">
        <div>
          <div className="flex items-center gap-3">
            <span className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-2xl shadow-xs">
              🏠
            </span>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-gray-900 dark:text-slate-100">
                Panel Principal de Control
              </h1>
              <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-slate-400 mt-0.5">
                Centro de mando integral para la gestión de tu tienda y operaciones comerciales.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-gray-500 dark:text-slate-400">{profile.email}</span>
          <span className={`text-xs font-black px-3 py-1 rounded-full border ${
            profile.role === 'seller' 
              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900' 
              : 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-900'
          }`}>
            {profile.role === 'seller' ? '✓ Vendedor Verificado' : '👤 Comprador'}
          </span>
        </div>
      </div>

      {/* BANNER ALERTA PREGUNTAS PENDIENTES */}
      {profile.role === 'seller' && pendingUnmutedCount > 0 && (
        <div className="bg-amber-50 dark:bg-amber-950/50 border-2 border-amber-300 dark:border-amber-800 rounded-3xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🔔</span>
            <div>
              <h3 className="text-sm font-extrabold text-amber-950 dark:text-amber-200">
                Atención Vendedor: Tienes {pendingUnmutedCount} pregunta(s) de compradores pendientes de respuesta
              </h3>
              <p className="text-xs text-amber-800 dark:text-amber-300 font-medium mt-0.5">
                Responder a tiempo mejora tu tasa de conversión y eleva tu reputación en el Marketplace.
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

      {/* RESUMEN DE INDICADORES RÁPIDOS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-gray-200/90 dark:border-slate-800 shadow-2xs space-y-1">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Productos Activos</span>
          <p className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-slate-100">{totalProductsCount} items</p>
          <Link href="/dashboard/products" className="text-[11px] font-extrabold text-blue-600 hover:underline inline-block mt-1">
            📦 Ver catálogo →
          </Link>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-gray-200/90 dark:border-slate-800 shadow-2xs space-y-1">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Preguntas Pendientes</span>
          <p className="text-2xl sm:text-3xl font-black text-amber-600">{pendingUnmutedCount}</p>
          <Link href="/dashboard/questions" className="text-[11px] font-extrabold text-blue-600 hover:underline inline-block mt-1">
            ✉️ Ir a Preguntas →
          </Link>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-gray-200/90 dark:border-slate-800 shadow-2xs space-y-1">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Analítica & Ventas</span>
          <p className="text-2xl sm:text-3xl font-black text-emerald-600">📊 BI</p>
          <Link href="/dashboard/sales" className="text-[11px] font-extrabold text-blue-600 hover:underline inline-block mt-1">
            📈 Ver Analítica →
          </Link>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-gray-200/90 dark:border-slate-800 shadow-2xs space-y-1">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Reputación Tienda</span>
          <p className="text-2xl sm:text-3xl font-black text-amber-500">4.8 ★</p>
          <p className="text-[11px] font-bold text-emerald-600">🟢 96% Positiva</p>
        </div>
      </div>

      {/* ACCESOS DIRECTOS RÁPIDOS (ACCIONES DE CONTROL) */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-200/90 dark:border-slate-800 shadow-2xs space-y-4">
        <h2 className="text-base font-extrabold text-gray-900 dark:text-slate-100 flex items-center gap-2">
          <span>⚡ Accesos Directos de Control Rápido</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link
            href="/dashboard/products/new"
            className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-center hover:bg-blue-100 transition space-y-1"
          >
            <span className="text-2xl">➕</span>
            <p className="text-xs font-extrabold text-blue-900 dark:text-blue-200">Publicar Producto</p>
          </Link>

          <Link
            href="/dashboard/sales"
            className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-center hover:bg-emerald-100 transition space-y-1"
          >
            <span className="text-2xl">📊</span>
            <p className="text-xs font-extrabold text-emerald-900 dark:text-emerald-200">Panel de Ventas</p>
          </Link>

          <Link
            href="/dashboard/questions"
            className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900 text-center hover:bg-purple-100 transition space-y-1"
          >
            <span className="text-2xl">✉️</span>
            <p className="text-xs font-extrabold text-purple-900 dark:text-purple-200">Preguntas Recibidas</p>
          </Link>

          <Link
            href="/dashboard/orders"
            className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-center hover:bg-amber-100 transition space-y-1"
          >
            <span className="text-2xl">📦</span>
            <p className="text-xs font-extrabold text-amber-900 dark:text-amber-200">Historial Pedidos</p>
          </Link>
        </div>
      </div>
    </div>
  );
}