/**
 * ============================================================================
 * FILE: useSellerReviews.ts
 * ============================================================================
 * @description Hook de React para gestionar las valoraciones y reseñas de un vendedor.
 * @module Features/Reviews/Hooks
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { reviewService } from '../services/review.service';
import { SellerReview, CreateReviewInput, SellerRatingSummary } from '../types/review.types';

export function useSellerReviews(sellerId: string | null) {
  const [reviews, setReviews] = useState<SellerReview[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const fetchReviews = useCallback(async () => {
    if (!sellerId) {
      setReviews([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await reviewService.getSellerReviews(sellerId);
      setReviews(data);
    } catch (err) {
      console.error('Error al cargar valoraciones:', err);
    } finally {
      setLoading(false);
    }
  }, [sellerId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const summary: SellerRatingSummary = useMemo(() => {
    return reviewService.calculateRatingSummary(reviews);
  }, [reviews]);

  const addReview = useCallback(async (input: CreateReviewInput, buyerId: string) => {
    setSubmitting(true);
    try {
      const newReview = await reviewService.createReview(input, buyerId);
      setReviews(prev => [newReview, ...prev]);
      return { success: true, review: newReview };
    } catch (err: any) {
      console.error('Error al crear reseña:', err);
      return { success: false, error: err.message || 'Error al guardar la valoración' };
    } finally {
      setSubmitting(false);
    }
  }, []);

  return {
    reviews,
    summary,
    loading,
    submitting,
    addReview,
    refresh: fetchReviews
  };
}
