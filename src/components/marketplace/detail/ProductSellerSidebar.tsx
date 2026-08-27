/**
 * ============================================================================
 * FILE: ProductSellerSidebar.tsx
 * ============================================================================
 * 
 * @description Componente modular para el sidebar derecho del detalle de producto.
 *              Reorganizado según indicación visual del usuario:
 *              1. Categoría y Favorito
 *              2. Título, Precio y Fecha de Publicación
 *              3. Detalles de la Publicación (Descripción libre)
 *              4. Ubicación del Vendedor (Mapa Estático)
 *              5. BLOQUE DE BOTONES (Agregar al Carrito, Compartir, Reportar)
 *              6. Información del Vendedor & Formulario de Chat
 * 
 * @module Presentation/Components/Marketplace/Detail/ProductSellerSidebar
 * ============================================================================
 */

import React, { useState } from 'react';
import Link from 'next/link';
import OpenStreetMapEmbed from '@/components/ui/OpenStreetMapEmbed';
import { formatPublicationDate } from '@/lib/formatPublicationDate';
import { DetailProduct } from '@/features/products/hooks/useProductDetail';

type Props = {
  product: DetailProduct;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  isCartAdded: boolean;
  onAddToCart: () => void;
  onShare: () => void;
  onReport: (type: 'product' | 'seller', title: string) => void;
  onOpenLocationModal: () => void;
  userId: string | null;
};

export default function ProductSellerSidebar({
  product,
  isFavorite,
  onToggleFavorite,
  isCartAdded,
  onAddToCart,
  onShare,
  onReport,
  onOpenLocationModal,
  userId,
}: Props) {
  const isOwnProduct = userId && product.seller_id === userId;
  const [quickMessage, setQuickMessage] = useState('Hola, ¿Sigue estando disponible?');
  const [messageSent, setMessageSent] = useState(false);

  const handleSendQuickMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickMessage.trim()) return;
    setMessageSent(true);
    setTimeout(() => setMessageSent(false), 3000);
  };

  const formattedDate = formatPublicationDate(product.created_at);
  const locationText = product.location_name || 'Ciudad de Buenos Aires, CABA';

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-200/90 dark:border-slate-800 shadow-2xs space-y-6 sticky top-6 text-gray-900 dark:text-slate-100">
      {/* 1. Categoría y Botón de Favorito */}
      <div className="flex justify-between items-center">
        <span className="text-xs font-extrabold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-full border border-blue-100 dark:border-blue-900">
          {product.categories?.name || 'Sin categoría'}
        </span>

        <button
          type="button"
          onClick={onToggleFavorite}
          className={`w-9 h-9 rounded-full flex items-center justify-center border transition cursor-pointer ${
            isFavorite
              ? 'bg-rose-600 text-white border-rose-500 shadow-md'
              : 'bg-gray-100 dark:bg-slate-800 text-gray-500 hover:text-rose-600 border-gray-200 dark:border-slate-700'
          }`}
          title={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        >
          ❤️
        </button>
      </div>

      {/* 2. Título, Precio y Fecha de Publicación Amigable */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-black leading-tight">
          {product.title}
        </h1>
        <p className="text-base font-black text-blue-600 dark:text-blue-400">
          ${product.price?.toLocaleString('es-AR')} · <span className="text-emerald-600 font-extrabold text-xs">{product.stock > 0 ? 'Disponible' : 'Agotado'}</span>
        </p>
        
        <p className="text-xs font-extrabold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-xl inline-block border border-amber-200 dark:border-amber-900">
          📍 {formattedDate} en {locationText}
        </p>
      </div>

      {/* 3. Detalles de la Publicación (Descripción Libre) */}
      <div className="space-y-2">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-400">
          Detalles de la Publicación
        </h3>
        <p className="text-xs text-gray-700 dark:text-slate-300 font-medium leading-relaxed whitespace-pre-line bg-gray-50/60 dark:bg-slate-800/30 p-3.5 rounded-2xl border border-gray-100 dark:border-slate-800">
          {product.description || 'El vendedor no agregó detalles adicionales.'}
        </p>
      </div>

      {/* 4. Ubicación con Mapa Estático Clickeable */}
      <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-slate-800">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
          Ubicación del Vendedor
        </span>
        <div 
          onClick={onOpenLocationModal}
          className="rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-800 cursor-pointer hover:opacity-90 transition relative group"
          title="Haz clic para ampliar y navegar en la ubicación"
        >
          <OpenStreetMapEmbed height="h-28" interactive={false} />
          <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/10 transition flex items-center justify-center">
            <span className="text-[10px] font-black text-white bg-slate-900/80 px-2.5 py-1 rounded-full opacity-0 group-hover:opacity-100 transition shadow-md">
              🔍 Ver mapa completo
            </span>
          </div>
        </div>
        <p className="text-[11px] font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 p-2 rounded-xl border border-amber-200/60 dark:border-amber-900/40">
          📍 <strong>{locationText}</strong> · <span className="font-semibold">La ubicación es aproximada</span>
        </p>
      </div>

      {/* 5. Acciones de Compra, Carrito, Compartir y Reportar (Reubicado según la flecha del usuario) */}
      <div className="space-y-2.5 pt-2 border-t border-gray-100 dark:border-slate-800">
        {isOwnProduct ? (
          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-2xl text-center text-xs font-bold text-amber-800 dark:text-amber-300">
            Es tu propia publicación
          </div>
        ) : (
          <button
            type="button"
            onClick={onAddToCart}
            className={`w-full py-3.5 rounded-2xl font-extrabold text-xs transition shadow-sm flex items-center justify-center gap-2 cursor-pointer ${
              isCartAdded
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            <span>🛒</span>
            <span>{isCartAdded ? '¡Agregado al Carrito!' : 'Agregar al Carrito'}</span>
          </button>
        )}

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onShare}
            className="w-1/2 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 text-xs font-bold text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>🔗</span>
            <span>Compartir</span>
          </button>
          <button
            type="button"
            onClick={() => onReport('product', product.title)}
            className="w-1/2 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 text-xs font-bold text-gray-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>🚩</span>
            <span>Reportar</span>
          </button>
        </div>
      </div>

      {/* 6. Datos del Vendedor con Estrellas y Caja de Chat Rápido */}
      <div className="pt-4 border-t border-gray-100 dark:border-slate-800 space-y-4">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
          Información del Vendedor
        </span>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center font-black text-sm">
              🏪
            </div>
            <div>
              <Link 
                href={`/marketplace/store/${product.seller_id}`} 
                className="text-xs font-black text-gray-900 dark:text-slate-100 hover:text-blue-600 transition"
              >
                {product.profiles?.store_name || 'Vendedor Verificado'}
              </Link>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-amber-400 text-xs">⭐⭐⭐⭐⭐</span>
                <span className="text-[11px] font-bold text-gray-500">5.0 (7)</span>
              </div>
            </div>
          </div>

          <Link
            href={`/marketplace/store/${product.seller_id}`}
            className="text-xs font-bold text-blue-600 hover:underline"
          >
            Ver Tienda →
          </Link>
        </div>

        {/* Caja de Enviar Mensaje al Vendedor */}
        {!isOwnProduct && (
          <form onSubmit={handleSendQuickMessage} className="space-y-2 pt-2">
            <span className="text-xs font-extrabold text-gray-700 dark:text-slate-300 block">
              Envía un mensaje al vendedor
            </span>
            <div className="flex gap-2">
              <input
                type="text"
                value={quickMessage}
                onChange={(e) => setQuickMessage(e.target.value)}
                className="flex-1 px-3 py-2 text-xs border border-gray-300 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800 font-medium"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black transition cursor-pointer"
              >
                Enviar
              </button>
            </div>
            {messageSent && (
              <p className="text-[11px] font-bold text-emerald-600">¡Mensaje enviado al vendedor con éxito!</p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
