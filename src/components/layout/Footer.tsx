/**
 * ============================================================================
 * FILE: Footer.tsx
 * ============================================================================
 * @description Pie de página profesional sobrio y moderno con créditos.
 * @module Components/Layout/Footer
 */

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-gray-200/80 py-6 mt-12 text-gray-500 text-xs font-medium">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Créditos en la parte inferior izquierda */}
        <div className="flex items-center gap-2 text-gray-500 font-semibold tracking-wide">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
          <span>Powered by <strong className="text-gray-900 font-extrabold">David TC</strong></span>
        </div>

        {/* Copyright */}
        <div className="flex items-center gap-4 text-gray-400">
          <span>&copy; {new Date().getFullYear()} Marketplace SaaS. Todos los derechos reservados.</span>
        </div>
      </div>
    </footer>
  );
}
