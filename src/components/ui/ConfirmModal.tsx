/**
 * ============================================================================
 * FILE: ConfirmModal.tsx
 * ============================================================================
 * 
 * @description Modal de confirmación para acciones destructivas.
 *              Componente reutilizable para confirmar eliminaciones, etc.
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
 * - @/components/ui/Modal.tsx
 * - @/components/ui/Button.tsx
 * 
 * @exports
 * - ConfirmModal (default)
 * 
 * @example
 * ```tsx
 * <ConfirmModal
 *   isOpen={isOpen}
 *   title="¿Eliminar?"
 *   message="Esta acción no se puede deshacer"
 *   onConfirm={handleConfirm}
 *   onCancel={handleCancel}
 * />
 * ```
 * 
 * ============================================================================
 */

'use client';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
        <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
          >
            Sí, eliminar
          </button>
        </div>
      </div>
    </div>
  );
}