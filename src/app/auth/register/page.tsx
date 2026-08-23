/**
 * ============================================================================
 * FILE: page.tsx
 * ============================================================================
 * 
 * @description Página de registro de usuarios.
 *              Formulario de registro con validación.
 * 
 * @module Presentation/Pages/Auth/Register
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
 * - RegisterPage (default)
 * 
 * ============================================================================
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({ 
    title: '', 
    message: '', 
    type: 'success' as 'success' | 'info' | 'error' 
  });
  const [localError, setLocalError] = useState('');
  
  const router = useRouter();
  const { register, isLoading } = useAuth();

  const showModalMessage = (title: string, message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setModalData({ title, message, type });
    setShowModal(true);
  };

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (!validateEmail(email)) {
      setLocalError('Por favor ingresa un correo electrónico válido');
      return;
    }

    if (!validatePassword(password)) {
      setLocalError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (password !== confirmPassword) {
      setLocalError('Las contraseñas no coinciden');
      return;
    }

    const result = await register({ email, password });
    if (result.success) {
      showModalMessage(
        '¡Registro exitoso!',
        'Te hemos enviado un correo de confirmación.\n\nPor favor revisa tu bandeja de entrada (y la carpeta de spam) para activar tu cuenta.\n\nUna vez confirmado, podrás iniciar sesión y comenzar a comprar o vender.',
        'success'
      );
      // Limpiar formulario
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } else {
      setLocalError(result.error || 'Error al registrar usuario');
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
              <div className="text-4xl mb-2">🛒</div>
              <h1 className="text-2xl font-bold text-white">Marketplace SaaS</h1>
              <p className="text-blue-100 text-sm mt-1">Multi-Tenant Platform</p>
            </div>
          </div>

          {/* Contenido del formulario */}
          <div className="px-8 py-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Crear Cuenta
            </h2>

            <form onSubmit={handleRegister} className="space-y-5">
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

              {/* Password field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    className="pl-10"
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    🔒
                  </div>
                </div>
                <p className="mt-1 text-xs text-gray-500">Mínimo 6 caracteres</p>
              </div>

              {/* Confirm password field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar contraseña
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
                isLoading={isLoading}
                fullWidth
                variant="primary"
                className="py-3 text-base font-medium"
              >
                Crear Cuenta
              </Button>
            </form>

            {/* Additional info */}
            <div className="mt-6 text-center text-sm text-gray-500">
              <p>
                ¿Ya tienes cuenta?{' '}
                <Link
                  href="/auth"
                  className="text-blue-600 hover:text-blue-800 font-medium transition"
                >
                  Inicia sesión
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>Al continuar, aceptas nuestros Términos de Servicio y Política de Privacidad</p>
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