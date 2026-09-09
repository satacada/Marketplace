/**
 * ============================================================================
 * FILE: page.tsx (app/marketplace/store/[sellerId])
 * ============================================================================
 * 
 * @description Vista Dedicada de Tienda de Vendedor (/marketplace/store/[sellerId]).
 *              Refactorizado bajo Clean Architecture y SOLID:
 *              - Lógica de la vitrina en `useSellerStore`
 *              - Vista estructurada y modular (< 140 líneas)
 * 
 * @module Presentation/Pages/Marketplace/Store
 * ============================================================================
 */

'use client';

import React, { use } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ShareModal from '@/components/marketplace/ShareModal';
import SellerRatingSummaryCard from '@/components/reviews/SellerRatingSummaryCard';
import ProductCard from '@/components/marketplace/catalog/ProductCard';
import { useSellerStore } from '@/features/stores/hooks/useSellerStore';

export default function StoreShowcasePage({ params }: { params: Promise<{ sellerId: string }> }) {
  const resolvedParams = use(params);
  const sellerId = resolvedParams.sellerId;

  const store = useSellerStore(sellerId);

  if (store.loadingSeller) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 p-8 flex items-center justify-center">
        <p className="text-gray-500 font-bold text-sm">Cargando vitrina de la tienda...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 transition-colors duration-200">
      <Header
        cartItemCount={store.cartItemCount}
        cartTotal={store.cartTotal}
        ordersCount={store.ordersCount}
      />

      <main className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Cabecera de la Tienda */}
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-gray-200/90 dark:border-slate-800 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black text-2xl border-2 border-blue-200 dark:border-blue-800">
                🏪
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-slate-100">
                    {store.sellerProfile?.store_name || 'Tienda en Marketplace'}
                  </h1>
                  {store.sellerProfile?.is_trusted_seller && (
                    <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                      ✓ Verificado
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  <p className="text-xs text-gray-500 font-medium">
                    📍 {store.sellerProfile?.city || 'Barracas, Buenos Aires'} | {store.totalProducts} productos activos
                  </p>
                  {store.ratingSummary.totalReviews > 0 && (
                    <a
                      href="#reputacion-tienda"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-200/80 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900 transition"
                      title="Ver valoraciones detalladas"
                    >
                      <span>⭐ {store.ratingSummary.averageRating}</span>
                      <span className="text-gray-600 dark:text-slate-300">({store.ratingSummary.totalReviews})</span>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold">• {store.ratingSummary.positivePercentage}% positivo</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Buscador e Identificación de Catálogo de esta Tienda (PRODUCTOS PRIMERO) */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-200/90 dark:border-slate-800 shadow-2xs space-y-4">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-gray-800 dark:text-slate-200">
            Productos de esta Tienda ({store.totalProducts})
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              value={store.searchQuery}
              onChange={(e) => store.setSearchQuery(e.target.value)}
              placeholder="Buscar en los productos de esta tienda..."
              className="w-full p-3 text-xs border border-gray-300 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-slate-100 font-medium"
            />
            <select
              value={store.selectedCategoryId}
              onChange={(e) => store.setSelectedCategoryId(e.target.value)}
              className="w-full p-3 text-xs border border-gray-300 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-slate-100 font-bold"
            >
              <option value="">Todas las categorías de esta tienda</option>
              {store.categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Grilla de productos de la Tienda */}
        {store.loadingProducts ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 dark:bg-slate-800 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : store.products.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl text-center border border-gray-200 dark:border-slate-800 space-y-2">
            <p className="text-gray-500 font-bold text-sm">Esta tienda aún no tiene productos publicados.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {store.products.map((product) => (
              <ProductCard
                key={product.id}
                product={product as any}
                userId={store.userId}
                cartQuantity={0}
                onAddToCart={(id, info) => store.handleAddToCart(id, info)}
                onViewDetails={(id) => store.router.push(`/marketplace/product/${id}`)}
                isFavorite={store.favoriteProductIds.has(product.id)}
                onToggleFavorite={store.handleToggleFavorite}
                onShareProduct={(p) => store.setShareProduct(p)}
              />
            ))}
          </div>
        )}

        {/* Resumen de Opiniones y Reputación del Vendedor (DEBAJO DE LOS PRODUCTOS) */}
        <div id="reputacion-tienda" className="pt-4">
          <SellerRatingSummaryCard
            sellerStoreName={store.sellerProfile?.store_name || 'Esta tienda'}
            summary={store.ratingSummary}
            reviews={store.reviews}
            loading={store.loadingReviews}
            onAddReview={async (data) => {
              if (store.userId) {
                await store.addReview(data as any, store.userId);
              }
            }}
          />
        </div>
      </main>

      <Footer />

      {/* Modal de Compartir */}
      {store.shareProduct && (
        <ShareModal
          isOpen={!!store.shareProduct}
          onClose={() => store.setShareProduct(null)}
          product={store.shareProduct}
        />
      )}
    </div>
  );
}
