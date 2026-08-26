/**
 * ============================================================================
 * FILE: QuestionCard.tsx
 * ============================================================================
 * 
 * @description Componente modular para renderizar tarjetas de preguntas recibidas.
 * 
 * @module Presentation/Components/Questions/QuestionCard
 * ============================================================================
 */

import React from 'react';
import { DashboardQuestion } from '@/features/questions/hooks/useDashboardQuestions';

type Props = {
  question: DashboardQuestion;
  onOpenReply: (q: DashboardQuestion) => void;
};

export default function QuestionCard({ question, onOpenReply }: Props) {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-200/90 dark:border-slate-800 shadow-2xs space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
            📦 {question.products?.title || 'Producto'}
          </span>
          <h4 className="text-sm font-extrabold text-gray-900 dark:text-slate-100 mt-1">
            💬 "{question.question}"
          </h4>
        </div>
        <span className="text-[10px] text-gray-400 font-bold">
          {new Date(question.created_at).toLocaleDateString('es-CL')}
        </span>
      </div>

      {question.answer ? (
        <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-100 dark:border-emerald-900 text-xs font-medium text-emerald-900 dark:text-emerald-300">
          <span className="font-extrabold text-emerald-600">✓ Tu respuesta: </span>
          {question.answer}
        </div>
      ) : (
        <div className="flex justify-between items-center pt-2">
          <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400">
            ⏳ Pendiente de respuesta
          </span>
          <button
            type="button"
            onClick={() => onOpenReply(question)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
          >
            Responder
          </button>
        </div>
      )}
    </div>
  );
}
