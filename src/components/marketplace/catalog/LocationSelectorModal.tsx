/**
 * ============================================================================
 * FILE: LocationSelectorModal.tsx
 * ============================================================================
 * 
 * @description Componente modular para el modal "Cambiar ubicación" al estilo
 *              Facebook Marketplace (Imagen 2 y 3), con mapa cartográfico de
 *              Buenos Aires, pin rojo 📍 centrado, selector de radio en km,
 *              y botón GPS con animación de 3 puntos plomos (...) al ubicar.
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
          setTimeout(() => {
            setCityInput('Buenos Aires, CABA');
            setIsLocatingGPS(false);
          }, 800);
        },
        () => {
          setTimeout(() => {
            setIsLocatingGPS(false);
          }, 800);
        }
      );
    } else {
      setTimeout(() => {
        setIsLocatingGPS(false);
      }, 800);
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
            <span className="text-rose-500 text-base">📍</span>
            <input
              type="text"
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              placeholder="Ej: Buenos Aires, Barracas, Palermo"
              className="w-full text-xs font-black text-gray-900 dark:text-slate-100 bg-transparent focus:outline-none"
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
            className="w-full text-xs font-extrabold text-gray-900 dark:text-slate-100 bg-transparent focus:outline-none cursor-pointer"
          >
            <option value={2}>2 kilómetros</option>
            <option value={6}>6 kilómetros</option>
            <option value={10}>10 kilómetros</option>
            <option value={20}>20 kilómetros</option>
            <option value={50}>50 kilómetros</option>
            <option value={100}>100 kilómetros</option>
          </select>
        </div>

        {/* Mapa Cartográfico Fiel de Buenos Aires (Imágenes 2 y 3) */}
        <div className="relative w-full h-56 rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-800 bg-[#e5e3df] dark:bg-slate-950 flex items-center justify-center shadow-inner select-none">
          {/* Ilustración Vectorial del Mapa Real: Masa Terrestre + Río de la Plata a la Derecha */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 500 240" preserveAspectRatio="none">
            {/* Terreno Gris Claro de Buenos Aires y Conurbano */}
            <rect width="500" height="240" fill="#f4f3f0" />
            
            {/* Río de la Plata (Agua Celeste a la Derecha) */}
            <path d="M 280,0 Q 320,60 360,100 Q 400,160 480,240 L 500,240 L 500,0 Z" fill="#90d4f7" />
            
            {/* Parques Verdes */}
            <path d="M 120,40 Q 150,20 180,50 Q 160,80 120,40 Z" fill="#c8e6c9" opacity="0.7" />
            <path d="M 30,120 Q 60,100 80,140 Q 50,160 30,120 Z" fill="#c8e6c9" opacity="0.7" />

            {/* Red Vial de Calles y Avenidas */}
            <path d="M 0,60 L 320,75" stroke="#ffffff" strokeWidth="4" />
            <path d="M 0,130 L 380,150" stroke="#ffffff" strokeWidth="5" />
            <path d="M 0,190 L 440,210" stroke="#ffffff" strokeWidth="4" />
            <path d="M 100,0 L 120,240" stroke="#ffffff" strokeWidth="4" />
            <path d="M 220,0 L 250,240" stroke="#ffffff" strokeWidth="5" />
            <path d="M 310,0 L 370,240" stroke="#ffffff" strokeWidth="4" />
            
            {/* Líneas secundarias */}
            <line x1="40" y1="0" x2="60" y2="240" stroke="#ffffff" strokeWidth="2" />
            <line x1="180" y1="0" x2="200" y2="240" stroke="#ffffff" strokeWidth="2" />
            <line x1="0" y1="90" x2="350" y2="105" stroke="#ffffff" strokeWidth="2" />
          </svg>

          {/* Círculo Azul Transparente del Radio de Búsqueda Centrado en Buenos Aires */}
          <div 
            className="absolute rounded-full border-2 border-blue-600 bg-blue-500/25 transition-all duration-300 pointer-events-none flex items-center justify-center"
            style={{
              width: `${Math.min(220, Math.max(80, selectedRadius * 14))}px`,
              height: `${Math.min(220, Math.max(80, selectedRadius * 14))}px`,
              top: '50%',
              left: '42%',
              transform: 'translate(-50%, -50%)',
            }}
          />

          {/* Etiquetas de Ciudades Reales de Buenos Aires (Imagen 2 y 3) */}
          <div className="absolute top-[32%] left-[42%] -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
            <span className="text-sm font-black text-slate-900 tracking-tight block drop-shadow-xs">
              Buenos Aires
            </span>
          </div>

          <div className="absolute top-[68%] left-[46%] -translate-x-1/2 text-center pointer-events-none">
            <span className="text-[11px] font-black text-slate-800 tracking-tight block">
              Avellaneda
            </span>
          </div>

          <div className="absolute top-[75%] left-[22%] -translate-x-1/2 text-center pointer-events-none">
            <span className="text-[10px] font-bold text-slate-700 block">
              Villa Madero
            </span>
          </div>

          <div className="absolute top-[82%] left-[36%] -translate-x-1/2 text-center pointer-events-none">
            <span className="text-[10px] font-bold text-slate-700 block">
              Lanús Oeste
            </span>
          </div>

          <div className="absolute top-[78%] left-[62%] text-center pointer-events-none">
            <span className="text-[9px] font-bold text-slate-600 block">Wilde</span>
          </div>

          <div className="absolute top-[85%] left-[72%] text-center pointer-events-none">
            <span className="text-[9px] font-bold text-slate-600 block">Bernal · Quilmes</span>
          </div>

          {/* Marcador Pin Rojo 📍 Fiel Centrado en la Ubicación (Imagen 3 - Gota Roja Centrada) */}
          <div className="absolute top-[50%] left-[42%] -translate-x-1/2 -translate-y-full z-20 pointer-events-none flex flex-col items-center">
            {/* SVG Gota Roja de Ubicación (Facebook Marketplace Pin) */}
            <svg width="28" height="36" viewBox="0 0 24 32" fill="none" className="filter drop-shadow-md animate-bounce">
              <path d="M12 0C5.37 0 0 5.37 0 12C0 21 12 32 12 32C12 32 24 21 24 12C24 5.37 18.63 0 12 0Z" fill="#ea4335" />
              <circle cx="12" cy="12" r="4" fill="#ffffff" />
            </svg>
          </div>

          {/* Botón de Geolocalización GPS 🎯 en la Esquina Superior Derecha (Resaltado en amarillo en Imagen 2) */}
          <button
            type="button"
            onClick={handleGPSClick}
            disabled={isLocatingGPS}
            className="absolute top-3 right-3 py-1.5 px-3 rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 shadow-md flex items-center justify-center gap-1.5 hover:bg-gray-50 transition border border-gray-200 dark:border-slate-700 cursor-pointer"
            title="Usar mi ubicación GPS actual"
          >
            {isLocatingGPS ? (
              /* Tres Puntos Plomos (...) mientras busca la ubicación como solicitaste */
              <div className="flex items-center gap-1 px-1 py-0.5">
                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-pulse" />
                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-pulse [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-pulse [animation-delay:0.4s]" />
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <span className="text-xs">▲</span>
              </div>
            )}
          </button>

          {/* Icono Info ⓘ Esquina Inferior Derecha */}
          <span className="absolute bottom-2 right-2 text-[11px] text-gray-500 font-bold bg-white/70 px-1 rounded-full">ⓘ</span>
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
