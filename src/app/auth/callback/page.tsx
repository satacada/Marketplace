/**
 * ============================================================================
 * FILE: page.tsx (app/auth/callback)
 * ============================================================================
 * 
 * @description Página de callback de autenticación PKCE para OAuth (Google Sign-In).
 *              Maneja el intercambio de código por sesión en el cliente (localStorage)
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      const code = searchParams.get('code');
      const next = searchParams.get('next') || '/marketplace';

      if (code) {
        // Intercambiar código PKCE por sesión activa guardada en localStorage
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError) {
          console.error('Error al intercambiar código de autenticación:', exchangeError);
          setError(exchangeError.message);
          setTimeout(() => router.push('/auth?error=callback-failed'), 2000);
          return;
        }
      }

      // Redirigir al usuario al destino deseado
      router.push(next);
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
          {error ? `Error: ${error}` : 'Verificando tus credenciales de Google y preparando tu cuenta.'}
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
