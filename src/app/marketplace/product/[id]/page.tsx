/**
 * ============================================================================
 * FILE: page.tsx (app/marketplace/product/[id])
 * ============================================================================
 * 
 * @description Vista Detallada de Producto al estilo Amazon / AliExpress / Facebook.
 *              Refactorizado bajo Clean Architecture, SOLID y SRP:
 *              - Lógica de negocio y carga de datos en `useProductDetail`
 *              - Galería y Ficha Técnica de IA desacoplados en `ProductGalleryColumn`
 *              - Sidebar del Vendedor y Compras desacoplado en `ProductSellerSidebar`
 *              - Pestañas AliExpress en `ProductAliExpressTabs`
 *              - Combo "Este producto se compra frecuentemente con este otro" en `FrequentlyBoughtTogether`
 *              - Sugerencias para el vendedor en `AISellerSuggestionsBox`
 *              - Productos Relacionados en `RelatedProductsSection`
 * 
 * @module Presentation/Pages/Marketplace/ProductDetail
 * ============================================================================
 */

'use client';

import React, { use } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ShareModal from '@/components/marketplace/ShareModal';
import ReportModal from '@/components/marketplace/ReportModal';
import { Modal } from '@/components/ui/Modal';
import { useProductDetail } from '@/features/products/hooks/useProductDetail';
import ProductGalleryColumn from '@/components/marketplace/detail/ProductGalleryColumn';
import ProductSellerSidebar from '@/components/marketplace/detail/ProductSellerSidebar';
import ProductQuestionsSection from '@/components/marketplace/detail/ProductQuestionsSection';
import ProductAliExpressTabs from '@/components/marketplace/detail/ProductAliExpressTabs';
import FrequentlyBoughtTogether from '@/components/marketplace/detail/FrequentlyBoughtTogether';
import AISellerSuggestionsBox from '@/components/marketplace/detail/AISellerSuggestionsBox';
import RelatedProductsSection from '@/components/marketplace/detail/RelatedProductsSection';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;

  const detail = useProductDetail(productId);

  if (detail.loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 p-8 flex items-center justify-center">
        <p className="text-gray-500 font-bold text-sm">Cargando detalles del producto...</p>
      </div>
    );
  }

  if (!detail.product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 p-8 flex flex-col items-center justify-center space-y-4">
        <p className="text-xl font-bold text-gray-700 dark:text-slate-300">Producto no encontrado</p>
        <Link href="/marketplace" className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-xs">
          Volver al Marketplace
        </Link>
      </div>
    );
  }

  const isOwnProduct = !!detail.userId && detail.product.seller_id === detail.userId;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 transition-colors duration-200">
      {/* Header global */}
      <div className="p-4 sm:p-6 max-w-7xl mx-auto pb-0">
        <Header title={detail.product.title} />
      </div>

      {/* Modal Informativo UI */}
      <Modal
        isOpen={detail.showModal}
        onClose={() => detail.setShowModal(false)}
        title={detail.modalData.title}
      >
        <p className="text-sm text-gray-600 dark:text-slate-300 font-medium whitespace-pre-line leading-relaxed">
          {detail.modalData.message}
        </p>
      </Modal>

      <main className="max-w-7xl mx-auto p-4 sm:p-6 space-y-8">
        {/* Migas de pan / Navegación */}
        <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
          <Link href="/marketplace" className="hover:text-blue-600 transition">Marketplace</Link>
          <span>›</span>
          <span className="text-gray-400">{detail.product.categories?.name || 'Producto'}</span>
          <span>›</span>
          <span className="text-gray-800 dark:text-slate-200 truncate max-w-xs">{detail.product.title}</span>
        </div>

        {/* Layout Principal a 2 Columnas (Galería + IA a la izq / Vendedor a la der) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Columna Izquierda: Galería de Fotos + Resumen de IA */}
          <div className="lg:col-span-7 space-y-6">
            <ProductGalleryColumn
              title={detail.product.title}
              imageUrls={detail.product.image_urls || []}
              aiSummary={detail.aiSummary}
            />

            {/* Sugerencias de IA para mejorar la publicación (Orientado al Vendedor - Imagen 3) */}
            <AISellerSuggestionsBox isOwnProduct={isOwnProduct} />

            {/* Combo "Este producto se compra frecuentemente con este otro" (Imagen 3) */}
            <FrequentlyBoughtTogether
              mainProductTitle={detail.product.title}
              mainProductPrice={detail.product.price}
            />
          </div>

          {/* Columna Derecha: Datos del Vendedor, Ubicación Mapa y Chat (lg:col-span-5) */}
          <div className="lg:col-span-5">
            <ProductSellerSidebar
              product={detail.product}
              isFavorite={detail.isFavorite}
              onToggleFavorite={detail.handleToggleFavorite}
              isCartAdded={detail.isCartAdded}
              onAddToCart={() => detail.handleAddToCart(detail.product!.id, {
                title: detail.product!.title,
                price: detail.product!.price,
                image_url: detail.product!.image_urls?.[0] || null,
                seller_id: detail.product!.seller_id,
              })}
              onShare={() => detail.setShowShareModal(true)}
              onReport={(type, title) => detail.setReportTarget({ type, title })}
              userId={detail.userId}
            />
          </div>
        </div>

        {/* Pestañas Estilo AliExpress (Valoraciones, Detalles, Descripción, Tienda - Imagen 3) */}
        <ProductAliExpressTabs
          productTitle={detail.product.title}
          description={detail.product.description}
        />

        {/* Sección de Preguntas y Respuestas al Vendedor */}
        <ProductQuestionsSection
          questions={detail.questions}
          newQuestion={detail.newQuestion}
          onNewQuestionChange={detail.setNewQuestion}
          onSubmitQuestion={detail.handlePostQuestion}
          submitting={detail.submitting}
          isOwnProduct={isOwnProduct}
        />

        {/* Productos Relacionados / Te podría interesar (Imagen 3) */}
        <RelatedProductsSection
          products={detail.similarSellers || []}
        />
      </main>

      {/* Footer Global */}
      <Footer />

      {/* Modal de Compartir en Redes Sociales */}
      {detail.showShareModal && (
        <ShareModal
          isOpen={detail.showShareModal}
          onClose={() => detail.setShowShareModal(false)}
          product={{
            id: detail.product.id,
            title: detail.product.title,
            price: detail.product.price,
            image_url: detail.product.image_urls?.[0] || null,
          }}
        />
      )}

      {/* Modal de Reporte */}
      {detail.reportTarget && (
        <ReportModal
          isOpen={!!detail.reportTarget}
          onClose={() => detail.setReportTarget(null)}
          targetType={detail.reportTarget.type}
          targetTitle={detail.reportTarget.title}
          onSubmitReport={detail.handleReportSubmit}
        />
      )}
    </div>
  );
}