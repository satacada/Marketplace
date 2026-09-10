/**
 * ============================================================================
 * FILE: PostponedRegisterModal.tsx
 * ============================================================================
 * 
 * @description Modal de Registro Pospuesto 1-Click poscompra.
 *              Permite al usuario conservar su historial de compra vinculando su email
 *              en un solo paso tras finalizar la compra como invitado.
 * 
 * @module Presentation/Components/Cart/PostponedRegisterModal
 * ============================================================================
 */

'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import AppIcon from '@/components/ui/icons/AppIcon';

interface PostponedRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderTotal?: number;
}

export default function PostponedRegisterModal({
  isOpen,
  onClose,
  orderTotal = 0,
}: PostponedRegisterModalProps) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="🎉 ¡Compra Confirmada con Éxito!">
      <div className="space-y-4 pt-1 text-gray-900 dark:text-slate-100">
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">
            <AppIcon name="check-circle" className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="text-xs font-black text-emerald-950 dark:text-emerald-200">
              Pago de ${orderTotal.toLocaleString('es-AR')} Aprobado
            </h4>
            <p className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-400">
              Tus fondos están resguardados por la Garantía Escrow SaaS.
            </p>
          </div>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-3 pt-2 border-t border-gray-100 dark:border-slate-800">
            <div>
              <h5 className="text-xs font-extrabold text-gray-800 dark:text-slate-200">
                Guarda tu comprobante y rastrea tu pedido
              </h5>
              <p className="text-[11px] text-gray-500 dark:text-slate-400 font-medium">
                Ingresa tu email para vincular tu compra y recibir el código de seguimiento sin crear contraseña:
              </p>
            </div>

            <div className="flex gap-2">
              <input
                type="email"
                required
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-3.5 py-2.5 text-xs border border-gray-300 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800 font-medium focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1 shrink-0"
              >
                <AppIcon name="star" className="w-3.5 h-3.5 text-white" />
                <span>Guardar 1-Click</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-center space-y-2">
            <AppIcon name="questions" className="w-6 h-6 text-blue-600 dark:text-blue-400 mx-auto" />
            <h5 className="text-xs font-black text-blue-950 dark:text-blue-200">¡Enlace de acceso enviado a {email}!</h5>
            <p className="text-[11px] text-blue-800 dark:text-blue-300 font-medium">
              Revisa tu bandeja de entrada para ver el comprobante y el mapa de seguimiento en vivo.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-2 px-6 py-2 bg-blue-600 text-white rounded-xl text-xs font-black cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}
