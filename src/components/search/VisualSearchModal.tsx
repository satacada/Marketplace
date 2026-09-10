/**
 * ============================================================================
 * FILE: VisualSearchModal.tsx
 * ============================================================================
 * 
 * @description Modal interactivo de Búsqueda Visual por Imagen con simulación
 *              de escaneo inteligente por IA e identificación de coincidencia de productos.
 * 
 * @module Presentation/Components/Search/VisualSearchModal
 * ============================================================================
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { Modal } from '@/components/ui/Modal';
import AppIcon from '@/components/ui/icons/AppIcon';
import { useVisualSearch } from '@/features/search/hooks/useVisualSearch';

interface VisualSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VisualSearchModal({ isOpen, onClose }: VisualSearchModalProps) {
  const { selectedImage, handleImageUpload, isScanning, matches } = useVisualSearch();

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleImageUpload(e.target.files[0]);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="📷 Búsqueda Visual con IA">
      <div className="space-y-4 pt-1 text-gray-900 dark:text-slate-100">
        {!selectedImage ? (
          <label className="border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-3xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition text-center space-y-2">
            <AppIcon name="camera" className="w-10 h-10 text-blue-600 dark:text-blue-400 mb-1" />
            <span className="text-xs font-black">Sube una foto o arrastra una imagen aquí</span>
            <span className="text-[11px] text-gray-400 font-medium">Formatos soportados: JPG, PNG, WEBP</span>
            <input type="file" accept="image/*" onChange={onFileSelect} className="hidden" />
          </label>
        ) : (
          <div className="space-y-4">
            <div className="relative w-full h-44 rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-800 bg-black flex items-center justify-center">
              <img src={selectedImage} alt="Imagen subida" className="h-full object-contain" />
              {isScanning && (
                <div className="absolute inset-0 bg-blue-600/20 backdrop-blur-2xs flex flex-col items-center justify-center space-y-2">
                  <div className="w-12 h-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
                  <span className="text-xs font-black text-white bg-slate-900/80 px-3 py-1 rounded-full">
                    Escaneando patrones con IA...
                  </span>
                </div>
              )}
            </div>

            {!isScanning && matches.length > 0 && (
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-black text-gray-900 dark:text-slate-100 flex items-center gap-1">
                  <span>Productos Coincidentes ({matches.length})</span>
                </h4>

                <div className="grid grid-cols-2 gap-3">
                  {matches.map((item) => (
                    <Link
                      key={item.id}
                      href={`/marketplace/product/${item.id}`}
                      onClick={onClose}
                      className="p-2.5 rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/40 hover:bg-blue-50/30 transition group"
                    >
                      <img src={item.imageUrl} alt={item.title} className="w-full h-24 object-cover rounded-xl mb-2" />
                      <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full inline-block mb-1">
                        {item.matchPercentage}% coincidencia
                      </span>
                      <h5 className="text-xs font-bold truncate group-hover:text-blue-600 transition">{item.title}</h5>
                      <p className="text-xs font-black text-blue-600 dark:text-blue-400 mt-0.5">
                        ${item.price.toLocaleString('es-AR')}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
