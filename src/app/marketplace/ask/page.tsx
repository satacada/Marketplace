/**
 * ============================================================================
 * FILE: page.tsx (app/marketplace/ask)
 * ============================================================================
 * 
 * @description Vista de Historial de Preguntas Enviadas por el Comprador.
 *              Refactorizado bajo Clean Architecture y SOLID:
 *              - Lógica de preguntas en `useAskPage`
 *              - Vista limpia (< 80 líneas)
 * 
 * @module Presentation/Pages/Marketplace/Ask
 * ============================================================================
 */

'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useAskPage } from '@/features/questions/hooks/useAskPage';

export default function AskPage() {
  const ask = useAskPage();

  if (ask.loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 p-8 flex items-center justify-center">
        <p className="text-gray-500 font-bold text-sm">Cargando tus preguntas realizadas...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 transition-colors duration-200">
      <Header />

      <main className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-200/90 dark:border-slate-800 shadow-2xs">
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-slate-100">
            Mis Preguntas Enviadas
          </h1>
          <p className="text-xs text-gray-500 font-medium mt-1">
            Revisa el estado y las respuestas de los vendedores a tus preguntas.
          </p>
        </div>

        {ask.questions.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl text-center border border-gray-200 dark:border-slate-800 space-y-3">
            <span className="text-5xl">💬</span>
            <p className="text-gray-600 dark:text-slate-300 font-bold text-sm">
              No has realizado preguntas sobre ningún producto.
            </p>
            <Link href="/marketplace" className="inline-block px-6 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-extrabold">
              Explorar Catálogo
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {ask.questions.map((q) => (
              <div key={q.id} className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-gray-200/90 dark:border-slate-800 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <Link href={`/marketplace/product/${q.products?.id}`} className="text-xs font-extrabold text-blue-600 hover:underline">
                    📦 {q.products?.title || 'Producto'}
                  </Link>
                  <span className="text-[10px] text-gray-400 font-bold">
                    {new Date(q.created_at).toLocaleDateString('es-CL')}
                  </span>
                </div>

                <p className="text-xs font-bold text-gray-900 dark:text-slate-100">
                  💬 Tu consulta: "{q.question}"
                </p>

                {q.answer ? (
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-100 dark:border-emerald-900 text-xs font-medium text-emerald-900 dark:text-emerald-300">
                    <span className="font-extrabold text-emerald-600">✓ Respuesta del vendedor: </span>
                    {q.answer}
                  </div>
                ) : (
                  <p className="text-[11px] text-amber-600 font-semibold italic">
                    ⏳ Esperando respuesta del vendedor...
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}