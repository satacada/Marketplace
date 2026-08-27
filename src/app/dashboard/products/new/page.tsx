/**
 * ============================================================================
 * FILE: page.tsx (dashboard/products/new)
 * ============================================================================
 * 
 * @description Asistente de Creación de Publicaciones estilo Facebook Marketplace.
 *              Refactorizado bajo Clean Architecture y SOLID:
 *              - Lógica de negocio encapsulada en Custom Hook `useProductForm`
 *              - Componentes UI descompuestos y modulares
 * 
 * @module Presentation/Pages/Dashboard/Products/New
 * ============================================================================
 */

'use client';

import React from 'react';
import Link from 'next/link';
import ProductLivePreview from '@/components/marketplace/ProductLivePreview';
import { Modal } from '@/components/ui/Modal';
import { useProductForm } from '@/features/products/hooks/useProductForm';
import PublicationTypeStep from '@/components/marketplace/creation/PublicationTypeStep';
import ProductImageUploader from '@/components/marketplace/creation/ProductImageUploader';
import AISpecificationCard from '@/components/marketplace/creation/AISpecificationCard';
import ProductLocationSection from '@/components/marketplace/creation/ProductLocationSection';

export default function NewProductPage() {
  const form = useProductForm();

  // Paso 0: Selección de Tipo de Publicación
  if (form.publicationType === 'none') {
    return (
      <PublicationTypeStep
        categories={form.categories}
        onSelectType={form.setPublicationType}
        onSetCategoryId={form.setCategoryId}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 p-4 sm:p-8 text-gray-900 dark:text-slate-100 transition-colors duration-200">
      {/* Modal de Feedback Informativo */}
      <Modal
        isOpen={form.showModal}
        onClose={() => {
          form.setShowModal(false);
          if (form.modalData.shouldRedirect) {
            form.router.push('/dashboard/products');
          }
        }}
        title={form.modalData.title}
      >
        <p className="text-sm text-gray-600 dark:text-slate-300 font-medium whitespace-pre-line leading-relaxed">
          {form.modalData.message}
        </p>
      </Modal>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Cabecera y migas de pan */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-200/90 dark:border-slate-800 shadow-2xs">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <button
                type="button"
                onClick={() => form.setPublicationType('none')}
                className="text-xs font-extrabold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                ← Cambiar tipo
              </button>
              <span className="text-gray-300 dark:text-slate-700">|</span>
              <span className="text-xs font-bold text-gray-500 capitalize">
                {form.publicationType === 'article' && '📦 Artículo en venta'}
                {form.publicationType === 'vehicle' && '🚗 Vehículo en venta'}
                {form.publicationType === 'property' && '🏠 Propiedad'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-slate-100">
              Crear Publicación
            </h1>
          </div>

          <Link
            href="/dashboard/products"
            className="text-xs font-bold px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800 transition"
          >
            Cancelar y Volver
          </Link>
        </div>

        {/* Layout Dividido a 2 Columnas (Formulario + Live Preview) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Columna Izquierda: Formulario (lg:col-span-7) */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-gray-200/90 dark:border-slate-800 shadow-2xs space-y-6">
            <form onSubmit={form.handleAddProduct} className="space-y-6">
              {/* Sección 1: Carga de Fotos */}
              <ProductImageUploader
                imageFiles={form.imageFiles}
                imagePreviews={form.imagePreviews}
                onImageSelect={form.handleImageSelect}
                onRemoveImage={form.handleRemoveImage}
              />

              {/* Sección 2: Título de la Publicación */}
              <div className="space-y-1">
                <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-800 dark:text-slate-200">
                  Título de la publicación *
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => form.setTitle(e.target.value)}
                  placeholder="Ej: Zapatillas Nike Air Jordan 6 Retro Talle 42"
                  className="w-full p-3 text-xs border border-gray-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 font-medium focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Sección 3: Asistente de IA & Atributos de Identificación */}
              <AISpecificationCard
                brand={form.brand}
                setBrand={form.setBrand}
                model={form.model}
                setModel={form.setModel}
                isGeneratingAI={form.isGeneratingAI}
                onGenerateAISummary={form.handleGenerateAISummary}
              />

              {/* Sección 4: Descripción Libre del Vendedor */}
              <div className="space-y-1">
                <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-800 dark:text-slate-200">
                  Descripción del Vendedor (Texto Libre)
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => form.setDescription(e.target.value)}
                  placeholder="Describe detalles de entrega, uso o estado de tu producto..."
                  rows={4}
                  className="w-full p-3 text-xs border border-gray-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 font-medium focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Sección 5: Categoría (Auto-detectada en vivo o selección manual) */}
              <div className="space-y-1">
                <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-800 dark:text-slate-200">
                  Categoría del producto *
                </label>
                <select
                  value={form.categoryId}
                  onChange={(e) => form.setCategoryId(e.target.value)}
                  className="w-full p-3 text-xs border border-gray-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 font-medium focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">-- Seleccionar Categoría --</option>
                  {form.categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sección 6: Precio, Stock y Campos Adaptativos */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-800 dark:text-slate-200 mb-1">
                    Precio ({form.currencySymbol}) *
                  </label>
                  <input
                    type="text"
                    value={form.price}
                    onChange={form.handlePriceChange}
                    placeholder="0"
                    className="w-full p-3 text-xs border border-gray-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 font-bold focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-800 dark:text-slate-200 mb-1">
                    Stock Disponible *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={form.stock}
                    onChange={(e) => form.setStock(e.target.value)}
                    className="w-full p-3 text-xs border border-gray-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 font-bold focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Atributos Específicos Reubicados: Material y Estado del Producto */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-800 dark:text-slate-200 mb-1">
                    Material Principal (Opcional)
                  </label>
                  <input
                    type="text"
                    value={form.material}
                    onChange={(e) => form.setMaterial(e.target.value)}
                    placeholder="Ej: Sintético, Algodón, Cuero, Aluminio"
                    className="w-full p-3 text-xs border border-gray-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 font-medium focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-800 dark:text-slate-200 mb-1">
                    Estado del Producto *
                  </label>
                  <select
                    value={form.condition}
                    onChange={(e) => form.setCondition(e.target.value)}
                    className="w-full p-3 text-xs border border-gray-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 font-medium focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Nuevo">Nuevo</option>
                    <option value="Usado - Como nuevo">Usado - Como nuevo</option>
                    <option value="Usado - Buen estado">Usado - Buen estado</option>
                    <option value="Usado - Aceptable">Usado - Aceptable</option>
                  </select>
                </div>
              </div>

              {/* Sección 7: Ubicación con Mapa OpenStreetMap & GPS */}
              <ProductLocationSection
                locationName={form.locationName}
                onLocationInputChange={form.handleLocationInputChange}
                locationSuggestions={form.locationSuggestions}
                showSuggestions={form.showSuggestions}
                onSelectSuggestion={(sug) => {
                  form.setLocationName(sug.label);
                  form.setMapCoords({ lat: sug.lat, lng: sug.lng, key: Date.now() });
                  form.setShowSuggestions(false);
                }}
                mapCoords={form.mapCoords}
                isDetectingGPS={form.isDetectingGPS}
                onAutoDetectGPS={() => form.autoDetectGPS(false)}
              />

              {/* Botón Principal de Publicación */}
              <button
                type="submit"
                disabled={form.uploading}
                className="w-full py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-black text-sm transition-all duration-200 shadow-md hover:shadow-xl active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>🚀</span>
                <span>{form.uploading ? 'Publicando tu producto...' : 'Publicar Producto Ahora'}</span>
              </button>
            </form>
          </div>

          {/* Columna Derecha: Vista Previa en Tiempo Real (lg:col-span-5) */}
          <div className="lg:col-span-5 sticky top-8 space-y-4">
            <div className="flex items-center justify-between px-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-gray-500 dark:text-slate-400">
                👁️ Vista Previa en Vivo (Live Preview)
              </span>
              <span className="text-[10px] font-bold bg-blue-50 dark:bg-blue-950 text-blue-600 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
                Vista de Comprador
              </span>
            </div>

            <ProductLivePreview
              title={form.title}
              price={form.price}
              currencySymbol={form.currencySymbol}
              locationName={form.locationName}
              sellerName={form.userStoreName}
              publicationType={form.publicationType}
              description={form.description}
              imageUrls={form.imagePreviews}
              brand={form.brand}
              model={form.model}
              material={form.material}
              condition={form.condition}
              aiSummaryBullets={form.aiSummaryBullets}
            />
          </div>
        </div>
      </div>
    </div>
  );
}