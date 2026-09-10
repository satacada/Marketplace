/**
 * ============================================================================
 * FILE: useProductReviews.ts
 * ============================================================================
 * 
 * @description Custom Hook para la gestión de reseñas multimedia verificadas,
 *              publicación con fotos y acumulación de puntos de recompensa.
 * 
 * @module Features/Reviews/Hooks
 * ============================================================================
 */

import { useState } from 'react';

export interface ProductReviewItem {
  id: string;
  authorName: string;
  rating: number;
  date: string;
  comment: string;
  isVerifiedPurchase: boolean;
  imageUrls: string[];
  pointsEarned: number;
}

export function useProductReviews(productId: string) {
  const [reviews, setReviews] = useState<ProductReviewItem[]>([
    {
      id: 'rev-1',
      authorName: 'Camila R.',
      rating: 5,
      date: 'Hace 2 días',
      comment: '¡Excelente producto! Llego super rápido con despacho exprés y la calidad supera lo esperado.',
      isVerifiedPurchase: true,
      imageUrls: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80'],
      pointsEarned: 50,
    },
  ]);

  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);

  const addReview = (commentText: string, ratingValue: number) => {
    if (!commentText.trim()) return;
    const newRev: ProductReviewItem = {
      id: `rev-${Date.now()}`,
      authorName: 'Tú (Comprador Verificado)',
      rating: ratingValue,
      date: 'Ahora mismo',
      comment: commentText,
      isVerifiedPurchase: true,
      imageUrls: [],
      pointsEarned: 50,
    };
    setReviews([newRev, ...reviews]);
    setNewComment('');
  };

  return {
    reviews,
    newComment,
    setNewComment,
    newRating,
    setNewRating,
    addReview,
  };
}
