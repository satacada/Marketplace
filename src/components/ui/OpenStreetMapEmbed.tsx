/**
 * ============================================================================
 * FILE: OpenStreetMapEmbed.tsx
 * ============================================================================
 * 
 * @description Componente centralizado y reutilizable para renderizar mapas
 *              interactivos en vivo con OpenStreetMap en toda la plataforma.
 * 
 * @module Presentation/Components/UI/OpenStreetMapEmbed
 * ============================================================================
 */

import React from 'react';

type Props = {
  lat?: number;
  lng?: number;
  zoomDelta?: number;
  height?: string;
  markerColor?: 'red' | 'green' | 'blue';
};

export default function OpenStreetMapEmbed({
  lat = -34.6037,
  lng = -58.3816,
  zoomDelta = 0.015,
  height = 'h-52',
}: Props) {
  const bbox = `${lng - zoomDelta}%2C${lat - zoomDelta}%2C${lng + zoomDelta}%2C${lat + zoomDelta}`;
  const iframeSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`;

  return (
    <div className={`${height} w-full rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-800 relative shadow-inner select-none`}>
      <iframe
        width="100%"
        height="100%"
        frameBorder="0"
        scrolling="no"
        marginHeight={0}
        marginWidth={0}
        src={iframeSrc}
        className="w-full h-full border-0"
        title="Mapa de Ubicación OpenStreetMap"
      />
    </div>
  );
}
