/**
 * ============================================================================
 * FILE: AddReviewModal.tsx
 * ============================================================================
 * @description Modal interactivo para calificar a un vendedor con estrellas,
 *              clasificación positiva/negativa y comentarios detallados.
 * @module Components/Reviews
 */

'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { ReviewSentiment } from '@/features/reviews/types/review.types';

type AddReviewModalProps = {
  isOpen: boolean;
  onClose: () => void;
  sellerStoreName: string;
  onSubmit: (data: { rating: number; sentiment: ReviewSentiment; comment: string }) => Promise<void>;
  isSubmitting?: boolean;
};

export default function AddReviewModal({
  isOpen,
  onClose,
  sellerStoreName,
  onSubmit,
  isSubmitting = false
}: AddReviewModalProps) {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [sentiment, setSentiment] = useState<ReviewSentiment>('positive');
  const [comment, setComment] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleStarClick = (star: number) => {
    setRating(star);
    if (star >= 4) setSentiment('positive');
    else if (star === 3) setSentiment('neutral');
    else setSentiment('negative');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!comment.trim() || comment.trim().length < 5) {
      setError('Por favor escribe un comentario de al menos 5 caracteres sobre el vendedor.');
      return;
    }

    try {
      await onSubmit({ rating, sentiment, comment: comment.trim() });
      setComment('');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al enviar la valoración.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <form onSubmit={handleSubmit} className="p-6">
        {/* Header de la Modal */}
        <div className="text-center pb-4 border-b border-gray-100 mb-5">
          <div className="text-4xl mb-2">⭐</div>
          <h3 className="text-lg font-bold text-gray-900">Calificar a {sellerStoreName}</h3>
          <p className="text-xs text-gray-500 mt-1">Comparte tu experiencia de compra con la comunidad</p>
        </div>

        {/* 1. Selección de Estrellas (1-5★) */}
        <div className="mb-6 text-center">
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
            Puntuación general
          </label>
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => {
              const active = (hoverRating || rating) >= star;
              return (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleStarClick(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="text-3xl transition-transform hover:scale-125 focus:outline-none"
                  title={`${star} estrella${star > 1 ? 's' : ''}`}
                >
                  <span className={active ? 'text-amber-400' : 'text-gray-200'}>★</span>
                </button>
              );
            })}
          </div>
          <p className="text-xs font-bold text-amber-600 mt-2">
            {rating === 5 && '¡Excelente! 🌟🌟🌟🌟🌟'}
            {rating === 4 && 'Muy Bueno 👍'}
            {rating === 3 && 'Aceptable 😐'}
            {rating === 2 && 'Regular 👎'}
            {rating === 1 && 'Deficiente 😡'}
          </p>
        </div>

        {/* 2. Tipo de Comentario / Sentimiento (Positivo / Neutral / Negativo) */}
        <div className="mb-6">
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2.5">
            Tipo de Comentario
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={() => setSentiment('positive')}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border ${
                sentiment === 'positive'
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-700 ring-2 ring-emerald-200'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span>🟢</span>
              <span>Positivo</span>
            </button>

            <button
              type="button"
              onClick={() => setSentiment('neutral')}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border ${
                sentiment === 'neutral'
                  ? 'bg-blue-50 border-blue-500 text-blue-700 ring-2 ring-blue-200'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span>⚪</span>
              <span>Neutral</span>
            </button>

            <button
              type="button"
              onClick={() => setSentiment('negative')}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border ${
                sentiment === 'negative'
                  ? 'bg-rose-50 border-rose-500 text-rose-700 ring-2 ring-rose-200'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span>🔴</span>
              <span>Negativo</span>
            </button>
          </div>
        </div>

        {/* 3. Área de Comentario Detallado */}
        <div className="mb-6">
          <label htmlFor="comment" className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
            Detalle de tu experiencia
          </label>
          <textarea
            id="comment"
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Describe la rapidez de entrega, comunicación del vendedor y estado del producto..."
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium placeholder-gray-400"
            required
          />
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium">
            ⚠️ {error}
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            fullWidth
            disabled={isSubmitting}
          >
            Cancelar
          </Button>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isSubmitting}
          >
            Publicar Valoración
          </Button>
        </div>
      </form>
    </Modal>
  );
}
