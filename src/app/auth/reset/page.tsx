/**
 * ============================================================================
 * FILE: page.tsx (app/auth/reset)
 * ============================================================================
 * 
 * @description Vista de Solicitud de Restablecimiento de Contraseña.
 *              Refactorizado bajo Clean Architecture y SOLID:
 *              - Lógica de auth en `useResetPasswordPage`
 *              - Vista limpia (< 70 líneas)
 * 
 * @module Presentation/Pages/Auth/Reset
 * ============================================================================
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { useResetPasswordPage } from '@/features/auth/hooks/useResetPasswordPage';

export default function ResetPage() {
  const r = useResetPasswordPage();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-gray-900 dark:text-slate-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <span className="text-4xl">🔑</span>
        <h2 className="text-2xl font-black text-gray-900 dark:text-slate-100">
          Recuperar Contraseña
        </h2>
        <p className="text-xs text-gray-500 font-medium">
          Ingresa tu email para recibir un enlace de recuperación
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-slate-900 py-8 px-6 shadow-2xs rounded-3xl border border-gray-200/90 dark:border-slate-800 space-y-6">
          {r.message && (
            <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200">
              {r.message}
            </div>
          )}

          {r.error && (
            <div className="p-3 bg-rose-50 text-rose-800 text-xs font-bold rounded-xl border border-rose-200">
              {r.error}
            </div>
          )}

          <form onSubmit={r.handleResetRequest} className="space-y-4">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700 dark:text-slate-300 mb-1">
                Correo Electrónico
              </label>
              <input
                type="email"
                value={r.email}
                onChange={(e) => r.setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full p-3 text-xs border border-gray-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 font-medium"
                required
              />
            </div>

            <button
              type="submit"
              disabled={r.loading}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-xs transition shadow-xs disabled:opacity-50"
            >
              {r.loading ? 'Enviando enlace...' : 'Enviar Enlace de Recuperación'}
            </button>
          </form>

          <div className="pt-4 border-t border-gray-100 dark:border-slate-800 text-center text-xs font-medium">
            <Link href="/auth" className="text-blue-600 font-bold hover:underline">
              ← Volver al inicio de sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}