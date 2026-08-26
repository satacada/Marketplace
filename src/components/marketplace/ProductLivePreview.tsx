/**
 * ============================================================================
 * FILE: ProductLivePreview.tsx
 * ============================================================================
 * 
 * @description Componente de Vista Previa en Tiempo Real (Live Preview) para la
 *              creación de publicaciones al estilo Facebook Marketplace.
 * 
 * @module Presentation/Components/Marketplace/ProductLivePreview
 * ============================================================================
 */

'use client';

import React from 'react';

type Props = {
  title: string;
  price: string;
  description: string;
  brand: string;
  model: string;
  material: string;
  condition: string;
  locationName: string;
  currencySymbol: string;
  imageUrls: string[];
  publicationType: 'article' | 'vehicle' | 'property';
  sellerName?: string;
  aiSummaryBullets?: { title: string; description: string }[];
};

export default function ProductLivePreview({
  title,
  price,
  description,
  brand,
  model,
  material,
  condition,
  locationName,
  currencySymbol,
  imageUrls,
  publicationType,
  sellerName = 'Tu Perfil de Vendedor',
  aiSummaryBullets = [],
}: Props) {
  const mainImage = imageUrls.length > 0 ? imageUrls[0] : null;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200/90 dark:border-slate-800 shadow-md overflow-hidden sticky top-6">
      {/* Encabezado de la Vista Previa */}
      <div className="bg-slate-100 dark:bg-slate-800/80 px-5 py-3 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-extrabold uppercase tracking-wider text-gray-700 dark:text-slate-200">
            Vista Previa en Vivo
          </span>
        </div>
        <span className="text-[11px] font-bold text-gray-500 dark:text-slate-400">
          Así lo verán los compradores
        </span>
      </div>

      <div className="p-5 space-y-5">
        {/* Imagen principal y miniaturas */}
        <div className="relative h-60 w-full bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-800 flex items-center justify-center">
          {mainImage ? (
            <img src={mainImage} alt={title} className="w-full h-full object-cover" />
          ) : (
            <div className="text-center p-6 text-gray-400">
              <span className="text-4xl block mb-2">📸</span>
              <span className="text-xs font-bold">Subes fotos para previsualizar</span>
            </div>
          )}
        </div>

        {/* Título y Precio */}
        <div className="space-y-1">
          <h2 className="text-lg font-black text-gray-900 dark:text-slate-100 leading-tight">
            {title.trim() || 'Título del producto o artículo'}
          </h2>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400 tracking-tight">
            {price ? `${currencySymbol} ${price}` : `${currencySymbol} 0`}
          </div>
          <p className="text-xs text-gray-500 dark:text-slate-400 font-medium flex items-center gap-1.5 pt-1">
            <span>📍 {locationName || 'Ubicación aproximada'}</span>
            <span>•</span>
            <span>Publicado hace un momento</span>
          </p>
        </div>

        {/* Atributos Resumidos */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-gray-100 dark:border-slate-800">
            <span className="text-[10px] text-gray-400 uppercase font-bold block">Marca</span>
            <span className="font-extrabold text-gray-800 dark:text-slate-200">{brand || 'Por definir'}</span>
          </div>
          <div className="p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-gray-100 dark:border-slate-800">
            <span className="text-[10px] text-gray-400 uppercase font-bold block">Material</span>
            <span className="font-extrabold text-gray-800 dark:text-slate-200">{material || 'Por definir'}</span>
          </div>
          <div className="p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-gray-100 dark:border-slate-800">
            <span className="text-[10px] text-gray-400 uppercase font-bold block">Modelo</span>
            <span className="font-extrabold text-gray-800 dark:text-slate-200">{model || 'General'}</span>
          </div>
          <div className="p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-gray-100 dark:border-slate-800">
            <span className="text-[10px] text-gray-400 uppercase font-bold block">Estado</span>
            <span className="font-extrabold text-gray-800 dark:text-slate-200">{condition}</span>
          </div>
        </div>

        {/* Tarjeta de Resumen de IA en Vista Previa */}
        {aiSummaryBullets && aiSummaryBullets.length > 0 && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 dark:from-slate-800/80 dark:to-slate-800 border border-purple-200 dark:border-slate-700 space-y-2">
            <div className="flex items-center justify-between text-xs font-extrabold text-purple-900 dark:text-purple-300">
              <div className="flex items-center gap-1.5">
                <span className="text-sm">✦</span>
                <span>Resumen de IA del artículo</span>
              </div>
              <span className="text-[9px] font-extrabold text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-950 px-2 py-0.5 rounded-full border border-purple-300 dark:border-purple-800">
                Ficha Técnica por IA
              </span>
            </div>
            <p className="text-[10px] text-gray-500 dark:text-slate-400 font-medium">
              Aviso legal: Este contenido está generado por IA y no representa la opinión del vendedor.
            </p>
            <ul className="space-y-1.5 pt-1 text-xs">
              {aiSummaryBullets.map((bullet, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-purple-600 dark:text-purple-400 font-black">•</span>
                  <div className="text-gray-700 dark:text-slate-300 font-medium">
                    <strong className="font-extrabold text-gray-900 dark:text-slate-100">{bullet.title}:</strong> {bullet.description}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Descripción general ingresada manualmente por el vendedor */}
        <div className="space-y-1.5">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-500 dark:text-slate-400">
            Descripción del vendedor
          </h4>
          <p className="text-xs text-gray-700 dark:text-slate-300 leading-relaxed whitespace-pre-line font-medium bg-slate-50 dark:bg-slate-800/30 p-3 rounded-xl border border-gray-100 dark:border-slate-800">
            {description.trim() || 'Los detalles adicionales que escribas manualmente aparecerán aquí...'}
          </p>
        </div>

        {/* Información del Vendedor */}
        <div className="pt-3 border-t border-gray-100 dark:border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-black flex items-center justify-center text-sm shadow-xs">
            {sellerName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h5 className="text-xs font-extrabold text-gray-900 dark:text-slate-100">{sellerName}</h5>
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">🟢 Vendedor Verificado en Marketplace</p>
          </div>
        </div>
      </div>
    </div>
  );
}
