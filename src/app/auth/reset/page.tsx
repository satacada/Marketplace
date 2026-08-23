/**
 * ============================================================================
 * FILE: page.tsx
 * ============================================================================
 * 
 * @description Página de restablecimiento de contraseña desde enlace de correo.
 *              Maneja el token de Supabase para actualizar la contraseña.
 * 
 * @module Presentation/Pages/Auth/Reset
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
 * - ResetPage (default)
 * 
 * ============================================================================
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';

export default function ResetPage() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({ 
    title: '', 
    message: '', 
    type: 'success' as 'success' | 'info' | 'error' 
  });
  const [localError, setLocalError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const { updatePassword } = useAuth();

  useEffect(() => {
    // Obtener el email de los parámetros de la URL si está disponible
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setUserEmail(emailParam);
    }
  }, [searchParams]);

  const showModalMessage = (title: string, message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setModalData({ title, message, type });
    setShowModal(true);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (!validatePassword(newPassword)) {
      setLocalError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (newPassword !== confirmPassword) {
      setLocalError('Las contraseñas no coinciden');
      return;
    }

    setIsProcessing(true);

    try {
      const result = await updatePassword(newPassword);
      if (result.success) {
        showModalMessage(
          '¡Contraseña restablecida!',
          'Tu contraseña ha sido actualizada exitosamente.\n\nAhora puedes iniciar sesión con tu nueva contraseña.',
          'success'
        );
        // Redirigir al login después de un breve momento
        setTimeout(() => {
          router.push(`/auth?email=${encodeURIComponent(userEmail)}`);
        }, 2000);
      } else {
        setLocalError(result.error || 'Error al restablecer contraseña');
      }
    } catch (error: any) {
      setLocalError(error.message || 'Error al restablecer contraseña');
    } finally {
      setIsProcessing(false);
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
            {userEmail && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <span className="font-medium">Usuario:</span> {userEmail}
                </p>
              </div>
            )}

            <p className="text-gray-600 mb-6 text-sm">
              Ingresa tu nueva contraseña para completar el restablecimiento.
            </p>

            <form onSubmit={handleResetPassword} className="space-y-5">
              {/* Nueva contraseña field */}
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Nueva contraseña
                </label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type="password"
                    required
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    fullWidth
                    className="pl-10"
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    🔒
                  </div>
                </div>
                <p className="mt-1 text-xs text-gray-500">Mínimo 6 caracteres</p>
              </div>

              {/* Confirmar contraseña field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar nueva contraseña
                </label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type="password"
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    fullWidth
                    className="pl-10"
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    🔒
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
                isLoading={isProcessing}
                fullWidth
                variant="primary"
                className="py-3 text-base font-medium"
              >
                {isProcessing ? 'Procesando...' : 'Restablecer Contraseña'}
              </Button>
            </form>

            {/* Additional info */}
            <div className="mt-6 text-center text-sm text-gray-500">
              <p>
                ¿Recordaste tu contraseña?{' '}
                <button
                  type="button"
                  onClick={() => router.push('/auth')}
                  className="text-blue-600 hover:text-blue-800 font-medium transition"
                >
                  Volver al login
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>Por seguridad, asegúrate de usar una contraseña fuerte.</p>
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