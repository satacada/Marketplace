/**
 * ============================================================================
 * FILE: useResetPasswordPage.ts
 * ============================================================================
 * 
 * @description Custom Hook para la recuperación de contraseña por email (SOLID / SRP).
 * 
 * @module Features/Auth/Hooks/useResetPasswordPage
 * ============================================================================
 */

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export function useResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const { error: resetErr } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (resetErr) {
        setError(resetErr.message);
      } else {
        setMessage('Se ha enviado un correo con instrucciones para restablecer tu contraseña.');
      }
    } catch (err: any) {
      setError(err.message || 'Error al solicitar restablecimiento');
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    loading,
    message,
    error,
    handleResetRequest,
  };
}
