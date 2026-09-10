/**
 * ============================================================================
 * FILE: FlashSaleWidget.tsx
 * ============================================================================
 * 
 * @description Widget de Ventas Relámpago con temporizador dinámico estilo AliExpress/Amazon,
 *              barra de stock reservado y sistema de cola justa anti-bots.
 * 
 * @module Presentation/Components/Deals/FlashSaleWidget
 * ============================================================================
 */

'use client';

import React from 'react';
import AppIcon from '@/components/ui/icons/AppIcon';
import { useFlashSale } from '@/features/deals/hooks/useFlashSale';

export default function FlashSaleWidget() {
  const { formattedTime, claimed, claimedStockPercentage, handleClaimFlashDeal } = useFlashSale(7200);

  return (
    <div className="p-4 rounded-3xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 text-white shadow-md space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold">
            <AppIcon name="shipping" className="w-4 h-4 text-amber-200" />
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider">Venta Relámpago 50% OFF</h4>
            <p className="text-[10px] text-rose-100 font-medium">Unidades limitadas con reserva justa anti-bots</p>
          </div>
        </div>

        {/* Temporizador Regresivo */}
        <div className="bg-slate-950/40 px-3 py-1 rounded-xl border border-white/20 flex items-center gap-1">
          <AppIcon name="pending" className="w-3.5 h-3.5 text-amber-300" />
          <span className="text-xs font-mono font-black text-amber-300">{formattedTime}</span>
        </div>
      </div>

      {/* Barra de Progreso de Stock Reservado */}
      <div className="space-y-1">
        <div className="flex justify-between text-[10px] font-bold text-rose-100">
          <span>Vendidos: {claimedStockPercentage}%</span>
          <span>¡Quedan pocas unidades!</span>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-950/30 overflow-hidden">
          <div
            className="h-full bg-amber-300 transition-all duration-500"
            style={{ width: `${claimedStockPercentage}%` }}
          />
        </div>
      </div>

      {/* Botón de Reclamar Oferta */}
      <button
        type="button"
        onClick={handleClaimFlashDeal}
        disabled={claimed}
        className={`w-full py-2.5 rounded-xl font-black text-xs transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer ${
          claimed
            ? 'bg-emerald-600 text-white'
            : 'bg-white text-rose-600 hover:bg-rose-50'
        }`}
      >
        <AppIcon name={claimed ? "check-circle" : "tag"} className="w-4 h-4" />
        <span>{claimed ? '¡Oferta Reservada en Carrito!' : 'Reclamar 50% OFF Ahora'}</span>
      </button>
    </div>
  );
}
