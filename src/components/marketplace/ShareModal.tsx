/**
 * ============================================================================
 * FILE: ShareModal.tsx
 * ============================================================================
 * @description Modal profesional de compartir productos en redes sociales
 *              (WhatsApp, Telegram, Facebook, Messenger y Copiar Enlace).
 * @module Components/Marketplace
 */

'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';

type ShareModalProps = {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    title: string;
    price: number;
    image_url?: string | null;
  } | null;
};

export default function ShareModal({ isOpen, onClose, product }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  if (!product) return null;

  const productUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/marketplace/product/${product.id}` 
    : `https://marketplace.vercel.app/marketplace/product/${product.id}`;

  const shareText = `¡Mira este producto en Marketplace! 🛍️\n${product.title} - $${product.price.toLocaleString('es-AR')}`;

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(productUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const shareOptions = [
    {
      name: 'WhatsApp',
      icon: '🟢',
      color: 'bg-emerald-500 hover:bg-emerald-600 text-white',
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + '\n' + productUrl)}`,
    },
    {
      name: 'Telegram',
      icon: '✈️',
      color: 'bg-sky-500 hover:bg-sky-600 text-white',
      url: `https://t.me/share/url?url=${encodeURIComponent(productUrl)}&text=${encodeURIComponent(shareText)}`,
    },
    {
      name: 'Facebook',
      icon: '📘',
      color: 'bg-blue-600 hover:bg-blue-700 text-white',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`,
    },
    {
      name: 'Messenger',
      icon: '💬',
      color: 'bg-indigo-600 hover:bg-indigo-700 text-white',
      url: `https://www.facebook.com/dialog/send?link=${encodeURIComponent(productUrl)}&app_id=291494419107518&redirect_uri=${encodeURIComponent(productUrl)}`,
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="p-6">
        <div className="flex items-center justify-between pb-3.5 border-b border-gray-100 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📤</span>
            <h3 className="text-base font-bold text-gray-900">Compartir producto</h3>
          </div>
        </div>

        {/* Resumen del producto */}
        <div className="bg-gray-50 p-3 rounded-xl mb-4 border border-gray-200/80 flex items-center gap-3">
          {product.image_url ? (
            <img src={product.image_url} alt={product.title} className="w-11 h-11 object-cover rounded-lg flex-shrink-0" />
          ) : (
            <div className="w-11 h-11 bg-gray-200 rounded-lg flex items-center justify-center text-lg flex-shrink-0">📦</div>
          )}
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-gray-900 truncate">{product.title}</p>
            <p className="text-xs text-blue-600 font-extrabold">${product.price.toLocaleString('es-AR')}</p>
          </div>
        </div>

        {/* Redes Sociales */}
        <div className="grid grid-cols-2 gap-2.5 mb-5">
          {shareOptions.map((opt) => (
            <a
              key={opt.name}
              href={opt.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition shadow-xs ${opt.color}`}
            >
              <span>{opt.icon}</span>
              <span>{opt.name}</span>
            </a>
          ))}
        </div>

        {/* Copiar Enlace Directo */}
        <div className="pt-3 border-t border-gray-100">
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Enlace directo:</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={productUrl}
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-700 font-mono truncate focus:outline-none"
            />
            <button
              type="button"
              onClick={handleCopyLink}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition flex-shrink-0 flex items-center gap-1 ${
                copied ? 'bg-emerald-600 text-white' : 'bg-gray-900 text-white hover:bg-gray-800'
              }`}
            >
              {copied ? '✓ Copiado' : '📋 Copiar'}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
