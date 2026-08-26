/**
 * ============================================================================
 * FILE: LocationSelectorModal.tsx
 * ============================================================================
 * 
 * @description Componente modular para el modal "Cambiar ubicación" al estilo
 *              Facebook Marketplace, reutilizando el mapa OpenStreetMap centralizado,
 *              con marcador nativo del mapa sin superposiciones, círculo transparente de radio
 *              y botón de GPS `▲` posicionado a la izquierda (evitando superposición con el zoom).
 * 
 * @module Presentation/Components/Marketplace/Catalog/LocationSelectorModal
 * ============================================================================
 */

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import OpenStreetMapEmbed from '@/components/ui/OpenStreetMapEmbed';

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
  const [mapCoords, setMapCoords] = useState<{ lat: number; lng: number }>({
    lat: -34.6037,
    lng: -58.3816,
  });

  const handleApply = () => {
    onApplyLocation(cityInput, selectedRadius);
    onClose();
  };

  const handleGPSClick = () => {
    setIsLocatingGPS(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setMapCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
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
            <span className="text-blue-600 text-base">📍</span>
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

        {/* Mapa Real Reutilizado OpenStreetMap con Círculo Azul Transparente y Botón GPS a la Izquierda */}
        <div className="relative w-full h-56 rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-800 shadow-inner">
          <OpenStreetMapEmbed
            lat={mapCoords.lat}
            lng={mapCoords.lng}
            zoomDelta={0.01 + selectedRadius * 0.003}
            height="h-56"
          />

          {/* Círculo Azul Transparente del Radio de Búsqueda Centrado */}
          <div 
            className="absolute rounded-full border-2 border-blue-600 bg-blue-500/20 transition-all duration-300 pointer-events-none flex items-center justify-center"
            style={{
              width: `${Math.min(220, Math.max(80, selectedRadius * 14))}px`,
              height: `${Math.min(220, Math.max(80, selectedRadius * 14))}px`,
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />

          {/* Botón de Geolocalización GPS 🎯 Posicionado a la IZQUIERDA (Evita superposición con el zoom nativo de OpenStreetMap) */}
          <button
            type="button"
            onClick={handleGPSClick}
            disabled={isLocatingGPS}
            className="absolute top-3 left-3 py-1.5 px-3 rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 shadow-md flex items-center justify-center gap-1.5 hover:bg-gray-50 transition border border-gray-200 dark:border-slate-700 cursor-pointer z-30 font-bold text-xs"
            title="Usar mi ubicación GPS actual"
          >
            {isLocatingGPS ? (
              <div className="flex items-center gap-1 px-1 py-0.5">
                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-pulse" />
                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-pulse [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-pulse [animation-delay:0.4s]" />
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <span>▲</span>
                <span>GPS</span>
              </div>
            )}
          </button>
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
