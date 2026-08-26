/**
 * ============================================================================
 * FILE: OpenStreetMapEmbed.tsx
 * ============================================================================
 * 
 * @description Componente centralizado y reutilizable para renderizar mapas
 *              OpenStreetMap en vivo sin necesidad de API Key, sin marcas de agua,
 *              y con filtro CSS suave estilo Google Maps para eliminar la saturación visual.
 * 
 * @module Presentation/Components/UI/OpenStreetMapEmbed
 * ============================================================================
 */

import React from 'react';

type Props = {
  lat?: number;
  lng?: number;
  zoom?: number;
  height?: string;
  markerColor?: 'red' | 'green' | 'blue';
};

export default function OpenStreetMapEmbed({
  lat = -34.6037,
  lng = -58.3816,
  zoom = 13,
  height = 'h-56',
  markerColor = 'red',
}: Props) {
  const pinColor = markerColor === 'red' ? '#ea4335' : markerColor === 'blue' ? '#2563eb' : '#22c55e';

  // HTML embebido usando el servidor oficial 100% libre de OpenStreetMap (0 API Key, 0 Marcas de agua)
  // con des-saturación por CSS para lograr el aspecto limpio estilo Google Maps.
  const mapHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
          html, body, #map {
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
            background-color: #f8fafc;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          }
          /* Filtro suave des-saturador para que el mapa oficial se vea limpio como Google Maps */
          .leaflet-tile-pane {
            filter: contrast(92%) brightness(104%) saturate(75%);
          }
          .leaflet-control-attribution {
            font-size: 9px !important;
            background: rgba(255, 255, 255, 0.75) !important;
            padding: 2px 6px !important;
          }
          .custom-pin {
            display: flex;
            align-items: center;
            justify-content: center;
          }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          document.addEventListener("DOMContentLoaded", function() {
            var map = L.map('map', {
              zoomControl: true,
              attributionControl: true
            }).setView([${lat}, ${lng}], ${zoom});

            // Servidor Oficial Libre de OpenStreetMap (0 API Key / 0 Marcas de agua)
            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
              maxZoom: 19,
              attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(map);

            // Icono Pin Limpio Centrado
            var customIcon = L.divIcon({
              className: 'custom-pin',
              html: \`<svg width="28" height="36" viewBox="0 0 24 32" fill="none">
                       <path d="M12 0C5.37 0 0 5.37 0 12C0 21 12 32 12 32C12 32 24 21 24 12C24 5.37 18.63 0 12 0Z" fill="${pinColor}" />
                       <circle cx="12" cy="12" r="4.5" fill="#ffffff" />
                     </svg>\`,
              iconSize: [28, 36],
              iconAnchor: [14, 36]
            });

            L.marker([${lat}, ${lng}], { icon: customIcon }).addTo(map);
          });
        </script>
      </body>
    </html>
  `;

  return (
    <div className={`${height} w-full rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-800 relative shadow-inner select-none bg-slate-50 dark:bg-slate-900`}>
      <iframe
        srcDoc={mapHtml}
        width="100%"
        height="100%"
        frameBorder="0"
        scrolling="no"
        className="w-full h-full border-0"
        title="Mapa de Ubicación OpenStreetMap Oficial Limpio"
      />
    </div>
  );
}
