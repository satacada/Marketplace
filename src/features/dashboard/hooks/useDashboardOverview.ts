/**
 * ============================================================================
 * FILE: useDashboardOverview.ts
 * ============================================================================
 * 
 * @description Custom Hook para el resumen del panel principal (dashboard) (SOLID / SRP).
 * 
 * @module Features/Dashboard/Hooks/useDashboardOverview
 * ============================================================================
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { supabase } from '@/lib/supabase';

export function useDashboardOverview() {
  const router = useRouter();
  const { user, profile, isLoading, logout } = useAuth();
  const [pendingUnmutedCount, setPendingUnmutedCount] = useState<number>(0);
  const [totalProductsCount, setTotalProductsCount] = useState<number>(0);

  useEffect(() => {
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
            .select('id, answer')
            .in('product_id', pIds);

          if (questions) {
            const unanswered = questions.filter(q => !q.answer);
            setPendingUnmutedCount(unanswered.length);
          }
        }
      }
    } catch (e) {
      console.error('Error al cargar resumen del vendedor:', e);
    }
  };

  return {
    user,
    profile,
    isLoading,
    logout,
    pendingUnmutedCount,
    totalProductsCount,
    router,
  };
}
