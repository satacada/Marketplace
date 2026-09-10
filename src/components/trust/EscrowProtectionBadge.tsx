/**
 * ============================================================================
 * FILE: EscrowProtectionBadge.tsx
 * ============================================================================
 * 
 * @description Componente de insignia e información interactiva de Garantía Escrow
 *              con modal de línea de tiempo de protección del dinero.
 * 
 * @module Presentation/Components/Trust/EscrowProtectionBadge
 * ============================================================================
 */

'use client';

import React from 'react';
import AppIcon from '@/components/ui/icons/AppIcon';
import { Modal } from '@/components/ui/Modal';
import { useEscrowProtection } from '@/features/trust/hooks/useEscrowProtection';

interface Props {
  variant?: 'compact' | 'full';
}

export default function EscrowProtectionBadge({ variant = 'full' }: Props) {
  const { isEscrowModalOpen, openEscrowModal, closeEscrowModal, escrowTimeline } = useEscrowProtection();

  if (variant === 'compact') {
    return (
      <>
        <button
          type="button"
          onClick={openEscrowModal}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 hover:bg-emerald-100 transition cursor-pointer"
        >
          <AppIcon name="shield" className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Compra Protegida Escrow</span>
        </button>

        <Modal isOpen={isEscrowModalOpen} onClose={closeEscrowModal} title="🛡️ Sistema de Garantía Escrow SaaS">
          <EscrowTimelineModalContent timeline={escrowTimeline} />
        </Modal>
      </>
    );
  }

  return (
    <>
      <div 
        onClick={openEscrowModal}
        className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/30 border border-emerald-200/80 dark:border-emerald-900/60 cursor-pointer hover:shadow-sm transition group"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs">
              <AppIcon name="shield" className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="text-xs font-black text-emerald-950 dark:text-emerald-200 group-hover:text-emerald-600 transition flex items-center gap-1">
                <span>Garantía de Compra Protegida SaaS</span>
                <AppIcon name="arrow-right" className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              </h4>
              <p className="text-[11px] font-semibold text-emerald-800/80 dark:text-emerald-400/90">
                Tu dinero resguardado hasta que recibas y confirmes el producto.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={isEscrowModalOpen} onClose={closeEscrowModal} title="🛡️ Sistema de Garantía Escrow SaaS">
        <EscrowTimelineModalContent timeline={escrowTimeline} />
      </Modal>
    </>
  );
}

function EscrowTimelineModalContent({ timeline }: { timeline: ReturnType<typeof useEscrowProtection>['escrowTimeline'] }) {
  return (
    <div className="space-y-4">
      <p className="text-xs text-gray-600 dark:text-slate-300 font-medium">
        Tu pago no se transfiere al vendedor de forma inmediata. Se mantiene bajo custodia en una cuenta escrow segura hasta que verifiques la conformidad del envío.
      </p>

      <div className="space-y-3 pt-2">
        {timeline.map((item) => (
          <div key={item.step} className="flex gap-3 items-start">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs shrink-0 ${
              item.status === 'completed' 
                ? 'bg-emerald-600 text-white' 
                : item.status === 'current'
                ? 'bg-blue-600 text-white ring-4 ring-blue-100 dark:ring-blue-950'
                : 'bg-gray-200 dark:bg-slate-800 text-gray-500'
            }`}>
              {item.step}
            </div>
            <div>
              <h5 className="text-xs font-black text-gray-900 dark:text-slate-100">{item.title}</h5>
              <p className="text-[11px] text-gray-500 dark:text-slate-400 font-medium">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
