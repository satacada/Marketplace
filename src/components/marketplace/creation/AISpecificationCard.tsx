/**
 * ============================================================================
 * FILE: AISpecificationCard.tsx
 * ============================================================================
 * 
 * @description Componente modular para la Sección de Atributos e Investigación Web por IA.
 *              Contiene únicamente los campos de identificación (Marca y Modelo)
 *              utilizados para la investigación web en tiempo real.
 * 
 * @module Presentation/Components/Marketplace/Creation/AISpecificationCard
 * ============================================================================
 */

import React from 'react';

type Props = {
  brand: string;
  setBrand: (val: string) => void;
  model: string;
  setModel: (val: string) => void;
  isGeneratingAI: boolean;
  onGenerateAISummary: () => void;
};

export default function AISpecificationCard({
  brand,
  setBrand,
  model,
  setModel,
  isGeneratingAI,
  onGenerateAISummary,
}: Props) {
  return (
    <div className="bg-gradient-to-br from-purple-50/90 via-indigo-50/80 to-blue-50/90 dark:from-slate-800 dark:via-slate-800/90 dark:to-slate-800 p-5 rounded-3xl border border-purple-200/90 dark:border-slate-700 space-y-4">
      <div className="flex items-center justify-between border-b border-purple-200/60 dark:border-slate-700 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-purple-600 dark:text-purple-400 text-xl font-black">✨</span>
          <div>
            <h4 className="text-sm font-extrabold text-gray-900 dark:text-slate-100 flex items-center gap-2">
              <span>Asistente de IA & Atributos de Identificación</span>
              <span className="text-[10px] font-black bg-purple-600 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                3 Campos Clave
              </span>
            </h4>
            <p className="text-[11px] text-gray-600 dark:text-slate-400 font-medium">
              La IA investigará especificaciones reales en la web usando solo 3 campos: <strong>1. Título</strong>, <strong>2. Marca</strong> y <strong>3. Modelo</strong>.
            </p>
          </div>
        </div>
      </div>

      <div className="p-3 bg-purple-100/60 dark:bg-purple-950/40 rounded-xl border border-purple-200 dark:border-purple-900/60 text-xs text-purple-900 dark:text-purple-200 font-medium flex items-start gap-2">
        <span className="text-base leading-none">🌐</span>
        <p>
          <strong>Búsqueda Web en Vivo:</strong> Al presionar <strong>Investigar Ficha en la Web con IA</strong>, el sistema consultará internet con tus 3 campos (Título, Marca y Modelo) para extraer datos técnicos reales sin inventar guiones.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-extrabold text-gray-800 dark:text-slate-200 mb-1 flex items-center justify-between">
            <span>Marca / Fabricante *</span>
            <span className="text-[10px] text-purple-600 font-bold">Campo 2 de 3</span>
          </label>
          <input
            type="text"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            placeholder="Ej: Nike, Samsung, Honda"
            className="w-full p-2.5 text-xs border border-gray-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 font-medium focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-[11px] font-extrabold text-gray-800 dark:text-slate-200 mb-1 flex items-center justify-between">
            <span>Modelo / Serie *</span>
            <span className="text-[10px] text-purple-600 font-bold">Campo 3 de 3</span>
          </label>
          <input
            type="text"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="Ej: Air Jordan 6 Retro, Civic, Galaxy S24"
            className="w-full p-2.5 text-xs border border-gray-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 font-medium focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={onGenerateAISummary}
        disabled={isGeneratingAI}
        className="w-full py-3 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-2xl text-xs font-black transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 cursor-pointer"
      >
        <span>🌐</span>
        <span>
          {isGeneratingAI
            ? 'Investigando especificaciones reales en la web...'
            : 'Investigar Ficha en la Web con IA (3 Campos Clave)'}
        </span>
      </button>
    </div>
  );
}
