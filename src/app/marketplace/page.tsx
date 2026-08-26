/**
 * ============================================================================
 * FILE: page.tsx (app/marketplace)
 * ============================================================================
 * 
 * @description Catálogo Público del Marketplace al estilo Amazon / Mercado Libre.
 *              Refactorizado bajo Clean Architecture, SOLID y SRP:
 *              - Lógica de negocio y estado extraídos en `useMarketplaceCatalog`
 *              - Componentes modulares de interfaz (< 120 líneas)
 * 
 * @module Presentation/Pages/Marketplace
 * ============================================================================
 */

'use client';

import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ShareModal from '@/components/marketplace/ShareModal';
import PersonalizedRecommendationsSection from '@/components/marketplace/PersonalizedRecommendationsSection';
import { useMarketplaceCatalog } from '@/features/marketplace/hooks/useMarketplaceCatalog';
import ProductCard from '@/components/marketplace/catalog/ProductCard';
import CatalogHeaderBanner from '@/components/marketplace/catalog/CatalogHeaderBanner';
import CatalogFilterSidebar from '@/components/marketplace/catalog/CatalogFilterSidebar';
import VisualSearchModal from '@/components/marketplace/catalog/VisualSearchModal';

export default function MarketplacePage() {
  const catalog = useMarketplaceCatalog();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 transition-colors duration-200">
      {/* Header global */}
      <div className="p-4 sm:p-6 max-w-7xl mx-auto pb-0">
        <Header title="Marketplace" />
      </div>

      <main className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Banner superior con búsqueda y controles de ordenamiento */}
        <CatalogHeaderBanner
          searchQuery={catalog.searchQuery}
          onSearchChange={catalog.setSearchQuery}
          sortBy={catalog.sortBy}
          onSortChange={catalog.setSortBy}
          showRecommendations={catalog.showRecommendations}
          onToggleRecommendations={() => catalog.setShowRecommendations(!catalog.showRecommendations)}
          onOpenVisualSearch={() => catalog.setShowVisualSearchModal(true)}
          totalCount={catalog.totalCount}
        />

        {/* Sección opcional de Recomendaciones Personalizadas (a demanda) */}
        {catalog.showRecommendations && catalog.userId && (
          <div className="animate-fadeIn">
            <PersonalizedRecommendationsSection
              userId={catalog.userId}
              onAddToCart={catalog.handleAddToCart}
              onClose={() => catalog.setShowRecommendations(false)}
            />
          </div>
        )}

        {/* Layout Principal: Sidebar de Filtros + Grilla de Productos */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Sidebar Izquierdo: Filtros */}
          <div className="lg:col-span-3 space-y-6">
            <CatalogFilterSidebar
              categories={catalog.categories}
              categoriesLoading={catalog.categoriesLoading}
              selectedCategory={catalog.selectedCategory}
              onSelectCategory={catalog.setSelectedCategory}
              priceRange={catalog.priceRange}
              onPriceChange={catalog.setPriceRange}
              inStockOnly={catalog.inStockOnly}
              onInStockChange={catalog.setInStockOnly}
            />
          </div>

          {/* Grilla Derecha: Productos */}
          <div className="lg:col-span-9 space-y-6">
            {catalog.productsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-64 bg-gray-200 dark:bg-slate-800 animate-pulse rounded-2xl" />
                ))}
              </div>
            ) : catalog.products.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl text-center border border-gray-200 dark:border-slate-800 space-y-3">
                <span className="text-5xl">🔍</span>
                <h3 className="text-lg font-black text-gray-900 dark:text-slate-100">
                  No encontramos productos
                </h3>
                <p className="text-xs text-gray-500 max-w-md mx-auto">
                  Prueba cambiando la búsqueda, seleccionando otra categoría o borrando los filtros aplicados.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    catalog.setSearchQuery('');
                    catalog.setSelectedCategory(null);
                    catalog.setPriceRange({});
                  }}
                  className="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-xs hover:bg-blue-700 transition cursor-pointer"
                >
                  Restablecer Filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {catalog.products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product as any}
                    userId={catalog.userId}
                    cartQuantity={catalog.cartQuantities[product.id] || 0}
                    onAddToCart={catalog.handleAddToCart}
                    onViewDetails={catalog.handleViewDetails}
                    isFavorite={catalog.favoriteProductIds.includes(product.id)}
                    onToggleFavorite={catalog.handleToggleFavorite}
                    onShareProduct={catalog.setShareProduct}
                  />
                ))}
              </div>
            )}

            {/* Paginación */}
            {catalog.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 pt-4">
                <button
                  disabled={catalog.currentPage === 1}
                  onClick={() => catalog.setCurrentPage(p => p - 1)}
                  className="px-3.5 py-1.5 rounded-xl border border-gray-300 dark:border-slate-700 text-xs font-bold disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-slate-800 transition"
                >
                  Anterior
                </button>
                <span className="text-xs font-extrabold px-3 text-gray-700 dark:text-slate-300">
                  Página {catalog.currentPage} de {catalog.totalPages}
                </span>
                <button
                  disabled={catalog.currentPage === catalog.totalPages}
                  onClick={() => catalog.setCurrentPage(p => p + 1)}
                  className="px-3.5 py-1.5 rounded-xl border border-gray-300 dark:border-slate-700 text-xs font-bold disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-slate-800 transition"
                >
                  Siguiente
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer Global */}
      <Footer />

      {/* Modal de Búsqueda Visual por Foto */}
      <VisualSearchModal
        isOpen={catalog.showVisualSearchModal}
        onClose={() => catalog.setShowVisualSearchModal(false)}
        visualSearchImage={catalog.visualSearchImage}
        onImageSelect={(e) => {
          if (e.target.files && e.target.files[0]) {
            catalog.setVisualSearchImage(URL.createObjectURL(e.target.files[0]));
          }
        }}
        isProcessing={catalog.isProcessingVisualSearch}
        onConfirmSearch={() => {
          catalog.setIsProcessingVisualSearch(true);
          setTimeout(() => {
            catalog.setIsProcessingVisualSearch(false);
            catalog.setShowVisualSearchModal(false);
            catalog.setSearchQuery('Zapatillas');
          }, 1000);
        }}
      />

      {/* Modal de Compartir en Redes Sociales */}
      {catalog.shareProduct && (
        <ShareModal
          isOpen={!!catalog.shareProduct}
          onClose={() => catalog.setShareProduct(null)}
          product={{
            id: catalog.shareProduct.id,
            title: catalog.shareProduct.title,
            price: catalog.shareProduct.price,
            image_url: catalog.shareProduct.image_urls?.[0] || null,
          }}
        />
      )}
    </div>
  );
}