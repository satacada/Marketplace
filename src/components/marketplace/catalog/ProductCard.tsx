/**
 * ============================================================================
 * FILE: ProductCard.tsx
 * ============================================================================
 * 
 * @description Componente modular para renderizar tarjetas compactas de producto
 *              en el catálogo del Marketplace con navegación por fotos, favoritos y carrito.
 * 
 * @module Presentation/Components/Marketplace/Catalog/ProductCard
 * ============================================================================
 */

import React, { useState, useCallback, memo } from 'react';
import Image from 'next/image';

export type CatalogProduct = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  stock: number;
  image_urls: string[] | null;
  seller_id: string;
  category_id: string | null;
  status: string;
  location_name?: string | null;
  categories: { name: string } | null;
  profiles: { store_name: string | null } | null;
  has_free_shipping?: boolean;
  average_rating?: number;
};

type Props = {
  product: CatalogProduct;
  userId: string | null;
  cartQuantity: number;
  onAddToCart: (id: string, productInfo?: { title: string; price?: number; image_url: string | null; seller_id: string }) => void;
  onViewDetails: (id: string) => void;
  isFavorite: boolean;
  onToggleFavorite: (productId: string) => void;
  onShareProduct: (product: any) => void;
};

const ProductCard = memo(({ 
  product, 
  userId, 
  cartQuantity, 
  onAddToCart,
  onViewDetails,
  isFavorite,
  onToggleFavorite,
  onShareProduct
}: Props) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = product.image_urls || [];
  const isInCart = cartQuantity > 0;
  const isOwnProduct = userId && product.seller_id === userId;

  const openLightbox = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => setLightboxOpen(false), []);

  const nextImage = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  }, [images.length]);

  const prevImage = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  }, [images.length]);

  const handleClick = useCallback(() => {
    onViewDetails(product.id);
  }, [product.id, onViewDetails]);

  return (
    <>
      <div 
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xs border border-gray-200/90 dark:border-slate-800 overflow-hidden flex flex-col hover:shadow-xs transition-all duration-300 cursor-pointer group"
        onClick={handleClick}
      >
        {/* Imagen compacta con navegación por flechas e indicador */}
        <div className="relative h-40 bg-slate-100 dark:bg-slate-800">
          {images.length > 0 ? (
            <div className="relative w-full h-full">
              <Image
                src={images[currentImageIndex]}
                alt={product.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300 rounded-t-2xl cursor-pointer"
                loading="lazy"
                title={`Ver detalle de "${product.title}"`}
                onClick={openLightbox}
              />

              {/* Flechas de navegación de fotos en la tarjeta */}
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prevImage}
                    className="absolute left-1 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black text-white w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold shadow-md z-10"
                    title="Foto anterior"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={nextImage}
                    className="absolute right-1 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black text-white w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold shadow-md z-10"
                    title="Foto siguiente"
                  >
                    ›
                  </button>

                  {/* Indicador visual de fotos (📷 1/3) */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-xs flex items-center gap-1 z-10 pointer-events-none">
                    <span>📷</span>
                    <span>{currentImageIndex + 1}/{images.length}</span>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800">
              <span className="text-3xl mb-1">📦</span>
              <span className="text-[10px] font-extrabold text-gray-500 dark:text-slate-400">Sin foto</span>
            </div>
          )}

          {/* Botón de Favoritos - SIEMPRE VISIBLE ARRIBA A LA DERECHA */}
          <div className="absolute top-2 right-2 z-10">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(product.id);
              }}
              className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all duration-200 hover:scale-110 border ${
                isFavorite 
                  ? 'bg-rose-600 text-white border-rose-500 shadow-rose-900/30' 
                  : 'bg-slate-900/80 hover:bg-slate-900 text-white border-slate-700/80 backdrop-blur-xs'
              }`}
              title={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill={isFavorite ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.684a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>

          {/* Badges compactos */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
            {product.has_free_shipping && (
              <span className="bg-emerald-600 text-white text-[10px] px-1.5 py-0.5 rounded font-extrabold shadow-xs">
                🚚
              </span>
            )}
            {product.average_rating && product.average_rating >= 4 && (
              <span className="bg-amber-500 text-white text-[10px] px-1.5 py-0.5 rounded font-extrabold shadow-xs">
                ⭐ {product.average_rating.toFixed(1)}
              </span>
            )}
          </div>
        </div>
        
        {/* Cuerpo de la tarjeta */}
        <div className="p-3 flex-1 flex flex-col justify-between bg-white dark:bg-slate-900">
          <div>
            <div className="mb-1 flex items-center justify-between gap-1">
              <span className="text-[10px] font-extrabold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-1.5 py-0.5 rounded border border-blue-100 dark:border-blue-900">
                {product.categories?.name || 'Sin categoría'}
              </span>
              
              {isOwnProduct && product.status === 'pending' && (
                <span className="text-[10px] font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-1 py-0.5 rounded border border-amber-300 dark:border-amber-800">
                  Pendiente
                </span>
              )}
            </div>
            
            <h3 
              className="text-sm font-extrabold text-gray-900 dark:text-slate-100 mb-1 hover:text-blue-600 dark:hover:text-blue-400 transition line-clamp-1 cursor-pointer"
              title={`Ver detalle de "${product.title}"`}
            >
              {product.title}
            </h3>
            
            {/* Precio, Stock y Botón de Carrito */}
            <div className="flex items-center justify-between my-1">
              <div title={`Ver detalle de "${product.title}"`} className="cursor-pointer">
                <div className="text-base font-black text-blue-600 dark:text-blue-400">
                  ${product.price?.toLocaleString('es-CL')}
                </div>
                <div className={`text-[10px] font-bold ${product.stock > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  {product.stock > 0 ? `Stock: ${product.stock}` : 'Sin stock'}
                </div>
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0">
                {/* Botón de Compartir en redes sociales */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onShareProduct(product);
                  }}
                  className="w-8 h-8 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400 border border-gray-200/80 dark:border-slate-700 flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-2xs"
                  title="Compartir producto (WhatsApp, Telegram, Messenger, Facebook...)"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </button>

                {/* Botón de Añadir al Carrito */}
                {!isOwnProduct && (
                  <div className="relative">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(product.id, {
                          title: product.title,
                          price: product.price,
                          image_url: images[0] || null,
                          seller_id: product.seller_id
                        });
                      }}
                      className={`h-8 px-2.5 rounded-full flex items-center justify-center gap-1 font-extrabold text-[11px] transition-all duration-200 shadow-xs border ${
                        isInCart 
                          ? 'bg-blue-600 text-white border-blue-500 hover:bg-blue-700' 
                          : 'bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 hover:bg-blue-600 hover:text-white'
                      }`}
                      title={isInCart ? `${cartQuantity} unidades en el carrito` : 'Agregar al carrito'}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span>{isInCart ? `${cartQuantity}` : 'Agregar'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Vendedor y Ubicación */}
            <div className="pt-2 mt-1 border-t border-gray-100 dark:border-slate-800 flex justify-between items-center text-[10px] text-gray-500 dark:text-slate-400">
              <span className="truncate font-semibold max-w-[110px]" title={product.profiles?.store_name || 'Vendedor'}>
                🏪 {product.profiles?.store_name || 'Vendedor'}
              </span>
              <span className="truncate font-bold text-gray-400 dark:text-slate-500 max-w-[100px]" title={product.location_name || 'Barracas'}>
                📍 {product.location_name || 'Barracas'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Lightbox de Foto Ampliada */}
      {lightboxOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white bg-slate-800/80 hover:bg-slate-700 w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold z-50 transition"
              title="Cerrar vista ampliada"
            >
              ✕
            </button>
            
            <Image
              src={images[currentImageIndex]}
              alt={product.title}
              width={1200}
              height={800}
              className="max-h-[85vh] w-auto object-contain rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />

            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-slate-800/80 hover:bg-slate-700 w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold transition"
                  title="Foto anterior"
                >
                  ‹
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-slate-800/80 hover:bg-slate-700 w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold transition"
                  title="Foto siguiente"
                >
                  ›
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
});

export default ProductCard;
