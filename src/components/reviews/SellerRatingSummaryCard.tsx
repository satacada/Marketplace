/**
 * ============================================================================
 * FILE: SellerRatingSummaryCard.tsx
 * ============================================================================
 * @description Tarjeta completa de reputación del vendedor con desglose de estrellas (1-5★),
 *              porcentaje de comentarios positivos y negativos, filtro por pestañas y feed de valoraciones.
 * @module Components/Reviews
 */

'use client';

import { useState, useMemo } from 'react';
import { SellerReview, SellerRatingSummary } from '@/features/reviews/types/review.types';
import AddReviewModal from './AddReviewModal';

type SellerRatingSummaryCardProps = {
  sellerStoreName: string;
  summary: SellerRatingSummary;
  reviews: SellerReview[];
  loading?: boolean;
  onAddReview: (data: { rating: number; sentiment: 'positive' | 'neutral' | 'negative'; comment: string }) => Promise<void>;
  isSubmitting?: boolean;
  canReview?: boolean;
};

export default function SellerRatingSummaryCard({
  sellerStoreName,
  summary,
  reviews,
  loading = false,
  onAddReview,
  isSubmitting = false,
  canReview = true
}: SellerRatingSummaryCardProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'positive' | 'negative'>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Filtrar reseñas según la pestaña seleccionada
  const filteredReviews = useMemo(() => {
    if (activeTab === 'positive') {
      return reviews.filter(r => r.sentiment === 'positive' || r.rating >= 4);
    }
    if (activeTab === 'negative') {
      return reviews.filter(r => r.sentiment === 'negative' || r.rating <= 2);
    }
    return reviews;
  }, [reviews, activeTab]);

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200/90 mb-8">
      {/* Header & Botón Calificar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
        <div>
          <h2 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
            <span>⭐ Reputación y Valoraciones de la Tienda</span>
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Comentarios reales de compradores verificados en Marketplace SaaS
          </p>
        </div>

        {canReview && (
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5 self-stretch sm:self-auto justify-center"
          >
            <span>✍️ Calificar Vendedor</span>
          </button>
        )}
      </div>

      {/* Resumen Estadístico: Estrellas + Positivos/Negativos + Barras de Desglose */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-b border-gray-100">
        {/* Col 1: Promedio de Estrellas */}
        <div className="flex flex-col items-center justify-center bg-gray-50/80 p-5 rounded-2xl border border-gray-200/80 text-center">
          <div className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight">
            {summary.averageRating}
          </div>
          
          <div className="flex items-center gap-1 text-amber-400 text-xl my-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star}>
                {summary.averageRating >= star ? '★' : summary.averageRating >= star - 0.5 ? '★' : '☆'}
              </span>
            ))}
          </div>

          <p className="text-xs font-semibold text-gray-500">
            Basado en {summary.totalReviews} opinión{summary.totalReviews !== 1 ? 'es' : ''}
          </p>
        </div>

        {/* Col 2: Porcentaje de Comentarios Positivos vs Negativos */}
        <div className="flex flex-col justify-center bg-emerald-50/60 p-5 rounded-2xl border border-emerald-200/70 text-center">
          <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600 tracking-tight">
            {summary.positivePercentage}%
          </div>
          <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider mt-1">
            Comentarios Positivos 🟢
          </p>
          <div className="flex items-center justify-center gap-4 text-xs font-semibold text-gray-600 mt-3 pt-3 border-t border-emerald-200/60">
            <span className="text-emerald-700">👍 {summary.positiveCount} Positivos</span>
            <span className="text-rose-600">👎 {summary.negativeCount} Críticos</span>
          </div>
        </div>

        {/* Col 3: Barras de Desglose de 5★ a 1★ */}
        <div className="flex flex-col justify-center space-y-2 bg-gray-50/80 p-5 rounded-2xl border border-gray-200/80">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = summary.ratingCounts[star as 1 | 2 | 3 | 4 | 5] || 0;
            const pct = summary.totalReviews > 0 ? (count / summary.totalReviews) * 100 : 0;
            return (
              <div key={star} className="flex items-center gap-2 text-xs font-medium">
                <span className="w-6 text-gray-700 font-bold text-right">{star}★</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-amber-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-8 text-gray-400 text-right">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pestañas de Filtro: Todos | Positivos | Negativos */}
      <div className="pt-6">
        <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-3 flex-wrap">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`py-2 px-4 rounded-xl text-xs font-bold transition ${
              activeTab === 'all'
                ? 'bg-gray-900 text-white shadow-xs'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Todos ({summary.totalReviews})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('positive')}
            className={`py-2 px-4 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'positive'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            <span>🟢 Comentarios Positivos</span>
            <span>({summary.positiveCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('negative')}
            className={`py-2 px-4 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'negative'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
            }`}
          >
            <span>🔴 Comentarios Críticos</span>
            <span>({summary.negativeCount})</span>
          </button>
        </div>

        {/* Feed de Comentarios */}
        {loading ? (
          <div className="py-8 text-center text-xs text-gray-400">Cargando comentarios...</div>
        ) : filteredReviews.length === 0 ? (
          <div className="py-8 text-center bg-gray-50 rounded-2xl border border-gray-100 text-xs text-gray-500 font-medium">
            No hay comentarios en esta categoría actualmente.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReviews.map((rev) => {
              const isPositive = rev.sentiment === 'positive' || rev.rating >= 4;
              return (
                <div
                  key={rev.id}
                  className="bg-gray-50/70 p-4 rounded-2xl border border-gray-200/70 transition hover:bg-gray-50"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                        👤
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-900">
                          {rev.profiles?.store_name || rev.profiles?.email || 'Comprador Verificado'}
                        </p>
                        <p className="text-[10px] text-gray-400 font-medium">
                          {new Date(rev.created_at).toLocaleDateString('es-AR', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex text-amber-400 text-sm">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <span key={s}>{rev.rating >= s ? '★' : '☆'}</span>
                        ))}
                      </div>

                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                          isPositive
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}
                      >
                        {isPositive ? '🟢 Positivo' : '🔴 Crítico'}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-700 leading-relaxed font-medium pl-10">
                    "{rev.comment}"
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal para añadir nueva valoración */}
      <AddReviewModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        sellerStoreName={sellerStoreName}
        onSubmit={onAddReview}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
