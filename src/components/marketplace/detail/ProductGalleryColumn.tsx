/**
 * ============================================================================
 * FILE: ProductGalleryColumn.tsx
 * ============================================================================
 * 
 * @description Componente modular para la columna izquierda del detalle de producto.
 *              Renderiza la Galería de fotos e incluye la tarjeta del
 *              ✦ Resumen de IA del artículo (Ficha Técnica estilo AliExpress) abajo.
 * 
 * @module Presentation/Components/Marketplace/Detail/ProductGalleryColumn
 * ============================================================================
 */

import React from 'react';
import ImageGallery from '@/components/marketplace/ImageGallery';

type Props = {
  title: string;
  imageUrls: string[];
  aiSummary: {
    summaryBullets: { title: string; description: string }[];
  } | null;
};

export default function ProductGalleryColumn({ title, imageUrls, aiSummary }: Props) {
  return (
    <div className="space-y-6">
      {/* Galería de fotos interactiva con miniaturas */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-gray-200/90 dark:border-slate-800 shadow-2xs">
        <ImageGallery images={imageUrls} />
      </div>

      {/* Tarjeta del Resumen de IA del artículo estilo AliExpress */}
      {aiSummary && aiSummary.summaryBullets.length > 0 && (
        <div className="bg-gradient-to-br from-blue-50/90 via-indigo-50/80 to-purple-50/90 dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-900 p-6 rounded-3xl border border-blue-200/90 dark:border-slate-800 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 border-b border-blue-200/60 dark:border-slate-800 pb-3">
            <span className="text-xl">✦</span>
            <h3 className="text-base font-black text-gray-900 dark:text-slate-100">
              Resumen de IA del artículo
            </h3>
          </div>

          <p className="text-[11px] text-gray-500 dark:text-slate-400 font-medium leading-relaxed italic">
            Aviso legal: Este contenido está generado por IA y no representa la opinión del vendedor. La plataforma y los vendedores no asumen ninguna responsabilidad legal al respecto.
          </p>

          <div className="space-y-3 pt-1">
            {aiSummary.summaryBullets.map((bullet, idx) => (
              <div key={idx} className="flex items-start gap-2.5 bg-white/80 dark:bg-slate-800/60 p-3 rounded-2xl border border-blue-100/80 dark:border-slate-700/80">
                <span className="text-blue-600 dark:text-blue-400 font-black text-sm mt-0.5">•</span>
                <div>
                  <h4 className="text-xs font-extrabold text-gray-900 dark:text-slate-100">
                    {bullet.title}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-slate-300 font-medium leading-relaxed mt-0.5">
                    {bullet.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
