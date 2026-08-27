/**
 * ============================================================================
 * FILE: ProductLocationModal.tsx
 * ============================================================================
 * 
 * @description Componente modular para el modal popup "Ubicación de la publicación"
 *              estilo Facebook Marketplace (Imagen cargada por el usuario).
 *              Permite navegación interactiva del mapa sin alterar los datos del producto.
 * 
 * @module Presentation/Components/Marketplace/Detail/ProductLocationModal
 * ============================================================================
 */

import React from 'react';
import { Modal } from '@/components/ui/Modal';
import OpenStreetMapEmbed from '@/components/ui/OpenStreetMapEmbed';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  locationName: string;
};

export default function ProductLocationModal({
  isOpen,
  onClose,
  locationName,
}: Props) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Ubicación de la publicación">
      <div className="space-y-4 pt-1 text-gray-900 dark:text-slate-100">
        <div className="relative w-full h-80 rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-800 shadow-inner">
          <OpenStreetMapEmbed
            lat={-34.6037}
            lng={-58.3816}
            zoom={13}
            height="h-80"
            markerColor="red"
            interactive={true}
          />

          {/* Círculo Azul Transparente del Radio Aproximado Centrado */}
          <div 
            className="absolute rounded-full border-2 border-blue-600 bg-blue-500/20 transition-all duration-300 pointer-events-none flex items-center justify-center"
            style={{
              width: '140px',
              height: '140px',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
        </div>

        <p className="text-xs font-bold text-gray-600 dark:text-slate-300 bg-gray-50 dark:bg-slate-800 p-3 rounded-xl border border-gray-100 dark:border-slate-700">
          📍 <strong>{locationName || 'Ciudad de Buenos Aires, CABA'}</strong> · <span className="font-semibold text-gray-500">La ubicación es aproximada</span>
        </p>
      </div>
    </Modal>
  );
}
