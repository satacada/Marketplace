/**
 * ============================================================================
 * FILE: page.tsx (dashboard/questions)
 * ============================================================================
 * 
 * @description Panel de Preguntas Recibidas por el Vendedor.
 *              Refactorizado bajo Clean Architecture y SOLID:
 *              - Lógica de preguntas en `useDashboardQuestions`
 *              - Tarjetas modulares `QuestionCard` (< 60 líneas)
 * 
 * @module Presentation/Pages/Dashboard/Questions
 * ============================================================================
 */

'use client';

import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { useDashboardQuestions } from '@/features/questions/hooks/useDashboardQuestions';
import QuestionCard from '@/components/questions/QuestionCard';

export default function DashboardQuestionsPage() {
  const q = useDashboardQuestions();

  if (q.loading) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center">
        <p className="text-gray-500 font-bold text-sm">Cargando preguntas recibidas...</p>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 max-w-4xl mx-auto space-y-6 text-gray-900 dark:text-slate-100">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-200/90 dark:border-slate-800 shadow-2xs">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-slate-100">
          Preguntas Recibidas
        </h1>
        <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 font-medium">
          Responde a las consultas de tus compradores para aumentar tu tasa de conversión.
        </p>
      </div>

      {q.questions.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl text-center border border-gray-200/90 dark:border-slate-800 space-y-3">
          <span className="text-4xl">💬</span>
          <p className="text-gray-600 dark:text-slate-300 font-extrabold text-sm">
            Aún no tienes preguntas recibidas.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {q.questions.map((item) => (
            <QuestionCard key={item.id} question={item} onOpenReply={q.handleOpenReplyModal} />
          ))}
        </div>
      )}

      {/* Modal para Responder Pregunta */}
      {q.showReplyModal && q.selectedQuestion && (
        <Modal
          isOpen={q.showReplyModal}
          onClose={() => q.setShowReplyModal(false)}
          title="Responder Pregunta de Comprador"
        >
          <div className="space-y-4 pt-2">
            <div className="p-3 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
              <span className="text-[10px] font-bold text-gray-400">Pregunta:</span>
              <p className="text-xs font-bold text-gray-900 dark:text-slate-100 mt-0.5">
                "{q.selectedQuestion.question}"
              </p>
            </div>

            <textarea
              value={q.replyText}
              onChange={(e) => q.setReplyText(e.target.value)}
              placeholder="Escribe tu respuesta oficial para el comprador..."
              rows={4}
              className="w-full p-3 text-xs border border-gray-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 font-medium focus:ring-2 focus:ring-blue-500"
            />

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => q.setShowReplyModal(false)}
                className="w-1/2 py-2.5 rounded-xl font-bold text-xs bg-gray-100 text-gray-600"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={q.submitting || !q.replyText.trim()}
                onClick={q.handleSendReply}
                className="w-1/2 py-2.5 rounded-xl font-extrabold text-xs bg-blue-600 text-white disabled:opacity-50"
              >
                {q.submitting ? 'Enviando...' : 'Enviar Respuesta'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}