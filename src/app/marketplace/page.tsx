/**
 * ============================================================================
 * FILE: page.tsx (app/marketplace)
 * ============================================================================
 * 
 * @description Catálogo Público del Marketplace al estilo Facebook Marketplace / AliExpress.
 *              Incluye:
 *              - Panel Lateral Izquierdo de Filtros estilo Facebook Marketplace
 *              - Grilla Principal de Productos en ANCHO COMPLETO (lg:col-span-9)
 *              - Panel Emergente Deslizante para la Cesta (MiniCartDrawer) sin restar espacio a los productos
 *              - Navegación Directa a la Cesta completa (/marketplace/cart) desde el header
 *              - Carrito reactivo en tiempo real para usuarios NO registrados e invitados
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
import { Modal } from '@/components/ui/Modal';
import { useMarketplaceCatalog } from '@/features/marketplace/hooks/useMarketplaceCatalog';
import ProductCard from '@/components/marketplace/catalog/ProductCard';
import CatalogHeaderBanner from '@/components/marketplace/catalog/CatalogHeaderBanner';
import CatalogFilterSidebar from '@/components/marketplace/catalog/CatalogFilterSidebar';
import VisualSearchModal from '@/components/marketplace/catalog/VisualSearchModal';
import LocationSelectorModal from '@/components/marketplace/catalog/LocationSelectorModal';
import MiniCartDrawer from '@/components/cart/MiniCartDrawer';

export default function MarketplacePage() {
  const catalog = useMarketplaceCatalog();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 transition-colors duration-200">
      {/* Header global único (Contiene Logo Marketplace y Carrito Reactivo que envía directo a /marketplace/cart) */}
      <div className="p-4 sm:p-6 max-w-7xl mx-auto pb-0">
        <Header />
      </div>

      <main className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Barra de Búsqueda Estilo Google con Icono de Foto 📷 Embebido */}
        <CatalogHeaderBanner
          searchQuery={catalog.searchQuery}
          onSearchChange={catalog.setSearchQuery}
          sortBy={catalog.sortBy}
          onSortChange={catalog.setSortBy}
          onOpenVisualSearch={() => catalog.setShowVisualSearchModal(true)}
          totalCount={catalog.totalCount}
          categories={catalog.categories}
          selectedCategory={catalog.selectedCategory}
          onSelectCategory={catalog.setSelectedCategory}
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

        {/* Layout Principal de Ancho Completo:
            1. Sidebar Izquierdo (col-span-3): Filtros Estilo Facebook Marketplace
            2. Grilla Principal (col-span-9): Productos en Ancho Completo (sin quitar espacio)
        */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Sidebar Izquierdo: Panel de Filtros Estilo Facebook */}
          <div className="lg:col-span-3 space-y-6">
            <CatalogFilterSidebar
              priceRange={catalog.priceRange}
              onPriceChange={catalog.setPriceRange}
              inStockOnly={catalog.inStockOnly}
              onInStockChange={catalog.setInStockOnly}
              sortBy={catalog.sortBy}
              onSortChange={catalog.setSortBy}
              showRecommendations={catalog.showRecommendations}
              onToggleRecommendations={() => catalog.setShowRecommendations(!catalog.showRecommendations)}
              locationName={catalog.locationName}
              radiusKm={catalog.radiusKm}
              onOpenLocationModal={() => catalog.setShowLocationModal(true)}
            />

            {/* Botón flotante opcional para desplegar el drawer de la Cesta sin salir de la página */}
            {catalog.cart.itemCount > 0 && (
              <button
                type="button"
                onClick={() => catalog.setShowCartDrawer(true)}
                className="w-full py-3 px-4 bg-blue-50 dark:bg-slate-800 hover:bg-blue-100 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-slate-700 rounded-2xl text-xs font-black transition shadow-2xs flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span>🛒</span>
                  <span>Ver Cesta Emergente</span>
                </div>
                <span className="bg-blue-600 text-white px-2 py-0.5 rounded-full text-[10px]">
                  {catalog.cart.itemCount}
                </span>
              </button>
            )}
          </div>

          {/* Grilla Principal Derecha: Productos (Ancho completo 4 columnas) */}
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
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                >
                  Limpiar Filtros
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
                    onAddToCart={(id, info) => catalog.handleAddToCart(id, info)}
                    onViewDetails={(id) => catalog.handleViewDetails(id)}
                    isFavorite={catalog.favoriteProductIds.includes(product.id)}
                    onToggleFavorite={(id) => catalog.handleToggleFavorite(id)}
                    onShareProduct={(p) => catalog.setShareProduct(p)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer Global */}
      <Footer />

      {/* Slide-over Drawer Emergente para la Cesta (No quita espacio en la grilla) */}
      <MiniCartDrawer
        isOpen={catalog.showCartDrawer}
        onClose={() => catalog.setShowCartDrawer(false)}
        cart={catalog.cart}
        isGuest={catalog.isGuest}
        onUpdateQuantity={catalog.updateCartItem}
        onRemoveItem={catalog.removeFromCart}
        onCheckoutClick={catalog.handleCheckoutClick}
      />

      {/* Modal de Ubicación GPS / Radio en km (Estilo Facebook Marketplace) */}
      {catalog.showLocationModal && (
        <LocationSelectorModal
          isOpen={catalog.showLocationModal}
          onClose={() => catalog.setShowLocationModal(false)}
          currentLocation={catalog.locationName}
          currentRadiusKm={catalog.radiusKm}
          onApplyLocation={(city, radius) => {
            catalog.setLocationName(city);
            catalog.setRadiusKm(radius);
          }}
        />
      )}

      {/* Modal de Búsqueda Visual por Foto 📷 */}
      {catalog.showVisualSearchModal && (
        <VisualSearchModal
          isOpen={catalog.showVisualSearchModal}
          onClose={() => catalog.setShowVisualSearchModal(false)}
          visualSearchImage={catalog.visualSearchImage}
          onImageSelect={catalog.handleVisualSearchSelect}
          onConfirmSearch={catalog.handleConfirmVisualSearch}
          isProcessing={catalog.isProcessingVisualSearch}
        />
      )}

      {/* Modal de Compartir en Redes Sociales */}
      {catalog.shareProduct && (
        <ShareModal
          isOpen={!!catalog.shareProduct}
          onClose={() => catalog.setShareProduct(null)}
          product={catalog.shareProduct}
        />
      )}
    </div>
  );
}