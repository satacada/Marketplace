/**
 * ============================================================================
 * FILE: page.tsx (app/auth/callback)
 * ============================================================================
 * 
 * @description Página de callback de autenticación PKCE para OAuth (Google Sign-In).
 *              Maneja el intercambio resiliente de código por sesión en el cliente (localStorage)
 *              y redirige al usuario al destino especificado.
 * 
 * @module Presentation/Pages/Auth/Callback
 * ============================================================================
 */

'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/infrastructure/database/supabase.client';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loadingText, setLoadingText] = useState('Verificando tus credenciales de Google...');

  useEffect(() => {
    const handleAuthCallback = async () => {
      const code = searchParams.get('code');
      const next = searchParams.get('next') || '/marketplace';

      if (code) {
        try {
          // Intercambiar código PKCE por sesión activa guardada en localStorage
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) {
            console.warn('Aviso en intercambio PKCE:', exchangeError.message);
          }
        } catch (err: any) {
          // Si el verificador PKCE no está en localStorage debido a reintentos previos, ignorar el lanzamiento de excepción
          console.warn('Excepción PKCE capturada y manejada con seguridad:', err?.message || err);
        }
      }

      // Verificar si hay una sesión activa de usuario en Supabase (incluso si PKCE reintentó)
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        setLoadingText('¡Autenticación exitosa! Redirigiendo...');
        // Emitir evento global para que el Header y Carrito se sincronicen en vivo
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('cartUpdated'));
        }
        router.push(next);
      } else {
        console.error('No se pudo verificar la sesión de usuario tras el callback OAuth');
        router.push('/auth');
      }
    };

    handleAuthCallback();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 p-4">
      <div className="text-center space-y-4 p-8 max-w-sm w-full bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-gray-200/90 dark:border-slate-800">
        <div className="text-5xl animate-bounce">⚡</div>
        <h2 className="text-xl font-extrabold text-gray-900 dark:text-slate-100">
          Iniciando sesión...
        </h2>
        <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">
          {loadingText}
        </p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950">
          <div className="text-center text-gray-500 font-bold text-sm">Cargando autenticación...</div>
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
