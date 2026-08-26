/**
 * ============================================================================
 * FILE: useAskPage.ts
 * ============================================================================
 * 
 * @description Custom Hook para la vista general de preguntas del comprador (SOLID / SRP).
 * 
 * @module Features/Questions/Hooks/useAskPage
 * ============================================================================
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/features/auth/hooks/useAuth';

export function useAskPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
    } else if (user) {
      loadMyQuestions();
    }
  }, [user, authLoading]);

  const loadMyQuestions = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*, products(id, title, image_urls, price)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setQuestions(data);
      }
    } catch (err) {
      console.error('Error cargando preguntas enviadas:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    questions,
    loading: loading || authLoading,
    router,
  };
}
