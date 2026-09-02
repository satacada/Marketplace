/**
 * ============================================================================
 * FILE: useRegisterPage.ts
 * ============================================================================
 * 
 * @description Custom Hook para el registro de nuevos usuarios en el sistema (SOLID / SRP).
 * 
 * @module Features/Auth/Hooks/useRegisterPage
 * ============================================================================
 */

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/features/auth/hooks/useAuth';

export function useRegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get('redirect');
  const { register } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [storeName, setStoreName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await register({ email, password, storeName });
    if (res.success) {
      router.push(redirectParam || '/dashboard');
    } else {
      setError(res.error || 'Error al registrar usuario');
    }
    setLoading(false);
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    storeName,
    setStoreName,
    loading,
    error,
    handleRegister,
  };
}
