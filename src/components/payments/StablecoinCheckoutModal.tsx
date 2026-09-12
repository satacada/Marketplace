/**
 * ============================================================================
 * FILE: StablecoinCheckoutModal.tsx
 * ============================================================================
 * 
 * @description Modal de Checkout con L2 Stablecoins (USDT/USDC en Polygon/Solana)
 *              que ofrece 5% OFF automático y pago por QR sin comisiones bancarias.
 * 
 * @module Presentation/Components/Payments/StablecoinCheckoutModal
 * ============================================================================
 */

'use client';

import React from 'react';
import { Modal } from '@/components/ui/Modal';
import AppIcon from '@/components/ui/icons/AppIcon';
import { useStablecoinPayment } from '@/features/payments/hooks/useStablecoinPayment';

interface StablecoinCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderTotalUSD: number;
}

export default function StablecoinCheckoutModal({
  isOpen,
  onClose,
  orderTotalUSD,
}: StablecoinCheckoutModalProps) {
  // Aplicar 5% OFF por pago con L2 Stablecoins
  const discountedTotal = Math.round(orderTotalUSD * 0.95 * 100) / 100;
  const { escrowWalletAddress, qrCodeUrl, isVerifying, isPaid, verifyBlockchainPayment } = useStablecoinPayment(discountedTotal);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="🪙 Pago con L2 Stablecoins (5% OFF Extra)">
      <div className="space-y-4 pt-1 text-gray-900 dark:text-slate-100">
        {!isPaid ? (
          <>
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 flex items-center justify-between text-xs font-black">
              <span className="text-emerald-800 dark:text-emerald-300">Total con 5% OFF:</span>
              <span className="text-sm text-emerald-600 dark:text-emerald-400">${discountedTotal} USDT</span>
            </div>

            <div className="flex flex-col items-center justify-center p-4 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl space-y-3">
              <img src={qrCodeUrl} alt="QR USDT Escrow" className="w-44 h-44 rounded-2xl border p-1" />
              <p className="text-[11px] text-gray-500 font-medium text-center">
                Escanea desde Binance, Lemon, Metamask o Bitso (Red Polygon / Solana)
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase text-gray-400">Dirección de Tesorería Escrow:</span>
              <div className="p-2.5 bg-gray-100 dark:bg-slate-800 rounded-xl text-[11px] font-mono truncate select-all">
                {escrowWalletAddress}
              </div>
            </div>

            <button
              type="button"
              onClick={() => verifyBlockchainPayment()}
              disabled={isVerifying}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-2"
            >
              {isVerifying ? (
                <span>Verificando en Blockchain...</span>
              ) : (
                <>
                  <AppIcon name="check-circle" className="w-4 h-4" />
                  <span>Verificar Pago USDT</span>
                </>
              )}
            </button>
          </>
        ) : (
          <div className="p-6 text-center space-y-3">
            <AppIcon name="check-circle" className="w-12 h-12 text-emerald-500 mx-auto" />
            <h4 className="text-sm font-black text-emerald-600">¡Pago Cripto Confirmado en Escrow!</h4>
            <p className="text-xs text-gray-500 font-medium">Los fondos están asegurados en la custodia hasta la entrega.</p>
            <button type="button" onClick={onClose} className="px-6 py-2 bg-blue-600 text-white rounded-xl text-xs font-black">
              Cerrar
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}
