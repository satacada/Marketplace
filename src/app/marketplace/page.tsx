/**
 * ============================================================================
 * FILE: page.tsx (app/marketplace)
 * ============================================================================
 * 
 * @description Catálogo Público del Marketplace al estilo Facebook Marketplace / AliExpress.
 *              Incluye:
 *              - Panel Lateral Izquierdo de Filtros estilo Facebook Marketplace
 *              - Grilla Central de Productos
 *              - Panel Lateral Derecha Flotante de Cesta (MiniCartSidebar) estilo AliExpress
 *              - Carrito reactivo en tiempo real para usuarios NO registrados y registrados
 *              - Modal de login/registro diferido solo al intentar finalizar compra
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
import MiniCartSidebar from '@/components/cart/MiniCartSidebar';

export default function MarketplacePage() {
  const catalog = useMarketplaceCatalog();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 transition-colors duration-200">
      {/* Header global único (Contiene Logo Marketplace y Carrito Reactivo) */}
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

        {/* Layout Principal de 3 Columnas:
            1. Izquierda (col-span-3): Filtros Estilo Facebook Marketplace
            2. Centro (col-span-6): Grilla de Productos
            3. Derecha (col-span-3): Cesta / Carrito Flotante Estilo AliExpress (Imágenes 2, 3 y 4)
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
          </div>

          {/* Grilla Central: Productos */}
          <div className="lg:col-span-6 space-y-6">
            {catalog.productsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
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
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
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

          {/* Sidebar Derecha: Cesta / Carrito Flotante Estilo AliExpress (Imágenes 2, 3 y 4) */}
          <div className="lg:col-span-3 space-y-6">
            <MiniCartSidebar
              cart={catalog.cart}
              isGuest={catalog.isGuest}
              onUpdateQuantity={catalog.updateCartItem}
              onRemoveItem={catalog.removeFromCart}
              onCheckoutClick={catalog.handleCheckoutClick}
            />
          </div>
        </div>
      </main>

      {/* Footer Global */}
      <Footer />

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

      {/* Modal de Inicio de Sesión / Registro Requerido para Comprar (Flujo de Usuario No Registrado - Imagen 2, 3 y 4) */}
      {catalog.showAuthModal && (
        <Modal
          isOpen={catalog.showAuthModal}
          onClose={() => catalog.setShowAuthModal(false)}
          title="🔒 Registrate o Inicia Sesión para Comprar"
        >
          <div className="space-y-4 pt-2 text-gray-900 dark:text-slate-100">
            <div className="p-4 bg-blue-50 dark:bg-slate-800/80 rounded-2xl border border-blue-100 dark:border-slate-700 text-xs text-blue-900 dark:text-blue-200 font-medium flex items-start gap-2.5">
              <span className="text-xl">🛒</span>
              <p>
                <strong>¡Tus productos te están esperando!</strong> Tienes <strong>{catalog.cart.itemCount} artículo(s)</strong> guardado(s) en tu cesta por <strong>${catalog.cart.total.toLocaleString('es-CL')}</strong>. Inicia sesión o regístrate para seleccionar tu dirección de entrega y vendedor.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => catalog.router.push('/auth')}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-xs transition shadow-sm cursor-pointer text-center"
              >
                🔑 Iniciar Sesión
              </button>
              <button
                type="button"
                onClick={() => catalog.router.push('/auth/register')}
                className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-2xl font-black text-xs transition shadow-sm cursor-pointer text-center"
              >
                ✨ Crear Cuenta Gratis
              </button>
            </div>

            <button
              type="button"
              onClick={() => catalog.setShowAuthModal(false)}
              className="w-full py-2 text-xs font-bold text-gray-400 hover:underline text-center cursor-pointer"
            >
              Seguir explorando el catálogo
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}