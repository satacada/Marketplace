/**
 * ============================================================================
 * FILE: ReportModal.tsx
 * ============================================================================
 * @description Modal de moderación estilo Facebook Marketplace para reportar
 *              publicaciones o vendedores por motivos de seguridad o fraude.
 * @module Components/Marketplace
 */

'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

type ReportTargetType = 'product' | 'seller';

type ReportModalProps = {
  isOpen: boolean;
  onClose: () => void;
  targetType: ReportTargetType;
  targetTitle: string; // Título del producto o Nombre de la Tienda
  onSubmitReport: (reason: string, details: string) => Promise<void>;
};

const REPORT_REASONS_PRODUCT = [
  'Sospecha de Estafa o Fraude',
  'Información Falsa o Engañosa',
  'Producto Prohibido o Ilegal',
  'Precio Falso o Incorrecto',
  'Spam o Publicación Duplicada',
  'Contenido Inapropiado u Ofensivo'
];

const REPORT_REASONS_SELLER = [
  'Vendedor Sospechoso / Posible Cuenta Falsa',
  'Incumplimiento en Envíos o Entregas',
  'Intento de Estafa o Cobro Fuera de la Plataforma',
  'Conducta Inapropiada u Ofensiva',
  'Venta de Productos Falsificados'
];

export default function ReportModal({
  isOpen,
  onClose,
  targetType,
  targetTitle,
  onSubmitReport
}: ReportModalProps) {
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [details, setDetails] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const reasons = targetType === 'product' ? REPORT_REASONS_PRODUCT : REPORT_REASONS_SELLER;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReason) return;

    setIsSubmitting(true);
    try {
      await onSubmitReport(selectedReason, details);
      setSubmitted(true);
    } catch (err) {
      console.error('Error al enviar reporte:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseAll = () => {
    setSubmitted(false);
    setSelectedReason('');
    setDetails('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleCloseAll} size="md">
      {submitted ? (
        <div className="p-6 text-center">
          <div className="text-5xl mb-3">🛡️</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Reporte Enviado</h3>
          <p className="text-xs text-gray-600 mb-6 leading-relaxed">
            Gracias por ayudar a mantener segura la comunidad de Marketplace. Nuestro equipo de moderación revisará este caso a la brevedad.
          </p>
          <Button onClick={handleCloseAll} fullWidth variant="primary">
            Entendido
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex items-center gap-2 pb-4 border-b border-gray-100 mb-5">
            <span className="text-2xl text-rose-600">🚩</span>
            <div>
              <h3 className="text-base font-bold text-gray-900">
                {targetType === 'product' ? 'Reportar Publicación' : 'Reportar Vendedor'}
              </h3>
              <p className="text-xs text-gray-500 truncate max-w-xs">{targetTitle}</p>
            </div>
          </div>

          <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
            Selecciona el motivo principal del reporte
          </p>

          <div className="space-y-2 mb-5">
            {reasons.map((reason) => (
              <label
                key={reason}
                className={`flex items-center gap-3 p-3 rounded-xl border text-xs font-medium cursor-pointer transition ${
                  selectedReason === reason
                    ? 'bg-rose-50/70 border-rose-300 text-rose-900 ring-2 ring-rose-200'
                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <input
                  type="radio"
                  name="reportReason"
                  value={reason}
                  checked={selectedReason === reason}
                  onChange={() => setSelectedReason(reason)}
                  className="text-rose-600 focus:ring-rose-500"
                />
                <span>{reason}</span>
              </label>
            ))}
          </div>

          <div className="mb-5">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
              Detalles adicionales (Opcional)
            </label>
            <textarea
              rows={3}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Explica brevemente lo sucedido..."
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-medium placeholder-gray-400"
            />
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCloseAll}
              fullWidth
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="danger"
              fullWidth
              disabled={!selectedReason || isSubmitting}
              isLoading={isSubmitting}
            >
              Enviar Reporte
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
