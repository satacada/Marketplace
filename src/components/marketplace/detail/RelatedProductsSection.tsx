/**
 * ============================================================================
 * FILE: RelatedProductsSection.tsx
 * ============================================================================
 * 
 * @description Componente modular "Productos Relacionados" (Te podría interesar).
 * 
 * @module Presentation/Components/Marketplace/Detail/RelatedProductsSection
 * ============================================================================
 */

import React from 'react';
import Link from 'next/link';

type RelatedItem = {
  id: string;
  title: string;
  price: number;
  image_url?: string | null;
};

type Props = {
  products: RelatedItem[];
};

export default function RelatedProductsSection({ products }: Props) {
  if (!products || products.length === 0) return null;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-gray-200/90 dark:border-slate-800 shadow-2xs space-y-4">
      <h3 className="text-base font-black text-gray-900 dark:text-slate-100">
        Te podría interesar (Productos Relacionados)
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {products.map((item) => (
          <Link
            key={item.id}
            href={`/marketplace/product/${item.id}`}
            className="group block bg-gray-50 dark:bg-slate-800/60 rounded-2xl p-3 border border-gray-100 dark:border-slate-800 hover:border-blue-500 transition"
          >
            <div className="h-32 bg-gray-200 dark:bg-slate-700 rounded-xl overflow-hidden mb-2 flex items-center justify-center">
              {item.image_url ? (
                <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition" />
              ) : (
                <span className="text-2xl">📦</span>
              )}
            </div>
            <p className="text-xs font-bold text-gray-900 dark:text-slate-100 truncate group-hover:text-blue-600">
              {item.title}
            </p>
            <p className="text-xs font-black text-blue-600 dark:text-blue-400 mt-0.5">
              ${item.price.toLocaleString('es-AR')}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
