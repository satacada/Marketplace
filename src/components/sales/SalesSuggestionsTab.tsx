/**
 * ============================================================================
 * FILE: SalesSuggestionsTab.tsx
 * ============================================================================
 * 
 * @description Componente modular para la Pestaña "💡 Sugerencias de Optimización"
 *              con consejos de IA para potenciar ventas y aumentar conversión.
 * 
 * @module Presentation/Components/Sales/SalesSuggestionsTab
 * ============================================================================
 */

import React from 'react';

type ProductSuggestion = {
  id: string;
  title: string;
  suggestion: string;
  impact: 'Alta Conversión' | 'Optimización Fotos' | 'Precio Competitivo';
};

type Props = {
  topProducts: any[];
};

export default function SalesSuggestionsTab({ topProducts }: Props) {
  const suggestions: ProductSuggestion[] = topProducts.map((p, idx) => ({
    id: p.id,
    title: p.title,
    suggestion: p.suggestion || (idx === 0 
      ? 'Agrega 2 fotos adicionales con buena iluminación blanca. Publicaciones con 3+ fotos venden un 40% más rápido.'
      : 'Ajusta el precio un 5% para posicionarte como la mejor opción de tu zona geográfica.'),
    impact: idx % 2 === 0 ? 'Alta Conversión' : 'Precio Competitivo'
  }));

  return (
    <div className="space-y-4 animate-fadeIn text-gray-900 dark:text-slate-100">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-200/90 dark:border-slate-800 shadow-2xs space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">💡</span>
          <div>
            <h3 className="text-base font-black text-gray-900 dark:text-slate-100">
              Sugerencias de IA para Potenciar tus Ventas
            </h3>
            <p className="text-xs text-gray-500 font-medium">
              Analizamos la interacción de los compradores con tus publicaciones para ofrecerte recomendaciones personalizadas.
            </p>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          {suggestions.map((item) => (
            <div key={item.id} className="p-4 bg-purple-50/70 dark:bg-purple-950/40 rounded-2xl border border-purple-100 dark:border-purple-900/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-purple-950 dark:text-purple-200 flex items-center gap-2">
                  <span>✨</span>
                  <span>{item.title}</span>
                </span>
                <span className="text-[10px] font-extrabold bg-purple-600 text-white px-2.5 py-0.5 rounded-full">
                  {item.impact}
                </span>
              </div>
              <p className="text-xs text-purple-900 dark:text-purple-300 font-medium leading-relaxed">
                {item.suggestion}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
