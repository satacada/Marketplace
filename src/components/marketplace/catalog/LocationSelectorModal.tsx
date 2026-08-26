/**
 * ============================================================================
 * FILE: LocationSelectorModal.tsx
 * ============================================================================
 * 
 * @description Componente modular para el modal "Cambiar ubicación" al estilo
 *              Facebook Marketplace (Imagen 1), con campo de ciudad con pin 📍,
 *              selector de radio en kilómetros, vista previa de mapa interactivo
 *              con círculo transparente de radio y botón "Aplicar" (#2563eb).
 * 
 * @module Presentation/Components/Marketplace/Catalog/LocationSelectorModal
 * ============================================================================
 */

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  currentLocation: string;
  currentRadiusKm: number;
  onApplyLocation: (city: string, radiusKm: number) => void;
};

export default function LocationSelectorModal({
  isOpen,
  onClose,
  currentLocation,
  currentRadiusKm,
  onApplyLocation,
}: Props) {
  const [cityInput, setCityInput] = useState(currentLocation || 'Buenos Aires');
  const [selectedRadius, setSelectedRadius] = useState<number>(currentRadiusKm || 6);
  const [isLocatingGPS, setIsLocatingGPS] = useState(false);

  const handleApply = () => {
    onApplyLocation(cityInput, selectedRadius);
    onClose();
  };

  const handleGPSClick = () => {
    setIsLocatingGPS(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setCityInput('Buenos Aires, CABA');
          setIsLocatingGPS(false);
        },
        () => {
          setIsLocatingGPS(false);
        }
      );
    } else {
      setIsLocatingGPS(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Cambiar ubicación">
      <div className="space-y-4 pt-1 text-gray-900 dark:text-slate-100">
        <p className="text-xs text-gray-500 font-medium">
          Buscar por ciudad, localidad o código postal
        </p>

        {/* Input de Ciudad / Ubicación con icono de pin 📍 */}
        <div className="relative border border-gray-300 dark:border-slate-700 rounded-2xl p-3 bg-white dark:bg-slate-900 focus-within:ring-2 focus-within:ring-blue-500 transition">
          <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">
            Ubicación
          </label>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-gray-500 text-base">📍</span>
            <input
              type="text"
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              placeholder="Ej: Buenos Aires, Barracas, Palermo"
              className="w-full text-xs font-bold text-gray-900 dark:text-slate-100 bg-transparent focus:outline-none"
            />
          </div>
        </div>

        {/* Desplegable de Radio en kilómetros */}
        <div className="border border-gray-300 dark:border-slate-700 rounded-2xl p-3 bg-white dark:bg-slate-900">
          <label className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1">
            Radio
          </label>
          <select
            value={selectedRadius}
            onChange={(e) => setSelectedRadius(Number(e.target.value))}
            className="w-full text-xs font-bold text-gray-900 dark:text-slate-100 bg-transparent focus:outline-none cursor-pointer"
          >
            <option value={2}>2 kilómetros</option>
            <option value={6}>6 kilómetros</option>
            <option value={10}>10 kilómetros</option>
            <option value={20}>20 kilómetros</option>
            <option value={50}>50 kilómetros</option>
            <option value={100}>100 kilómetros</option>
          </select>
        </div>

        {/* Mapa Interactivo con Círculo de Radio Azul Transparente y Pin 📍 (Imagen 1) */}
        <div className="relative w-full h-52 rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-800 bg-sky-100 dark:bg-slate-950 flex items-center justify-center shadow-inner">
          {/* Fondo del Mapa Simulado con Calles y Costa */}
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]" />
          
          {/* Círculo Azul Transparente del Radio de Búsqueda */}
          <div 
            className="absolute rounded-full border-2 border-blue-600 bg-blue-500/20 transition-all duration-300 flex items-center justify-center pointer-events-none"
            style={{
              width: `${Math.min(180, Math.max(70, selectedRadius * 12))}px`,
              height: `${Math.min(180, Math.max(70, selectedRadius * 12))}px`,
            }}
          >
            <span className="text-[10px] font-extrabold text-blue-900 dark:text-blue-200 bg-white/80 dark:bg-slate-900/80 px-2 py-0.5 rounded-full shadow-xs">
              {cityInput || 'Buenos Aires'}
            </span>
          </div>

          {/* Marcador Pin Rojo 📍 en el Centro */}
          <div className="relative z-10 flex flex-col items-center -mt-6">
            <span className="text-3xl filter drop-shadow-md animate-bounce">📍</span>
          </div>

          {/* Botón de Geolocalización GPS 🎯 en la Esquina Superior Derecha (Imagen 1) */}
          <button
            type="button"
            onClick={handleGPSClick}
            className="absolute top-3 right-3 w-8 h-8 rounded-xl bg-white dark:bg-slate-900 text-gray-700 dark:text-slate-200 shadow-md flex items-center justify-center hover:bg-gray-50 transition border border-gray-200 dark:border-slate-700 cursor-pointer"
            title="Usar mi ubicación GPS actual"
          >
            <span className="text-xs">{isLocatingGPS ? '⏳' : '🎯'}</span>
          </button>

          {/* Icono Info ⓘ Esquina Inferior Derecha */}
          <span className="absolute bottom-2 right-2 text-[11px] text-gray-400 font-bold">ⓘ</span>
        </div>

        {/* Footer del Modal con Botón Aplicar Azul (#2563eb) */}
        <div className="pt-3 border-t border-gray-100 dark:border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={handleApply}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black transition shadow-xs cursor-pointer"
          >
            Aplicar
          </button>
        </div>
      </div>
    </Modal>
  );
}
