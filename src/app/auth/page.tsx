/**
 * ============================================================================
 * FILE: page.tsx (app/auth)
 * ============================================================================
 * 
 * @description Página de Iniciar Sesión en Marketplace SaaS.
 *              Refactorizado bajo Clean Architecture y SOLID:
 *              - Lógica de autenticación en `useAuthPage` (< 40 líneas)
 *              - Vista limpia y orquestada (< 90 líneas)
 * 
 * @module Presentation/Pages/Auth
 * ============================================================================
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { useAuthPage } from '@/features/auth/hooks/useAuthPage';

export default function LoginPage() {
  const auth = useAuthPage();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-gray-900 dark:text-slate-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <span className="text-4xl">🛍️</span>
        <h2 className="text-2xl font-black text-gray-900 dark:text-slate-100">
          Iniciar Sesión en Marketplace
        </h2>
        <p className="text-xs text-gray-500 font-medium">
          Accede a tu cuenta de vendedor o comprador
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-slate-900 py-8 px-6 shadow-2xs rounded-3xl border border-gray-200/90 dark:border-slate-800 space-y-6">
          {auth.error && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs font-bold rounded-xl border border-rose-200 dark:border-rose-900">
              {auth.error}
            </div>
          )}

          <form onSubmit={auth.handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700 dark:text-slate-300 mb-1">
                Correo Electrónico
              </label>
              <input
                type="email"
                value={auth.email}
                onChange={(e) => auth.setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full p-3 text-xs border border-gray-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 font-medium focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700 dark:text-slate-300 mb-1">
                Contraseña
              </label>
              <input
                type="password"
                value={auth.password}
                onChange={(e) => auth.setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-3 text-xs border border-gray-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 font-medium focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="flex items-center justify-between text-xs font-bold">
              <Link href="/auth/reset" className="text-blue-600 dark:text-blue-400 hover:underline">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <button
              type="submit"
              disabled={auth.loading}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-xs transition shadow-xs disabled:opacity-50 cursor-pointer"
            >
              {auth.loading ? 'Verificando...' : 'Iniciar Sesión'}
            </button>
          </form>

          <div className="pt-4 border-t border-gray-100 dark:border-slate-800 text-center text-xs font-medium">
            <span className="text-gray-500">¿Aún no tienes cuenta? </span>
            <Link href="/auth/register" className="text-blue-600 font-bold hover:underline">
              Regístrate gratis
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}