/**
 * ============================================================================
 * FILE: ProductLocationSection.tsx
 * ============================================================================
 * 
 * @description Componente modular para la ubicación con OpenStreetMap y GPS.
 * 
 * @module Presentation/Components/Marketplace/Creation/ProductLocationSection
 * ============================================================================
 */

import React from 'react';

type Props = {
  locationName: string;
  onLocationInputChange: (val: string) => void;
  locationSuggestions: { label: string; lat: number; lng: number }[];
  showSuggestions: boolean;
  onSelectSuggestion: (s: { label: string; lat: number; lng: number }) => void;
  mapCoords: { lat: number; lng: number; key: number } | null;
  isDetectingGPS: boolean;
  onAutoDetectGPS: () => void;
};

export default function ProductLocationSection({
  locationName,
  onLocationInputChange,
  locationSuggestions,
  showSuggestions,
  onSelectSuggestion,
  mapCoords,
  isDetectingGPS,
  onAutoDetectGPS,
}: Props) {
  return (
    <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-slate-800">
      <div className="flex justify-between items-center">
        <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-800 dark:text-slate-200">
          Ubicación de la publicación *
        </label>
        <button
          type="button"
          onClick={onAutoDetectGPS}
          disabled={isDetectingGPS}
          className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-1.5 bg-blue-50 dark:bg-blue-950/60 px-3 py-1.5 rounded-full border border-blue-100 dark:border-blue-900 transition cursor-pointer"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          <span>{isDetectingGPS ? 'Detectando GPS...' : '📍 Centrar con mi GPS actual'}</span>
        </button>
      </div>

      {/* Autocomplete de Ubicación */}
      <div className="relative">
        <input
          type="text"
          value={locationName}
          onChange={(e) => onLocationInputChange(e.target.value)}
          placeholder="Ej: Barracas, Buenos Aires (formato: Localidad, Provincia/Ciudad)"
          className="w-full p-3 text-xs border border-gray-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 font-medium focus:ring-2 focus:ring-blue-500"
        />

        {showSuggestions && locationSuggestions.length > 0 && (
          <div className="absolute z-50 left-0 right-0 top-full mt-1 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-xl overflow-hidden max-h-48 overflow-y-auto">
            {locationSuggestions.map((sug, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectSuggestion(sug)}
                className="w-full text-left px-4 py-2.5 text-xs text-gray-800 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 flex items-center gap-2 border-b border-gray-100 dark:border-slate-800/50 last:border-0 transition"
              >
                <span>📍</span>
                <span className="font-bold">{sug.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <p className="text-[11px] text-gray-500 dark:text-slate-400 font-medium">
        💡 <strong>Ejemplo recomendado:</strong> "Barracas, Buenos Aires" o "Plaza Colombia, Barracas". Al tipear o presionar el botón de GPS, el mapa centrará la ubicación con un marcador azul en vivo.
      </p>

      {/* Mapa interactivo OpenStreetMap */}
      <div className="h-44 sm:h-52 w-full rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-700 relative shadow-inner">
        <iframe
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          marginHeight={0}
          marginWidth={0}
          src={mapCoords ? `https://www.openstreetmap.org/export/embed.html?bbox=${mapCoords.lng - 0.015}%2C${mapCoords.lat - 0.015}%2C${mapCoords.lng + 0.015}%2C${mapCoords.lat + 0.015}&layer=mapnik&marker=${mapCoords.lat}%2C${mapCoords.lng}` : `https://www.openstreetmap.org/export/embed.html?bbox=-58.39%2C-34.65%2C-58.36%2C-34.63&layer=mapnik&marker=-34.64%2C-58.37`}
          className="w-full h-full border-0"
          title="Mapa de Ubicación del Producto"
        />
      </div>
    </div>
  );
}
