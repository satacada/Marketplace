/**
 * ============================================================================
 * FILE: PersonalizedRecommendationsSection.tsx
 * ============================================================================
 * 
 * @description FASE 4: Componente de Interfaz de Usuario para mostrar la sección
 *              "✨ Recomendados Especialmente para Ti" en el Marketplace.
 * 
 * @module Presentation/Components/Marketplace/PersonalizedRecommendationsSection
 * ============================================================================
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getPersonalizedRecommendations, RecommendedProduct } from '@/lib/recommendationEngine';
import { useCart } from '@/features/cart/hooks/useCart';

type Props = {
  userId?: string | null;
  onAddToCart?: (productId: string, productInfo: any) => void;
};

export default function PersonalizedRecommendationsSection({ userId, onAddToCart }: Props) {
  const [recommendations, setRecommendations] = useState<RecommendedProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecommendations();
  }, [userId]);

  const loadRecommendations = async () => {
    setLoading(true);
    let sessionId: string | undefined;
    if (typeof window !== 'undefined') {
      sessionId = localStorage.getItem('mp_session_id') || undefined;
    }
    const data = await getPersonalizedRecommendations({ userId, sessionId, limit: 4 });
    setRecommendations(data);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="mb-10 p-6 rounded-3xl bg-gradient-to-r from-blue-50/80 via-indigo-50/80 to-purple-50/80 dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-900 border border-blue-200/80 dark:border-slate-800 shadow-2xs">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl animate-spin">✨</span>
          <div className="h-5 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) return null;

  return (
    <div className="mb-10 p-6 rounded-3xl bg-gradient-to-r from-blue-50/90 via-indigo-50/90 to-purple-50/90 dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-900 border border-blue-200/90 dark:border-slate-800 shadow-2xs text-gray-900 dark:text-slate-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl text-blue-600 dark:text-blue-400 font-black">✨</span>
            <h2 className="text-xl font-extrabold text-gray-900 dark:text-slate-100">
              Recomendados Especialmente para Ti
            </h2>
          </div>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 font-medium">
            Selección de productos destacados y ofertas para ti
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {recommendations.map((item) => (
          <div 
            key={item.id}
            className="bg-white dark:bg-slate-950 p-4 rounded-2xl border border-gray-200/90 dark:border-slate-800 shadow-2xs hover:shadow-md hover:border-blue-400 dark:hover:border-blue-600 transition duration-200 flex flex-col justify-between group"
          >
            <div>
              <div className="relative h-36 w-full bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden mb-3 border border-gray-100 dark:border-slate-800">
                {item.image_url ? (
                  <img 
                    src={item.image_url} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-2xl">🛍️</div>
                )}
              </div>

              <div className="mb-2">
                <span className="text-[10px] font-extrabold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/80 px-2 py-0.5 rounded-md border border-indigo-200 dark:border-indigo-800 inline-block mb-1 line-clamp-1">
                  {item.reasonBadge}
                </span>
                <h3 className="text-xs font-extrabold text-gray-900 dark:text-slate-100 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                  {item.title}
                </h3>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between mt-2">
              <div>
                <span className="text-sm font-black text-blue-600 dark:text-blue-400 tracking-tight">
                  ${item.price.toLocaleString('es-CL')}
                </span>
                <p className="text-[10px] text-gray-400 dark:text-slate-500 font-medium truncate max-w-[100px]">
                  {item.seller_name}
                </p>
              </div>

              <Link
                href={`/marketplace/product/${item.id}`}
                className="py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition shadow-2xs active:scale-95 flex items-center gap-1"
              >
                <span>Ver</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
