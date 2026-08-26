/**
 * ============================================================================
 * FILE: Modal.tsx
 * ============================================================================
 * 
 * @description Componente de modal reutilizable con backdrop y animación.
 *              Soporta diferentes tamaños y personalización de contenido.
 * 
 * @module Presentation/Components/UI
 * 
 * @author System
 * @created 2026-07-16
 * 
 * @dependencies
 * - react
 * 
 * @related-files
 * - @/components/ui/Button.tsx
 * - @/components/ui/ConfirmModal.tsx
 * 
 * @exports
 * - Modal (default)
 * 
 * @example
 * ```tsx
 * <Modal isOpen={isOpen} onClose={handleClose} title="Confirmación">
 *   <p>¿Estás seguro?</p>
 * </Modal>
 * ```
 * 
 * ============================================================================
 */

import React, { useEffect } from 'react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
}

const sizeStyles = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div
          className={`
            relative bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-gray-900 dark:text-slate-100 rounded-3xl shadow-2xl w-full
            ${sizeStyles[size]}
            transform transition-all overflow-hidden
          `}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/40">
              {title && (
                <h3 className="text-xl font-extrabold text-gray-900 dark:text-slate-100">
                  {title}
                </h3>
              )}
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          )}

          {/* Content */}
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
