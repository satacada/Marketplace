/**
 * ============================================================================
 * FILE: AISpecificationCard.tsx
 * ============================================================================
 * 
 * @description Componente modular para la Sección de Atributos e Inteligencia Web por IA.
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
  material: string;
  setMaterial: (val: string) => void;
  condition: string;
  setCondition: (val: string) => void;
  isGeneratingAI: boolean;
  onGenerateAISummary: () => void;
};

export default function AISpecificationCard({
  brand,
  setBrand,
  model,
  setModel,
  material,
  setMaterial,
  condition,
  setCondition,
  isGeneratingAI,
  onGenerateAISummary,
}: Props) {
  return (
    <div className="bg-gradient-to-br from-purple-50/90 via-indigo-50/80 to-blue-50/90 dark:from-slate-800 dark:via-slate-800/90 dark:to-slate-800 p-5 rounded-3xl border border-purple-200/90 dark:border-slate-700 space-y-4">
      <div className="flex items-center justify-between border-b border-purple-200/60 dark:border-slate-700 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-purple-600 dark:text-purple-400 text-xl font-black">✨</span>
          <div>
            <h4 className="text-sm font-extrabold text-gray-900 dark:text-slate-100">
              Asistente de IA & Atributos de Identificación
            </h4>
            <p className="text-[11px] text-gray-600 dark:text-slate-400 font-medium">
              Ingresa la Marca o Modelo para que la IA investigue la Ficha Técnica exacta en la web.
            </p>
          </div>
        </div>
      </div>

      <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-900/60 text-xs text-amber-900 dark:text-amber-200 font-medium flex items-start gap-2">
        <span className="text-base leading-none">💡</span>
        <p>
          <strong>Información por IA:</strong> Al presionar <strong>Generar Ficha Técnica con IA</strong>, el sistema buscará las especificaciones detalladas estilo AliExpress y creará el Resumen de IA en vivo. Tu cuadro de descripción libre se mantiene 100% independiente.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-extrabold text-gray-800 dark:text-slate-200 mb-1">
            Marca / Fabricante *
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
          <label className="block text-[11px] font-extrabold text-gray-800 dark:text-slate-200 mb-1">
            Modelo / Serie *
          </label>
          <input
            type="text"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="Ej: Air Jordan 6 Retro, Civic, Galaxy S24"
            className="w-full p-2.5 text-xs border border-gray-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 font-medium focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-[11px] font-extrabold text-gray-800 dark:text-slate-200 mb-1">
            Material Principal
          </label>
          <input
            type="text"
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            placeholder="Ej: Sintético, Algodón, Cuero, Aluminio"
            className="w-full p-2.5 text-xs border border-gray-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 font-medium focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-[11px] font-extrabold text-gray-800 dark:text-slate-200 mb-1">
            Estado del Producto *
          </label>
          <select
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            className="w-full p-2.5 text-xs border border-gray-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 font-medium focus:ring-2 focus:ring-purple-500"
          >
            <option value="Nuevo">Nuevo</option>
            <option value="Reacondicionado">Reacondicionado</option>
            <option value="Usado - Como Nuevo">Usado - Como Nuevo</option>
            <option value="Usado - Buen Estado">Usado - Buen Estado</option>
          </select>
        </div>
      </div>

      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-purple-200/60 dark:border-slate-700">
        <p className="text-[11px] text-gray-500 dark:text-slate-400 font-medium">
          Presiona para investigar en la web y generar las viñetas técnicas del producto.
        </p>
        <button
          type="button"
          onClick={onGenerateAISummary}
          disabled={isGeneratingAI}
          className="py-2.5 px-5 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl text-xs font-extrabold transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer flex-shrink-0"
        >
          <span>✨</span>
          <span>{isGeneratingAI ? 'Generando por IA...' : 'Generar Ficha Técnica con IA'}</span>
        </button>
      </div>
    </div>
  );
}
