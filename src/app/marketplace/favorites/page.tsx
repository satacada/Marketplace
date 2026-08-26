/**
 * ============================================================================
 * FILE: page.tsx (app/marketplace/favorites)
 * ============================================================================
 * 
 * @description Vista de Productos Guardados en Mis Favoritos.
 *              Refactorizado bajo Clean Architecture y SOLID:
 *              - Lógica de favoritos en `useFavoritesPage`
 *              - Vista limpia (< 100 líneas)
 * 
 * @module Presentation/Pages/Marketplace/Favorites
 * ============================================================================
 */

'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useFavoritesPage } from '@/features/favorites/hooks/useFavoritesPage';

export default function FavoritesPage() {
  const fav = useFavoritesPage();

  if (fav.loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 p-8 flex items-center justify-center">
        <p className="text-gray-500 font-bold text-sm">Cargando tus favoritos...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 transition-colors duration-200">
      <Header />

      <main className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-200/90 dark:border-slate-800 shadow-2xs">
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-slate-100">
            Mis Favoritos ({fav.favorites.length})
          </h1>
          <p className="text-xs text-gray-500 font-medium mt-1">
            Productos guardados para comprar más tarde.
          </p>
        </div>

        {fav.favorites.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl text-center border border-gray-200 dark:border-slate-800 space-y-3">
            <span className="text-5xl">❤️</span>
            <p className="text-gray-600 dark:text-slate-300 font-bold text-sm">
              No tienes productos guardados en favoritos.
            </p>
            <Link href="/marketplace" className="inline-block px-6 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-extrabold">
              Explorar Marketplace
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {fav.favorites.map((item) => {
              const p = item.products;
              if (!p) return null;
              return (
                <div key={item.id} className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-gray-200/90 dark:border-slate-800 shadow-2xs flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
                  <div className="flex gap-4 items-center">
                    <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-2xl overflow-hidden flex-shrink-0">
                      {p.image_urls?.[0] ? (
                        <img src={p.image_urls[0]} alt={p.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">Sin foto</div>
                      )}
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                        {p.categories?.name || 'Producto'}
                      </span>
                      <h3 className="font-extrabold text-gray-900 dark:text-slate-100 text-sm mt-1">{p.title}</h3>
                      <p className="text-blue-600 dark:text-blue-400 font-black text-sm mt-0.5">${p.price?.toLocaleString('es-CL')}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full lg:w-auto">
                    <button
                      type="button"
                      onClick={() => fav.handleAddToCart(p)}
                      className="w-full lg:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold shadow-xs"
                    >
                      🛒 Agregar al Carrito
                    </button>
                    <button
                      type="button"
                      onClick={() => fav.handleRemoveFavorite(item.id)}
                      className="px-4 py-2.5 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-bold"
                    >
                      Quitar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}