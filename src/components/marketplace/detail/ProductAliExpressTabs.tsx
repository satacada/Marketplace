/**
 * ============================================================================
 * FILE: ProductAliExpressTabs.tsx
 * ============================================================================
 * 
 * @description Pestañas de detalle de producto organizadas con Valoraciones estilo AliExpress (Imagen 1 y 2):
 *              1. 📍 Valoraciones (4) — Estilo AliExpress con filtros por estrellas y compra verificada
 *              2. ❓ Preguntas al Vendedor (X) — Formulario de preguntas e historial completo
 *              3. ⚡ Este producto se compra con este otro (Combo)
 *              4. 💡 Sugerencias y Productos Relacionados (por análisis de foto)
 * 
 * @module Presentation/Components/Marketplace/Detail/ProductAliExpressTabs
 * ============================================================================
 */

import React, { useState } from 'react';
import ProductReviewsTab from './ProductReviewsTab';
import ProductQuestionsSection from './ProductQuestionsSection';
import FrequentlyBoughtTogether from './FrequentlyBoughtTogether';
import AISellerSuggestionsBox from './AISellerSuggestionsBox';
import RelatedProductsSection from './RelatedProductsSection';

type Props = {
  mainProductTitle: string;
  mainProductPrice: number;
  questions: any[];
  newQuestion: string;
  onNewQuestionChange: (val: string) => void;
  onSubmitQuestion: (e: React.FormEvent) => void;
  submitting: boolean;
  isOwnProduct: boolean;
  relatedProducts: any[];
};

export default function ProductAliExpressTabs({
  mainProductTitle,
  mainProductPrice,
  questions,
  newQuestion,
  onNewQuestionChange,
  onSubmitQuestion,
  submitting,
  isOwnProduct,
  relatedProducts,
}: Props) {
  const [activeTab, setActiveTab] = useState<'reviews' | 'questions' | 'combo' | 'related'>('questions');

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-gray-200/90 dark:border-slate-800 shadow-2xs space-y-6 text-gray-900 dark:text-slate-100">
      {/* Navegación por Pestañas Estilo AliExpress (Indicado en Imagen 1 y 2) */}
      <div className="flex items-center gap-6 border-b border-gray-100 dark:border-slate-800 pb-3 overflow-x-auto text-xs font-black">
        {/* Pestaña 1: Valoraciones (Estilo AliExpress - Imagen 1) */}
        <button
          type="button"
          onClick={() => setActiveTab('reviews')}
          className={`flex items-center gap-1.5 pb-2.5 transition border-b-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'reviews'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-slate-200'
          }`}
        >
          <span>📍</span>
          <span>Valoraciones (4)</span>
        </button>

        {/* Pestaña 2: Preguntas al Vendedor */}
        <button
          type="button"
          onClick={() => setActiveTab('questions')}
          className={`flex items-center gap-1.5 pb-2.5 transition border-b-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'questions'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-slate-200'
          }`}
        >
          <span>❓</span>
          <span>Preguntas al Vendedor ({questions.length})</span>
        </button>

        {/* Pestaña 3: Este producto se compra con este otro */}
        <button
          type="button"
          onClick={() => setActiveTab('combo')}
          className={`flex items-center gap-1.5 pb-2.5 transition border-b-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'combo'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-slate-200'
          }`}
        >
          <span>⚡</span>
          <span>Este producto se compra con este otro</span>
        </button>

        {/* Pestaña 4: Sugerencias y Productos Relacionados */}
        <button
          type="button"
          onClick={() => setActiveTab('related')}
          className={`flex items-center gap-1.5 pb-2.5 transition border-b-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'related'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-slate-200'
          }`}
        >
          <span>💡</span>
          <span>Sugerencias y Productos Relacionados</span>
        </button>
      </div>

      {/* Pestaña 1: Sección de Valoraciones Estilo AliExpress */}
      {activeTab === 'reviews' && (
        <ProductReviewsTab />
      )}

      {/* Pestaña 2: Sección de Preguntas al Vendedor */}
      {activeTab === 'questions' && (
        <div className="animate-fadeIn">
          <ProductQuestionsSection
            questions={questions}
            newQuestion={newQuestion}
            onNewQuestionChange={onNewQuestionChange}
            onSubmitQuestion={onSubmitQuestion}
            submitting={submitting}
            isOwnProduct={isOwnProduct}
          />
        </div>
      )}

      {/* Pestaña 3: Combo "Este producto se compra frecuentemente con este otro" */}
      {activeTab === 'combo' && (
        <div className="animate-fadeIn">
          <FrequentlyBoughtTogether
            mainProductTitle={mainProductTitle}
            mainProductPrice={mainProductPrice}
          />
        </div>
      )}

      {/* Pestaña 4: Sugerencias de IA y Productos Relacionados */}
      {activeTab === 'related' && (
        <div className="space-y-6 animate-fadeIn">
          <AISellerSuggestionsBox isOwnProduct={isOwnProduct} />
          <RelatedProductsSection products={relatedProducts} />
        </div>
      )}
    </div>
  );
}
