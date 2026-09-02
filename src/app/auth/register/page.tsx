/**
 * ============================================================================
 * FILE: page.tsx (app/auth/register)
 * ============================================================================
 * 
 * @description Vista de Registro de Nuevos Usuarios.
 *              Incluye botón de navegación directa para retornar a /marketplace en cualquier momento.
 * 
 * @module Presentation/Pages/Auth/Register
 * ============================================================================
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { useRegisterPage } from '@/features/auth/hooks/useRegisterPage';

export default function RegisterPage() {
  const reg = useRegisterPage();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-gray-900 dark:text-slate-100 relative">
      {/* Botón de retorno al Marketplace (Resuelve el bloqueo en pantalla de Registro) */}
      <div className="absolute top-6 left-6">
        <Link
          href="/marketplace"
          className="px-4 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 hover:border-blue-500 rounded-xl text-xs font-black text-blue-600 dark:text-blue-400 transition shadow-2xs flex items-center gap-2"
        >
          <span>←</span>
          <span>Volver al Marketplace</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2 pt-8 sm:pt-0">
        <span className="text-4xl">🚀</span>
        <h2 className="text-2xl font-black text-gray-900 dark:text-slate-100">
          Crear Cuenta Gratis
        </h2>
        <p className="text-xs text-gray-500 font-medium">
          Comienza a vender o comprar en Marketplace SaaS
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-slate-900 py-8 px-6 shadow-2xs rounded-3xl border border-gray-200/90 dark:border-slate-800 space-y-6">
          {reg.error && (
            <div className="p-3 bg-rose-50 text-rose-800 text-xs font-bold rounded-xl border border-rose-200">
              {reg.error}
            </div>
          )}

          <form onSubmit={reg.handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700 dark:text-slate-300 mb-1">
                Nombre de tu Tienda / Nombre Comercial
              </label>
              <input
                type="text"
                value={reg.storeName}
                onChange={(e) => reg.setStoreName(e.target.value)}
                placeholder="Mi Tienda Oficial"
                className="w-full p-3 text-xs border border-gray-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700 dark:text-slate-300 mb-1">
                Correo Electrónico
              </label>
              <input
                type="email"
                value={reg.email}
                onChange={(e) => reg.setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full p-3 text-xs border border-gray-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700 dark:text-slate-300 mb-1">
                Contraseña
              </label>
              <input
                type="password"
                value={reg.password}
                onChange={(e) => reg.setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full p-3 text-xs border border-gray-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 font-medium"
                required
              />
            </div>

            <button
              type="submit"
              disabled={reg.loading}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-xs transition shadow-xs disabled:opacity-50 cursor-pointer"
            >
              {reg.loading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </button>
          </form>

          <div className="pt-4 border-t border-gray-100 dark:border-slate-800 text-center text-xs font-medium space-y-2">
            <div>
              <span className="text-gray-500">¿Ya tienes cuenta? </span>
              <Link href="/auth" className="text-blue-600 font-bold hover:underline">
                Iniciar Sesión
              </Link>
            </div>
            <div>
              <Link href="/marketplace" className="text-gray-400 hover:text-gray-700 dark:hover:text-slate-200 underline">
                Continuar como invitado en el Marketplace
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}