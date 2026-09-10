/**
 * ============================================================================
 * FILE: ReferralHub.tsx
 * ============================================================================
 * 
 * @description Componente del centro de referidos Ganar-Ganar (B2C & B2B).
 * 
 * @module Presentation/Components/Referrals/ReferralHub
 * ============================================================================
 */

'use client';

import React from 'react';
import AppIcon from '@/components/ui/icons/AppIcon';
import { useReferralProgram } from '@/features/referrals/hooks/useReferralProgram';

interface ReferralHubProps {
  userId?: string | null;
}

export default function ReferralHub({ userId }: ReferralHubProps) {
  const { referralLink, copied, copyLink, referralStats } = useReferralProgram(userId || null);

  return (
    <div className="p-5 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-md space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold">
            <AppIcon name="award" className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h3 className="text-sm font-black">Programa de Referidos "Ganar-Ganar"</h3>
            <p className="text-[11px] text-blue-100 font-medium">Invita a amigos o tiendas y acumula beneficios</p>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full text-[10px] font-black bg-amber-400 text-slate-950 uppercase tracking-wider">
          $15.000 ARS ganados
        </span>
      </div>

      {/* Grid de Beneficios B2C & B2B */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15">
          <span className="text-[10px] font-extrabold text-amber-200 block uppercase">Para Compradores (B2C)</span>
          <p className="font-extrabold mt-0.5">$5.000 ARS para ti y $5.000 para tu amigo en su 1ª compra.</p>
        </div>
        <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15">
          <span className="text-[10px] font-extrabold text-emerald-200 block uppercase">Para Tiendas (B2B)</span>
          <p className="font-extrabold mt-0.5">Invita a otro comercio y obtén 0% de comisión por 30 días.</p>
        </div>
      </div>

      {/* Input de Copiar Enlace Único */}
      <div className="flex gap-2 bg-slate-950/40 p-1.5 rounded-2xl border border-white/15 items-center">
        <input
          type="text"
          readOnly
          value={referralLink}
          className="flex-1 px-3 text-xs bg-transparent text-white font-medium outline-hidden truncate"
        />
        <button
          type="button"
          onClick={copyLink}
          className="px-4 py-2 bg-white text-blue-700 hover:bg-blue-50 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1 shrink-0"
        >
          <AppIcon name={copied ? "check" : "share"} className="w-3.5 h-3.5" />
          <span>{copied ? '¡Copiado!' : 'Copiar Link'}</span>
        </button>
      </div>
    </div>
  );
}
