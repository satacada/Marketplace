/**
 * ============================================================================
 * FILE: page.tsx (dashboard/products)
 * ============================================================================
 * 
 * @description Página de Gestión de Productos del Vendedor (/dashboard/products).
 *              Refactorizado bajo Clean Architecture y SOLID:
 *              - Lógica de la lista en `useSellerProductsList`
 *              - Vista limpia y orquestada (< 120 líneas)
 * 
 * @module Presentation/Pages/Dashboard/Products
 * ============================================================================
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { Modal } from '@/components/ui/Modal';
import { useSellerProductsList } from '@/features/products/hooks/useSellerProductsList';

export default function ProductsPage() {
  const p = useSellerProductsList();

  if (p.authLoading || p.productsLoading) {
    return (
      <div className="p-8 max-w-6xl mx-auto text-center">
        <p className="text-gray-500 font-bold text-sm">Cargando tus productos...</p>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto space-y-6 text-gray-900 dark:text-slate-100">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-200/90 dark:border-slate-800 shadow-2xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-slate-100">
            Mis Productos ({p.displayProducts.length})
          </h1>
          <p className="text-xs text-gray-500 font-medium mt-1">
            Gestiona tus publicaciones, modifica el stock o edita los detalles.
          </p>
        </div>
        <Link
          href="/dashboard/products/new"
          className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black transition shadow-xs flex items-center gap-1.5"
        >
          <span>➕</span>
          <span>Publicar Nuevo Producto</span>
        </Link>
      </div>

      {p.displayProducts.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl text-center border border-gray-200 dark:border-slate-800 space-y-3">
          <span className="text-5xl">📦</span>
          <p className="text-gray-700 dark:text-slate-200 font-extrabold text-sm">
            Aún no tienes productos publicados.
          </p>
          <Link
            href="/dashboard/products/new"
            className="inline-block px-6 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-extrabold"
          >
            Publicar mi primer producto
          </Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200/90 dark:border-slate-800 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 dark:border-slate-800 text-gray-400 font-extrabold uppercase bg-gray-50/50 dark:bg-slate-800/40">
                  <th className="p-4">Producto</th>
                  <th className="p-4">Categoría</th>
                  <th className="p-4">Precio</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800 font-medium">
                {p.displayProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/40 transition">
                    <td className="p-4 flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 dark:bg-slate-800 rounded-xl overflow-hidden flex-shrink-0">
                        {prod.image_urls?.[0] ? (
                          <img src={prod.image_urls[0]} alt={prod.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">Sin foto</div>
                        )}
                      </div>
                      <span className="font-extrabold text-gray-900 dark:text-slate-100">{prod.title}</span>
                    </td>
                    <td className="p-4 font-bold text-gray-500">{prod.categories?.name || 'General'}</td>
                    <td className="p-4 font-black text-blue-600">${prod.price?.toLocaleString('es-CL')}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${prod.stock > 0 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
                        {prod.stock > 0 ? `${prod.stock} u.` : 'Sin Stock'}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => p.handleToggleStock(prod.id, prod.stock)}
                        className="px-2.5 py-1 text-[11px] font-bold border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-gray-100"
                      >
                        {prod.stock > 0 ? 'Pausar Stock' : 'Activar Stock'}
                      </button>
                      <Link
                        href={`/dashboard/products/edit/${prod.id}`}
                        className="px-2.5 py-1 text-[11px] font-bold bg-blue-50 text-blue-600 rounded-lg border border-blue-100"
                      >
                        Editar
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          p.setProductToDelete(prod.id);
                          p.setShowDeleteModal(true);
                        }}
                        className="px-2.5 py-1 text-[11px] font-bold bg-rose-50 text-rose-600 rounded-lg border border-rose-100"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {p.showDeleteModal && (
        <Modal
          isOpen={p.showDeleteModal}
          onClose={() => p.setShowDeleteModal(false)}
          title="Eliminar Producto"
        >
          <div className="space-y-4 pt-2">
            <p className="text-xs text-gray-600 dark:text-slate-300 font-medium">
              ¿Estás seguro de que deseas eliminar esta publicación? Esta acción cambiará el estado del producto a inactivo.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => p.setShowDeleteModal(false)}
                className="w-1/2 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-xs font-bold"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={p.handleDeleteConfirm}
                className="w-1/2 py-2.5 bg-rose-600 text-white rounded-xl text-xs font-extrabold"
              >
                Sí, Eliminar
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}