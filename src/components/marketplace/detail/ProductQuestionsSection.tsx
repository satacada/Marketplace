/**
 * ============================================================================
 * FILE: ProductQuestionsSection.tsx
 * ============================================================================
 * 
 * @description Componente modular para la sección Preguntas al Vendedor (Imagen 2).
 *              Permite enviar nuevas preguntas y visualizar el historial completo
 *              de todas las preguntas realizadas al vendedor sobre este producto,
 *              además de dar la opción de responder si es el vendedor.
 * 
 * @module Presentation/Components/Marketplace/Detail/ProductQuestionsSection
 * ============================================================================
 */

import React, { useState } from 'react';
import { Question } from '@/features/products/hooks/useProductDetail';

type Props = {
  questions: Question[];
  newQuestion: string;
  onNewQuestionChange: (val: string) => void;
  onSubmitQuestion: (e: React.FormEvent) => void;
  submitting: boolean;
  isOwnProduct: boolean;
};

export default function ProductQuestionsSection({
  questions,
  newQuestion,
  onNewQuestionChange,
  onSubmitQuestion,
  submitting,
  isOwnProduct,
}: Props) {
  const [answeringId, setAnsweringId] = useState<string | null>(null);
  const [answerText, setAnswerText] = useState<string>('');
  const [localQuestions, setLocalQuestions] = useState<Question[]>(questions);

  // Sincronizar preguntas prop cuando cambian
  React.useEffect(() => {
    setLocalQuestions(questions);
  }, [questions]);

  const handleSellerAnswerSubmit = (e: React.FormEvent, questionId: string) => {
    e.preventDefault();
    if (!answerText.trim()) return;

    setLocalQuestions(prev =>
      prev.map(q => q.id === questionId ? { ...q, answer: answerText } : q)
    );

    setAnsweringId(null);
    setAnswerText('');
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-gray-200/90 dark:border-slate-800 shadow-2xs space-y-6">
      <div className="flex items-center gap-2 border-b border-gray-100 dark:border-slate-800 pb-4">
        <span className="text-xl font-bold text-rose-500">❓</span>
        <h3 className="text-lg font-black text-gray-900 dark:text-slate-100">
          Preguntas al Vendedor ({localQuestions.length})
        </h3>
      </div>

      {/* Formulario para realizar una nueva pregunta (Opción de Preguntar - Imagen 2) */}
      {!isOwnProduct && (
        <form onSubmit={onSubmitQuestion} className="space-y-3">
          <textarea
            value={newQuestion}
            onChange={(e) => onNewQuestionChange(e.target.value)}
            placeholder="Escribe tu duda sobre el producto (envío, estado, compatibilidad)..."
            rows={3}
            className="w-full p-3.5 text-xs border border-gray-300 dark:border-slate-700 rounded-2xl bg-gray-50 dark:bg-slate-800/60 text-gray-900 dark:text-slate-100 font-medium focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting || !newQuestion.trim()}
              className="py-2.5 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition shadow-xs disabled:opacity-50 cursor-pointer"
            >
              {submitting ? 'Enviando...' : 'Preguntar'}
            </button>
          </div>
        </form>
      )}

      {/* Lista de TODAS las preguntas realizadas sobre este producto (Imagen 2) */}
      {localQuestions.length === 0 ? (
        <p className="text-xs text-gray-400 font-medium py-4 text-center">
          Aún no hay preguntas realizadas para este producto. ¡Sé el primero en preguntar!
        </p>
      ) : (
        <div className="space-y-4 pt-2">
          {localQuestions.map((q) => (
            <div key={q.id} className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-gray-100 dark:border-slate-800 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <p className="text-xs font-extrabold text-gray-900 dark:text-slate-100">
                  💬 {q.question}
                </p>
                <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap">
                  {new Date(q.created_at).toLocaleDateString('es-AR')}
                </span>
              </div>

              {q.answer ? (
                <div className="pl-4 pt-2 border-l-2 border-blue-500 text-xs font-medium text-gray-700 dark:text-slate-300">
                  <span className="font-extrabold text-blue-600 dark:text-blue-400">Respuesta del Vendedor: </span>
                  {q.answer}
                </div>
              ) : (
                <div className="pt-1">
                  {isOwnProduct ? (
                    answeringId === q.id ? (
                      <form onSubmit={(e) => handleSellerAnswerSubmit(e, q.id)} className="space-y-2 pt-2">
                        <input
                          type="text"
                          value={answerText}
                          onChange={(e) => setAnswerText(e.target.value)}
                          placeholder="Escribe tu respuesta como vendedor..."
                          className="w-full p-2 text-xs border border-gray-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 font-medium"
                        />
                        <div className="flex gap-2 justify-end">
                          <button
                            type="button"
                            onClick={() => setAnsweringId(null)}
                            className="px-3 py-1 text-xs font-bold text-gray-500 hover:underline"
                          >
                            Cancelar
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-1 bg-blue-600 text-white rounded-lg text-xs font-bold"
                          >
                            Responder
                          </button>
                        </div>
                      </form>
                    ) : (
                      <button
                        type="button"
                        onClick={() => { setAnsweringId(q.id); setAnswerText(''); }}
                        className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                      >
                        ✍️ Responder a esta pregunta
                      </button>
                    )
                  ) : (
                    <p className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold italic">
                      ⏳ Pendiente de respuesta por el vendedor
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
