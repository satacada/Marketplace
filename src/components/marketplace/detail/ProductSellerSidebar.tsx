/**
 * ============================================================================
 * FILE: ProductSellerSidebar.tsx
 * ============================================================================
 * 
 * @description Componente modular para el sidebar derecho del detalle de producto.
 *              Muestra título, categoría, precio, stock, descripción libre del vendedor,
 *              información de la tienda y botones de compra.
 * 
 * @module Presentation/Components/Marketplace/Detail/ProductSellerSidebar
 * ============================================================================
 */

import React from 'react';
import Link from 'next/link';
import { DetailProduct } from '@/features/products/hooks/useProductDetail';

type Props = {
  product: DetailProduct;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  isCartAdded: boolean;
  onAddToCart: () => void;
  onShare: () => void;
  onReport: (type: 'product' | 'seller', title: string) => void;
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
  userId,
}: Props) {
  const isOwnProduct = userId && product.seller_id === userId;

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-200/90 dark:border-slate-800 shadow-2xs space-y-6 sticky top-6">
      {/* Categoría y Botón de Favorito */}
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

      {/* Título de la Publicación */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-slate-100 leading-tight">
          {product.title}
        </h1>
        <p className="text-xs font-bold text-gray-400 mt-1">
          📍 {product.location_name || 'Barracas, Buenos Aires'}
        </p>
      </div>

      {/* Precio & Stock */}
      <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-gray-100 dark:border-slate-800 flex items-baseline justify-between">
        <div>
          <span className="text-3xl font-black text-blue-600 dark:text-blue-400">
            ${product.price?.toLocaleString('es-CL')}
          </span>
        </div>
        <span className={`text-xs font-extrabold px-2.5 py-1 rounded-full border ${product.stock > 0 ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900' : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-900'}`}>
          {product.stock > 0 ? `Stock: ${product.stock} unidades` : 'Sin stock'}
        </span>
      </div>

      {/* Descripción Libre del Vendedor (Sin repetir la Ficha Técnica de IA) */}
      <div className="space-y-2">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-500 dark:text-slate-400">
          Descripción del Vendedor
        </h3>
        <p className="text-xs text-gray-700 dark:text-slate-300 font-medium leading-relaxed whitespace-pre-line bg-gray-50/50 dark:bg-slate-800/20 p-4 rounded-2xl border border-gray-100 dark:border-slate-800">
          {product.description || 'El vendedor no agregó comentarios adicionales.'}
        </p>
      </div>

      {/* Acciones de Compra y Carrito */}
      <div className="space-y-2.5 pt-2">
        {isOwnProduct ? (
          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-2xl text-center text-xs font-bold text-amber-800 dark:text-amber-300">
            Es tu propia publicación
          </div>
        ) : (
          <>
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
          </>
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

      {/* Datos e Información de la Tienda Vendedora */}
      <div className="pt-4 border-t border-gray-100 dark:border-slate-800 space-y-3">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
          Información del Vendedor
        </span>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black text-sm">
              🏪
            </div>
            <div>
              <Link 
                href={`/marketplace/store/${product.seller_id}`} 
                className="text-xs font-black text-gray-900 dark:text-slate-100 hover:text-blue-600 transition"
              >
                {product.profiles?.store_name || 'Tienda en Marketplace'}
              </Link>
              <div className="flex items-center gap-1 mt-0.5">
                {product.profiles?.is_trusted_seller && (
                  <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-900">
                    ✓ Verificado
                  </span>
                )}
              </div>
            </div>
          </div>

          <Link
            href={`/marketplace/store/${product.seller_id}`}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
          >
            Ver Tienda →
          </Link>
        </div>
      </div>
    </div>
  );
}
