/**
 * ============================================================================
 * FILE: useEscrowProtection.ts
 * ============================================================================
 * 
 * @description Custom Hook para gestionar el estado del modal de Garantía Escrow,
 *              detalles de protección al comprador y estado del timeline de dinero.
 * 
 * @module Features/Trust/Hooks
 * ============================================================================
 */

import { useState } from 'react';

export interface EscrowStep {
  step: number;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'upcoming';
}

export function useEscrowProtection() {
  const [isEscrowModalOpen, setIsEscrowModalOpen] = useState(false);

  const openEscrowModal = () => setIsEscrowModalOpen(true);
  const closeEscrowModal = () => setIsEscrowModalOpen(false);

  const escrowTimeline: EscrowStep[] = [
    {
      step: 1,
      title: 'Pago Retenido en Garantía',
      description: 'El dinero pagado queda resguardado en la cuenta de custodia segura SaaS.',
      status: 'completed',
    },
    {
      step: 2,
      title: 'Envío & Verificación en Camino',
      description: 'El vendedor despacha el producto con código de seguimiento en tiempo real.',
      status: 'current',
    },
    {
      step: 3,
      title: 'Recepción & Conformidad del Cliente',
      description: 'Verificas que el producto coincide exactamente con la descripción original.',
      status: 'upcoming',
    },
    {
      step: 4,
      title: 'Liberación de Fondos al Vendedor',
      description: 'Una vez confirmada tu satisfacción (o 7 días hábiles), se abonan los fondos.',
      status: 'upcoming',
    },
  ];

  return {
    isEscrowModalOpen,
    openEscrowModal,
    closeEscrowModal,
    escrowTimeline,
  };
}
