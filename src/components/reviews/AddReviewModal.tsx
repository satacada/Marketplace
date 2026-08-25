/**
 * ============================================================================
 * FILE: AddReviewModal.tsx
 * ============================================================================
 * @description Modal interactivo para calificar a un vendedor evaluando los
 *              4 criterios clave de e-Commerce (Amazon, AliExpress & BestBuy).
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
  onSubmit: (data: {
    rating: number;
    item_as_described_rating: number;
    shipping_speed_rating: number;
    communication_rating: number;
    packaging_rating: number;
    sentiment: ReviewSentiment;
    comment: string;
  }) => Promise<void>;
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

  // Criterios individuales e-Commerce (Amazon / AliExpress)
  const [itemAsDescribed, setItemAsDescribed] = useState<number>(5);
  const [shippingSpeed, setShippingSpeed] = useState<number>(5);
  const [communication, setCommunication] = useState<number>(5);
  const [packaging, setPackaging] = useState<number>(5);

  const [sentiment, setSentiment] = useState<ReviewSentiment>('positive');
  const [comment, setComment] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleGeneralStarClick = (star: number) => {
    setRating(star);
    setItemAsDescribed(star);
    setShippingSpeed(star);
    setCommunication(star);
    setPackaging(star);
    if (star >= 4) setSentiment('positive');
    else if (star === 3) setSentiment('neutral');
    else setSentiment('negative');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!comment.trim() || comment.trim().length < 5) {
      setError('Por favor escribe un comentario de al menos 5 caracteres sobre la tienda.');
      return;
    }

    try {
      await onSubmit({
        rating,
        item_as_described_rating: itemAsDescribed,
        shipping_speed_rating: shippingSpeed,
        communication_rating: communication,
        packaging_rating: packaging,
        sentiment,
        comment: comment.trim()
      });
      setComment('');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al enviar la valoración.');
    }
  };

  const renderStarSelector = (label: string, icon: string, currentVal: number, setVal: (v: number) => void) => (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
        <span>{icon}</span>
        <span>{label}</span>
      </div>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setVal(star)}
            className="text-base focus:outline-none transition hover:scale-110"
          >
            <span className={star <= currentVal ? 'text-amber-400' : 'text-gray-200'}>★</span>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <form onSubmit={handleSubmit} className="p-6">
        {/* Header de la Modal */}
        <div className="text-center pb-4 border-b border-gray-100 mb-5">
          <div className="text-4xl mb-2">⭐</div>
          <h3 className="text-lg font-bold text-gray-900">Calificar a {sellerStoreName}</h3>
          <p className="text-xs text-gray-500 mt-1">Criterios de evaluación estándar Amazon & AliExpress</p>
        </div>

        {/* 1. Selección de Estrellas General */}
        <div className="mb-6 bg-amber-50/60 p-4 rounded-2xl border border-amber-200/80 text-center">
          <label className="block text-xs font-bold uppercase tracking-wider text-amber-900 mb-1">
            Puntuación General del Vendedor
          </label>
          <div className="flex items-center justify-center gap-2 my-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleGeneralStarClick(star)}
                className="text-3xl transition-transform hover:scale-125 focus:outline-none"
              >
                <span className={star <= rating ? 'text-amber-400' : 'text-gray-200'}>★</span>
              </button>
            ))}
          </div>
          <p className="text-xs font-bold text-amber-700">
            {rating === 5 && '¡Excelente Vendedor! 🌟🌟🌟🌟🌟'}
            {rating === 4 && 'Muy Bueno 👍'}
            {rating === 3 && 'Aceptable 😐'}
            {rating === 2 && 'Regular 👎'}
            {rating === 1 && 'Deficiente 😡'}
          </p>
        </div>

        {/* 2. Criterios de Evaluación Específicos (Amazon / AliExpress) */}
        <div className="mb-6 bg-gray-50 p-4 rounded-2xl border border-gray-200/80">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
            Criterios de Evaluación Específicos
          </h4>

          {renderStarSelector('Fidelidad a la Descripción', '📦', itemAsDescribed, setItemAsDescribed)}
          {renderStarSelector('Rapidez y Puntualidad de Envío', '⚡', shippingSpeed, setShippingSpeed)}
          {renderStarSelector('Atención y Comunicación', '💬', communication, setCommunication)}
          {renderStarSelector('Calidad del Empaque', '🛡️', packaging, setPackaging)}
        </div>

        {/* 3. Sentimiento (Positivo / Neutral / Negativo) */}
        <div className="mb-6">
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2.5">
            Calificación de Experiencia
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

        {/* 4. Comentario Detallado */}
        <div className="mb-6">
          <label htmlFor="comment" className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
            Opinión detallada
          </label>
          <textarea
            id="comment"
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Escribe tu opinión sobre el despacho, puntualidad y estado del producto..."
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
