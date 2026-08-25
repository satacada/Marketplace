/**
 * ============================================================================
 * FILE: ImageGallery.tsx
 * ============================================================================
 * 
 * @description Componente de galería de imágenes con navegación y lightbox.
 *              Soporta modo thumbnail y modal de visualización ampliada.
 * 
 * @module Presentation/Components/Marketplace
 * 
 * @author System
 * @created 2026-07-16
 * 
 * @dependencies
 * - react
 * 
 * @related-files
 * - @/components/ui/Modal.tsx
 * 
 * @exports
 * - ImageGallery (default)
 * 
 * @example
 * ```tsx
 * <ImageGallery images={imageUrls} thumbnailMode={true} />
 * ```
 * 
 * ============================================================================
 */

'use client';

import { useState } from 'react';

interface ImageGalleryProps {
  images: string[];
  showArrows?: boolean;
  thumbnailMode?: boolean;
}

export default function ImageGallery({ 
  images, 
  showArrows = true, 
  thumbnailMode = false 
}: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const nextImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Si no hay imágenes, mostrar placeholder
  if (!images || images.length === 0) {
    return (
      <div className={`w-full bg-slate-100 dark:bg-slate-800 flex flex-col items-center justify-center text-gray-400 dark:text-slate-500 rounded-xl border border-dashed border-gray-200 dark:border-slate-700 ${thumbnailMode ? 'h-48' : 'h-[350px]'}`}>
        <span className="text-4xl mb-2">🖼️</span>
        <span className="text-sm font-medium">Sin imagen disponible</span>
      </div>
    );
  }

  // MODO THUMBNAIL (Para tarjetas de producto pequeñas)
  if (thumbnailMode) {
    return (
      <div className="relative w-full h-48 bg-slate-100 dark:bg-slate-800 overflow-hidden rounded-t-xl group cursor-pointer" onClick={openModal}>
        <img 
          src={images[currentIndex]} 
          alt={`Imagen ${currentIndex + 1}`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
        />
        {showArrows && images.length > 1 && (
          <>
            <button 
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 text-white p-1 rounded-full hover:bg-black/80 transition opacity-0 group-hover:opacity-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 text-white p-1 rounded-full hover:bg-black/80 transition opacity-0 group-hover:opacity-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>
    );
  }

  // MODO DETALLE (Para la página de detalle de producto)
  return (
    <div className="flex flex-col gap-4">
      {/* Contenedor principal de la foto */}
      <div 
        className="relative w-full h-[360px] sm:h-[420px] bg-slate-50 dark:bg-slate-950 rounded-2xl overflow-hidden flex items-center justify-center border border-gray-200 dark:border-slate-800 group cursor-zoom-in shadow-inner"
        onClick={openModal}
      >
        <img 
          src={images[currentIndex]} 
          alt={`Imagen ${currentIndex + 1}`}
          className="w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-105" 
        />

        {/* Badge para indicar zoom */}
        <div className="absolute top-3 right-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-medium text-gray-700 dark:text-slate-200 shadow-sm opacity-0 group-hover:opacity-100 transition border border-transparent dark:border-slate-700">
          🔍 Haz clic para ampliar
        </div>

        {/* Flechas de navegación principal */}
        {showArrows && images.length > 1 && (
          <>
            <button 
              onClick={prevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-800 text-gray-800 dark:text-slate-100 p-2 rounded-full shadow-md hover:shadow-lg transition transform hover:scale-110 border border-transparent dark:border-slate-700"
              title="Anterior imagen"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              onClick={nextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-800 text-gray-800 dark:text-slate-100 p-2 rounded-full shadow-md hover:shadow-lg transition transform hover:scale-110 border border-transparent dark:border-slate-700"
              title="Siguiente imagen"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Contador de fotos en badge */}
            <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full font-medium">
              {currentIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {/* Tira de miniatura (Thumbnails) para seleccionar imagen */}
      {images.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-thin">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(idx);
              }}
              className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 bg-slate-50 ${
                idx === currentIndex
                  ? 'border-blue-600 shadow-md ring-2 ring-blue-100 scale-105'
                  : 'border-gray-200 opacity-70 hover:opacity-100 hover:border-gray-300'
              }`}
            >
              <img 
                src={img} 
                alt={`Miniatura ${idx + 1}`} 
                className="w-full h-full object-cover" 
              />
            </button>
          ))}
        </div>
      )}

      {/* Modal / Lightbox Pantalla Completa */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div 
            className="relative max-w-5xl w-full max-h-[90vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón cerrar */}
            <button 
              onClick={closeModal}
              className="absolute top-2 right-2 text-white bg-white/20 hover:bg-white/40 p-2.5 rounded-full transition z-10"
              title="Cerrar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Imagen ampliada */}
            <img 
              src={images[currentIndex]} 
              alt={`Imagen ${currentIndex + 1}`}
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
            />

            {/* Flechas en modal */}
            {images.length > 1 && (
              <>
                <button 
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button 
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Contador */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white bg-black/60 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium">
                  {currentIndex + 1} / {images.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}