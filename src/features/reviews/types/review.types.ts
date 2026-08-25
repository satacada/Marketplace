/**
 * ============================================================================
 * FILE: review.types.ts
 * ============================================================================
 * @description Tipos para el módulo de valoraciones y reseñas de vendedores.
 * @module Features/Reviews/Types
 */

export type ReviewSentiment = 'positive' | 'neutral' | 'negative';

export interface SellerReview {
  id: string;
  seller_id: string;
  buyer_id: string;
  order_id?: string | null;
  rating: number; // 1 a 5 estrellas
  sentiment: ReviewSentiment;
  comment: string;
  created_at: string;
  profiles?: {
    store_name?: string | null;
    email?: string | null;
  } | null;
}

export interface CreateReviewInput {
  seller_id: string;
  rating: number;
  sentiment: ReviewSentiment;
  comment: string;
}

export interface SellerRatingSummary {
  averageRating: number;
  totalReviews: number;
  positivePercentage: number;
  positiveCount: number;
  neutralCount: number;
  negativeCount: number;
  ratingCounts: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}
