/**
 * ============================================================================
 * FILE: page.tsx
 * ============================================================================
 * 
 * @description Página de restablecimiento de contraseña.
 *              Formulario para solicitar email de recuperación.
 * 
 * @module Presentation/Pages/Auth/ResetPassword
 * 
 * @author System
 * @created 2026-08-23
 * 
 * @dependencies
 * - react
 * - @/features/auth/hooks/useAuth
 * - @/components/ui/Button
 * - @/components/ui/Input
 * - @/components/ui/Modal
 * 
 * @related-files
 * - @/features/auth/hooks/useAuth.ts
 * - @/features/auth/services/auth.service.ts
 * 
 * @exports
 * - ResetPasswordPage (default)
 * 
 * ============================================================================
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({ 
    title: '', 
    message: '', 
    type: 'success' as 'success' | 'info' | 'error' 
  });
  const [localError, setLocalError] = useState('');
  
  const { resetPassword, isLoading } = useAuth();

  const showModalMessage = (title: string, message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setModalData({ title, message, type });
    setShowModal(true);
  };

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (!validateEmail(email)) {
      setLocalError('Por favor ingresa un correo electrónico válido');
      return;
    }

    const result = await resetPassword(email);
    if (result.success) {
      showModalMessage(
        'Correo enviado',
        'Hemos enviado un correo con instrucciones para restablecer tu contraseña.\n\nPor favor revisa tu bandeja de entrada (y la carpeta de spam).\n\nEl enlace expirará en 1 hora.',
        'success'
      );
      setEmail('');
    } else {
      // Manejo específico para límite de rate limit
      if (result.error?.includes('rate limit') || result.error?.includes('exceeded')) {
        setLocalError('Has solicitado demasiados correos de recuperación recientemente. Por favor espera unos minutos antes de intentar nuevamente.');
      } else {
        setLocalError(result.error || 'Error al enviar correo de recuperación');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Card principal */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header con branding */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
            <div className="text-center">
              <div className="text-4xl mb-2">🔐</div>
              <h1 className="text-2xl font-bold text-white">Restablecer Contraseña</h1>
              <p className="text-blue-100 text-sm mt-1">Marketplace SaaS</p>
            </div>
          </div>

          {/* Contenido del formulario */}
          <div className="px-8 py-6">
            <p className="text-gray-600 mb-6 text-sm">
              Ingresa tu correo electrónico y te enviaremos instrucciones para restablecer tu contraseña.
            </p>

            <form onSubmit={handleResetPassword} className="space-y-5">
              {/* Email field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Correo electrónico
                </label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    required
                    placeholder="tu@correo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    className="pl-10"
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    📧
                  </div>
                </div>
              </div>

              {/* Error message */}
              {localError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {localError}
                </div>
              )}

              {/* Submit button */}
              <Button
                type="submit"
                isLoading={isLoading}
                fullWidth
                variant="primary"
                className="py-3 text-base font-medium"
              >
                Enviar Correo de Recuperación
              </Button>
            </form>

            {/* Additional info */}
            <div className="mt-6 text-center text-sm text-gray-500">
              <p>
                ¿Recordaste tu contraseña?{' '}
                <Link
                  href="/auth"
                  className="text-blue-600 hover:text-blue-800 font-medium transition"
                >
                  Volver al login
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>El enlace de recuperación expirará en 1 hora por seguridad.</p>
          <p className="mt-2 font-medium text-gray-400">Desarrollado por David TC</p>
        </div>
      </div>

      {/* Modal profesional */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        size="sm"
      >
        <div className={`text-center p-6 rounded-t-lg ${
          modalData.type === 'success' 
            ? 'bg-gradient-to-br from-green-50 to-emerald-50' 
            : modalData.type === 'error'
            ? 'bg-gradient-to-br from-red-50 to-pink-50'
            : 'bg-gradient-to-br from-blue-50 to-indigo-50'
        }`}>
          <div className="text-6xl mb-3">
            {modalData.type === 'success' ? '✅' : modalData.type === 'error' ? '❌' : 'ℹ️'}
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {modalData.title}
          </h3>
        </div>
        
        <div className="p-6">
          <p className="text-gray-600 text-center whitespace-pre-line leading-relaxed">
            {modalData.message}
          </p>
          
          <Button
            onClick={() => setShowModal(false)}
            fullWidth
            variant={modalData.type === 'success' ? 'success' : modalData.type === 'error' ? 'danger' : 'primary'}
            className="mt-6"
          >
            Entendido
          </Button>
        </div>
      </Modal>
    </div>
  );
}