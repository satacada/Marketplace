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

      <div className="p-5 space-y-5 max-h-[calc(100vh-140px)] overflow-y-auto scrollbar-thin">
        {/* Contenedor de Imagen Principal */}
        <div className="relative aspect-4/3 w-full bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden border border-gray-200/60 dark:border-slate-700 flex items-center justify-center">
          {mainImage ? (
            <img
              src={mainImage}
              alt="Vista previa"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-center p-6 text-gray-400 dark:text-slate-500">
              <span className="text-5xl block mb-2">📸</span>
              <p className="text-xs font-bold">Vista previa de la publicación</p>
              <p className="text-[11px] font-medium mt-0.5">Sube fotos a la izquierda para verlas aquí</p>
            </div>
          )}

          {imageUrls.length > 1 && (
            <span className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-extrabold px-2.5 py-1 rounded-xl shadow-xs">
              1 / {imageUrls.length}
            </span>
          )}
        </div>

        {/* Título y Precio */}
        <div className="space-y-1 pb-4 border-b border-gray-100 dark:border-slate-800">
          <h2 className="text-xl font-extrabold text-gray-900 dark:text-slate-100 leading-snug">
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
        {description && description.includes('✦ Resumen de IA') && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-slate-800/80 dark:to-slate-800 border border-purple-200 dark:border-slate-700 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-purple-900 dark:text-purple-300">
              <span>✨</span>
              <span>✦ Resumen de IA del artículo (Ficha Técnica)</span>
            </div>
            <p className="text-xs text-gray-700 dark:text-slate-300 leading-relaxed font-medium line-clamp-4">
              {description}
            </p>
          </div>
        )}

        {/* Descripción general */}
        <div className="space-y-1.5">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-500 dark:text-slate-400">
            Descripción
          </h4>
          <p className="text-xs text-gray-700 dark:text-slate-300 leading-relaxed whitespace-pre-line font-medium bg-slate-50 dark:bg-slate-800/30 p-3 rounded-xl border border-gray-100 dark:border-slate-800">
            {description.trim() || 'La descripción redactada aparecerá aquí...'}
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
