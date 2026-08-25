/**
 * ============================================================================
 * FILE: review.types.ts
 * ============================================================================
 * @description Tipos para el módulo de valoraciones y reseñas de vendedores.
 *              Incluye criterios multidimensionales e-Commerce (Amazon / AliExpress).
 * @module Features/Reviews/Types
 */

export type ReviewSentiment = 'positive' | 'neutral' | 'negative';

export interface SellerReview {
  id: string;
  seller_id: string;
  buyer_id: string;
  order_id?: string | null;
  rating: number; // Puntuación General 1-5★
  item_as_described_rating?: number; // 📦 Fidelidad a la Descripción (1-5★)
  shipping_speed_rating?: number;    // ⚡ Rapidez y Puntualidad de Envío (1-5★)
  communication_rating?: number;     // 💬 Atención y Comunicación (1-5★)
  packaging_rating?: number;         // 🛡️ Calidad del Empaque (1-5★)
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
  item_as_described_rating?: number;
  shipping_speed_rating?: number;
  communication_rating?: number;
  packaging_rating?: number;
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
  itemAsDescribedAvg: number;
  shippingSpeedAvg: number;
  communicationAvg: number;
  packagingAvg: number;
  ratingCounts: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}
