/**
 * ============================================================================
 * FILE: SellerTrustCard.tsx
 * ============================================================================
 * 
 * @description Card de reputación, insignias de verificación (Vendedor Verificado,
 *              Tienda Oficial, Despacho Exprés) y métricas de desempeño del vendedor.
 * 
 * @module Presentation/Components/Trust/SellerTrustCard
 * ============================================================================
 */

'use client';

import React from 'react';
import AppIcon from '@/components/ui/icons/AppIcon';

interface SellerTrustCardProps {
  storeName?: string;
  isVerified?: boolean;
  isOfficialStore?: boolean;
  isExpressDelivery?: boolean;
  responseTime?: string;
  onTimeDeliveryRate?: string;
  rating?: number;
  reviewsCount?: number;
}

export default function SellerTrustCard({
  storeName = 'Tienda Oficial Verificada',
  isVerified = true,
  isOfficialStore = true,
  isExpressDelivery = true,
  responseTime = '< 15 min',
  onTimeDeliveryRate = '99.4%',
  rating = 4.9,
  reviewsCount = 42,
}: SellerTrustCardProps) {
  return (
    <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-gray-200/90 dark:border-slate-800 space-y-3">
      {/* Encabezado e Insignias Principales */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-xs font-black text-gray-900 dark:text-slate-100 mr-1">{storeName}</span>
        
        {isVerified && (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 inline-flex items-center gap-1">
            <AppIcon name="check-circle" className="w-3 h-3 text-blue-600 dark:text-blue-400" />
            <span>Verificado</span>
          </span>
        )}

        {isOfficialStore && (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900 inline-flex items-center gap-1">
            <AppIcon name="award" className="w-3 h-3 text-amber-500" />
            <span>Oficial</span>
          </span>
        )}

        {isExpressDelivery && (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 inline-flex items-center gap-1">
            <AppIcon name="shipping" className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            <span>Despacho &lt; 2h</span>
          </span>
        )}
      </div>

      {/* Grid de Métricas de Reputación */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100 dark:border-slate-800 text-center">
        <div className="p-2 rounded-xl bg-gray-50/70 dark:bg-slate-800/50">
          <span className="text-[10px] font-extrabold text-gray-400 block uppercase">Respuesta</span>
          <span className="text-xs font-black text-gray-800 dark:text-slate-200 flex items-center justify-center gap-1 mt-0.5">
            <AppIcon name="question" className="w-3 h-3 text-blue-500" />
            <span>{responseTime}</span>
          </span>
        </div>

        <div className="p-2 rounded-xl bg-gray-50/70 dark:bg-slate-800/50">
          <span className="text-[10px] font-extrabold text-gray-400 block uppercase">A Tiempo</span>
          <span className="text-xs font-black text-gray-800 dark:text-slate-200 flex items-center justify-center gap-1 mt-0.5">
            <AppIcon name="package" className="w-3 h-3 text-emerald-500" />
            <span>{onTimeDeliveryRate}</span>
          </span>
        </div>

        <div className="p-2 rounded-xl bg-gray-50/70 dark:bg-slate-800/50">
          <span className="text-[10px] font-extrabold text-gray-400 block uppercase">Calificación</span>
          <span className="text-xs font-black text-gray-800 dark:text-slate-200 flex items-center justify-center gap-1 mt-0.5">
            <AppIcon name="star" className="w-3 h-3 text-amber-400" />
            <span>{rating} ({reviewsCount})</span>
          </span>
        </div>
      </div>
    </div>
  );
}
