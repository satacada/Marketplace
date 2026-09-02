/**
 * ============================================================================
 * FILE: useAuthPage.ts
 * ============================================================================
 * 
 * @description Custom Hook para controlar el formulario de inicio de sesión
 *              y registro PKCE (SOLID / SRP).
 * 
 * @module Features/Auth/Hooks/useAuthPage
 * ============================================================================
 */

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/features/auth/hooks/useAuth';

export function useAuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get('redirect');
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await login({ email, password });
    if (res.success) {
      router.push(redirectParam || '/dashboard');
    } else {
      setError(res.error || 'Credenciales incorrectas');
    }
    setLoading(false);
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    handleLogin,
    router,
  };
}
