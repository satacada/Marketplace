/**
 * ============================================================================
 * FILE: ProductReviewsTab.tsx
 * ============================================================================
 * 
 * @description Componente modular para la Pestaña de Valoraciones del Producto
 *              estilo AliExpress con filtro por estrellas, compra verificada,
 *              país, fotos y botón "Te ha ayudado" (Imagen 1).
 * 
 * @module Presentation/Components/Marketplace/Detail/ProductReviewsTab
 * ============================================================================
 */

import React, { useState } from 'react';

type Review = {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  date: string;
  variantInfo: string;
  comment: string;
  helpfulCount: number;
  hasPhoto?: boolean;
  country?: string;
};

const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    userName: 'Martín G. (Comprador Verificado)',
    rating: 5,
    date: '26 ENE 2026',
    variantInfo: 'Color: Beige Talla Infantil de EE. UU.: 8',
    comment: 'Excelente calidad del producto, la tela es súper suave y el acabado impecable. Llegó antes de lo esperado a Buenos Aires.',
    helpfulCount: 3,
    hasPhoto: true,
    country: '🇦🇷'
  },
  {
    id: 'rev-2',
    userName: 'B***o',
    rating: 4,
    date: '03 ABR 2026',
    variantInfo: 'Color: Beige Talla Infantil de EE. UU.: 13',
    comment: 'Un poco delgada la costura posterior, por lo demás está muy bien para el precio.',
    helpfulCount: 1,
    hasPhoto: false,
    country: '🇦🇷'
  },
  {
    id: 'rev-3',
    userName: 'Sofia R.',
    rating: 5,
    date: '15 MAY 2026',
    variantInfo: 'Color: Beige Talla Infantil de EE. UU.: 14',
    comment: 'Hermoso talle y calce. Muy recomendado para regalo!',
    helpfulCount: 0,
    hasPhoto: true,
    country: '🇦🇷'
  },
  {
    id: 'rev-4',
    userName: 'Gonzalo P.',
    rating: 5,
    date: '10 JUN 2026',
    variantInfo: 'Color: Azul Talla Estándar',
    comment: 'Producto 100% igual a la foto de la publicación. Vendedor responsable.',
    helpfulCount: 2,
    hasPhoto: false,
    country: '🇦🇷'
  }
];

export default function ProductReviewsTab() {
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [starFilter, setStarFilter] = useState<number | 'all'>('all');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleHelpful = (id: string) => {
    setReviews(prev =>
      prev.map(r => r.id === id ? { ...r, helpfulCount: r.helpfulCount + 1 } : r)
    );
  };

  const filteredReviews = reviews.filter(r => starFilter === 'all' || r.rating === starFilter);

  return (
    <div className="space-y-6 text-gray-900 dark:text-slate-100 animate-fadeIn">
      {/* Resumen de Calificación General Estilo AliExpress (Imagen 1) */}
      <div className="flex flex-wrap items-center gap-3 bg-amber-50/60 dark:bg-amber-950/30 p-4 rounded-2xl border border-amber-200/60 dark:border-amber-900/40">
        <h3 className="text-xl font-black text-gray-900 dark:text-slate-100">Reseña | 4.8</h3>
        <div className="text-amber-400 text-lg tracking-tight">⭐⭐⭐⭐⭐</div>
        <span className="text-xs font-bold text-gray-600 dark:text-slate-400">
          {reviews.length} calificaciones
        </span>
        <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-900 flex items-center gap-1">
          ✓ Todo desde compras verificadas
        </span>
      </div>

      {/* Barra de Filtros y Desplegable Estilo AliExpress (Imagen 1) */}
      <div className="flex flex-wrap items-center gap-2 border-b border-gray-100 dark:border-slate-800 pb-3">
        {/* Desplegable de Filtro de Estrellas */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="px-3.5 py-1.5 bg-gray-100 dark:bg-slate-800 rounded-xl text-xs font-black text-gray-800 dark:text-slate-200 hover:bg-gray-200 transition flex items-center gap-1.5 cursor-pointer"
          >
            <span>{starFilter === 'all' ? 'Todas las valoraciones' : `${starFilter} estrellas`}</span>
            <span>▾</span>
          </button>

          {dropdownOpen && (
            <div className="absolute top-full left-0 mt-1.5 w-44 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-800 py-1.5 z-30 space-y-0.5">
              <button
                type="button"
                onClick={() => { setStarFilter('all'); setDropdownOpen(false); }}
                className={`w-full text-left px-3 py-1.5 text-xs font-bold transition ${starFilter === 'all' ? 'bg-blue-50 dark:bg-blue-950 text-blue-600' : 'hover:bg-gray-100 dark:hover:bg-slate-800'}`}
              >
                All ratings
              </button>
              {[5, 4, 3, 2, 1].map(num => (
                <button
                  key={num}
                  type="button"
                  onClick={() => { setStarFilter(num); setDropdownOpen(false); }}
                  className={`w-full text-left px-3 py-1.5 text-xs font-bold transition ${starFilter === num ? 'bg-blue-50 dark:bg-blue-950 text-blue-600' : 'hover:bg-gray-100 dark:hover:bg-slate-800'}`}
                >
                  {num} estrella
                </button>
              ))}
            </div>
          )}
        </div>

        <span className="px-3 py-1.5 bg-gray-50 dark:bg-slate-800/60 rounded-xl text-xs font-bold text-gray-500">
          📷 Con fotos ({reviews.filter(r => r.hasPhoto).length})
        </span>
        <span className="px-3 py-1.5 bg-gray-50 dark:bg-slate-800/60 rounded-xl text-xs font-bold text-gray-500">
          🇦🇷 Argentina ({reviews.length})
        </span>
      </div>

      {/* Lista de Tarjetas de Valoraciones */}
      <div className="space-y-4">
        {filteredReviews.map(rev => (
          <div key={rev.id} className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 space-y-2 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-black text-xs flex items-center justify-center">
                  👤
                </div>
                <div>
                  <p className="text-xs font-black text-gray-900 dark:text-slate-100">{rev.userName}</p>
                  <div className="text-amber-400 text-xs">{'⭐'.repeat(rev.rating)}</div>
                </div>
              </div>
              <span className="text-[11px] text-gray-400 font-medium">{rev.date}</span>
            </div>

            <p className="text-[11px] font-bold text-gray-400">{rev.variantInfo}</p>
            <p className="text-xs text-gray-700 dark:text-slate-300 font-medium leading-relaxed">{rev.comment}</p>

            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => toggleHelpful(rev.id)}
                className="text-[11px] font-extrabold text-gray-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 cursor-pointer bg-gray-50 dark:bg-slate-800 px-2.5 py-1 rounded-xl border border-gray-200 dark:border-slate-700 transition"
              >
                <span>👍</span>
                <span>Te ha ayudado ({rev.helpfulCount})</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
