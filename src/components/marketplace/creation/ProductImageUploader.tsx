/**
 * ============================================================================
 * FILE: ProductImageUploader.tsx
 * ============================================================================
 * 
 * @description Componente modular para la carga y previsualización de fotos.
 * 
 * @module Presentation/Components/Marketplace/Creation/ProductImageUploader
 * ============================================================================
 */

import React from 'react';

type Props = {
  imageFiles: File[];
  imagePreviews: string[];
  onImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
};

export default function ProductImageUploader({
  imageFiles,
  imagePreviews,
  onImageSelect,
  onRemoveImage,
}: Props) {
  return (
    <div className="space-y-3 pt-2 border-t border-gray-100 dark:border-slate-800">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-800 dark:text-slate-200">
          Fotos del producto (Hasta 10 fotos) *
        </label>
        <span className="text-[11px] font-bold text-gray-400">{imageFiles.length}/10 fotos</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Dropzone para cargar fotos */}
        <label className="border-2 border-dashed border-gray-300 dark:border-slate-700 hover:border-blue-500 rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition bg-slate-50 dark:bg-slate-800/40 hover:bg-blue-50/50 aspect-square">
          <span className="text-2xl mb-1">📸</span>
          <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400">Agregar fotos</span>
          <span className="text-[10px] text-gray-400 mt-0.5">o arrastra aquí</span>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={onImageSelect}
            className="hidden"
          />
        </label>

        {/* Previsualización de miniaturas subidas */}
        {imagePreviews.map((url, idx) => (
          <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-700 group">
            <img src={url} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => onRemoveImage(idx)}
              className="absolute top-1.5 right-1.5 bg-slate-900/80 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold hover:bg-rose-600 transition cursor-pointer"
              title="Eliminar foto"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
