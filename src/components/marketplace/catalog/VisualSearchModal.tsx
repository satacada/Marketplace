/**
 * ============================================================================
 * FILE: VisualSearchModal.tsx
 * ============================================================================
 * 
 * @description Componente modular para el modal de Búsqueda Visual por Foto (IA).
 * 
 * @module Presentation/Components/Marketplace/Catalog/VisualSearchModal
 * ============================================================================
 */

import React from 'react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  visualSearchImage: string | null;
  onImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isProcessing: boolean;
  onConfirmSearch: () => void;
};

export default function VisualSearchModal({
  isOpen,
  onClose,
  visualSearchImage,
  onImageSelect,
  isProcessing,
  onConfirmSearch,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 max-w-lg w-full rounded-3xl p-6 border border-gray-200 dark:border-slate-800 shadow-2xl space-y-4">
        <div className="flex justify-between items-center border-b border-gray-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">📷</span>
            <h3 className="text-lg font-black text-gray-900 dark:text-slate-100">
              Búsqueda Visual por Foto
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 font-bold text-sm"
          >
            ✕
          </button>
        </div>

        <p className="text-xs text-gray-600 dark:text-slate-400 font-medium">
          Sube una foto o captura de un producto (zapatillas, muebles, electrónica) para que la IA escanee nuestro catálogo y encuentre coincidencias visuales.
        </p>

        {visualSearchImage ? (
          <div className="relative aspect-video rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-700">
            <img src={visualSearchImage} alt="Visual query" className="w-full h-full object-cover" />
          </div>
        ) : (
          <label className="border-2 border-dashed border-gray-300 dark:border-slate-700 hover:border-blue-500 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition bg-slate-50 dark:bg-slate-800/40">
            <span className="text-4xl mb-2">📸</span>
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
              Seleccionar foto o captura
            </span>
            <input type="file" accept="image/*" onChange={onImageSelect} className="hidden" />
          </label>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-1/2 py-2.5 rounded-xl font-bold text-xs bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-200 transition"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={!visualSearchImage || isProcessing}
            onClick={onConfirmSearch}
            className="w-1/2 py-2.5 rounded-xl font-extrabold text-xs bg-blue-600 hover:bg-blue-700 text-white transition disabled:opacity-50 shadow-xs flex items-center justify-center gap-1.5"
          >
            <span>{isProcessing ? 'Escaneando...' : 'Buscar Productos'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
