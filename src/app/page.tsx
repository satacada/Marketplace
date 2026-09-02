/**
 * ============================================================================
 * FILE: page.tsx (app/page.tsx)
 * ============================================================================
 * 
 * @description Ruta Raíz del Sistema. Redirige automáticamente al usuario
 *              al Catálogo Público de Marketplace (/marketplace).
 * 
 * @module Presentation/Pages/Root
 * ============================================================================
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/marketplace');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Marketplace SaaS</h1>
        <p className="text-gray-600">Redirigiendo al Catálogo del Marketplace...</p>
      </div>
    </div>
  );
}