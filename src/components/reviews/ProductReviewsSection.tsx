/**
 * ============================================================================
 * FILE: ProductReviewsSection.tsx
 * ============================================================================
 * 
 * @description Componente de sección de reseñas verificadas con insignias de puntos de regalo.
 * 
 * @module Presentation/Components/Reviews/ProductReviewsSection
 * ============================================================================
 */

'use client';

import React from 'react';
import AppIcon from '@/components/ui/icons/AppIcon';
import { useProductReviews } from '@/features/reviews/hooks/useProductReviews';

interface ProductReviewsSectionProps {
  productId: string;
}

export default function ProductReviewsSection({ productId }: ProductReviewsSectionProps) {
  const { reviews, newComment, setNewComment, newRating, setNewRating, addReview } = useProductReviews(productId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addReview(newComment, newRating);
  };

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-gray-200/90 dark:border-slate-800 space-y-6 text-gray-900 dark:text-slate-100">
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-black flex items-center gap-1.5">
            <AppIcon name="star" className="w-5 h-5 text-amber-400" />
            <span>Reseñas Verificadas de Compradores</span>
          </h3>
          <p className="text-xs text-gray-500 font-medium">Gana 50 puntos acumulables al subir tu foto o video del producto</p>
        </div>
        <span className="px-3 py-1 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900 rounded-full text-xs font-black text-amber-700 dark:text-amber-300">
          +50 Puntos por Reseña
        </span>
      </div>

      {/* Formulario de Nueva Reseña */}
      <form onSubmit={handleSubmit} className="space-y-3 bg-gray-50/70 dark:bg-slate-800/40 p-4 rounded-2xl border border-gray-100 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold text-gray-700 dark:text-slate-300">Tu Calificación:</span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setNewRating(star)}
                className="text-amber-400 cursor-pointer"
              >
                <AppIcon name={star <= newRating ? "heart-filled" : "heart"} className="w-4 h-4 text-amber-400" />
              </button>
            ))}
          </div>
        </div>

        <textarea
          rows={2}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Escribe tu opinión sobre el producto y atención del vendedor..."
          className="w-full p-3 text-xs border border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 font-medium outline-hidden"
        />

        <div className="flex justify-between items-center">
          <span className="text-[11px] text-emerald-600 font-extrabold flex items-center gap-1">
            <AppIcon name="check-circle" className="w-3.5 h-3.5" />
            <span>Compra Verificada</span>
          </span>
          <button
            type="submit"
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black transition cursor-pointer"
          >
            Publicar Opinión (+50 Pts)
          </button>
        </div>
      </form>

      {/* Lista de Reseñas */}
      <div className="space-y-3">
        {reviews.map((rev) => (
          <div key={rev.id} className="p-4 rounded-2xl bg-gray-50/40 dark:bg-slate-800/30 border border-gray-100 dark:border-slate-800/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black">{rev.authorName}</span>
              <span className="text-[11px] font-bold text-gray-400">{rev.date}</span>
            </div>
            <p className="text-xs text-gray-700 dark:text-slate-300 font-medium">{rev.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
