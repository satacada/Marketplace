/**
 * ============================================================================
 * FILE: useDashboardQuestions.ts
 * ============================================================================
 * 
 * @description Custom Hook para la gestión de preguntas recibidas por el vendedor
 *              y envío de respuestas en tiempo real (SOLID / SRP).
 * 
 * @module Features/Questions/Hooks/useDashboardQuestions
 * ============================================================================
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/features/auth/hooks/useAuth';

export type DashboardQuestion = {
  id: string;
  product_id: string;
  question: string;
  answer: string | null;
  created_at: string;
  products: {
    title: string;
    image_urls: string[] | null;
  } | null;
};

export function useDashboardQuestions() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  
  const [questions, setQuestions] = useState<DashboardQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState('');
  const [selectedQuestion, setSelectedQuestion] = useState<DashboardQuestion | null>(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
    } else if (user) {
      loadQuestions();
    }
  }, [user, authLoading]);

  const loadQuestions = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data: myProducts } = await supabase
        .from('products')
        .select('id')
        .eq('seller_id', user.id);

      if (!myProducts || myProducts.length === 0) {
        setQuestions([]);
        setLoading(false);
        return;
      }

      const productIds = myProducts.map(p => p.id);

      const { data, error } = await supabase
        .from('questions')
        .select('*, products(title, image_urls)')
        .in('product_id', productIds)
        .order('created_at', { ascending: false });

      if (!error && data) {
        const mapped = data.map((q: any) => ({
          ...q,
          products: Array.isArray(q.products) ? q.products[0] : q.products,
        }));
        setQuestions(mapped);
      }
    } catch (err) {
      console.error('Error cargando preguntas:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenReplyModal = (q: DashboardQuestion) => {
    setSelectedQuestion(q);
    setReplyText(q.answer || '');
    setShowReplyModal(true);
  };

  const handleSendReply = async () => {
    if (!selectedQuestion || !replyText.trim()) return;
    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('questions')
        .update({ answer: replyText })
        .eq('id', selectedQuestion.id);

      if (!error) {
        setShowReplyModal(false);
        setReplyText('');
        setSelectedQuestion(null);
        await loadQuestions();
      }
    } catch (err) {
      console.error('Error respondiendo pregunta:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return {
    questions,
    loading: loading || authLoading,
    replyText,
    setReplyText,
    selectedQuestion,
    showReplyModal,
    setShowReplyModal,
    submitting,
    handleOpenReplyModal,
    handleSendReply,
  };
}
