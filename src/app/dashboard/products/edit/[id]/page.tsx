/**
 * ============================================================================
 * FILE: page.tsx (dashboard/products/edit/[id])
 * ============================================================================
 * 
 * @description Vista de Edición de Producto Existente.
 *              Refactorizado bajo Clean Architecture y SOLID:
 *              - Lógica de formulario en `useEditProductForm`
 *              - Vista limpia y orquestada (< 120 líneas)
 * 
 * @module Presentation/Pages/Dashboard/Products/Edit
 * ============================================================================
 */

'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { useEditProductForm } from '@/features/products/hooks/useEditProductForm';

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;

  const form = useEditProductForm(productId);

  if (form.loading) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center">
        <p className="text-gray-500 font-bold text-sm">Cargando datos del producto para editar...</p>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 max-w-4xl mx-auto space-y-6 text-gray-900 dark:text-slate-100">
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-slate-100">
            Editar Publicación
          </h1>
          <p className="text-xs text-gray-500 font-medium mt-1">
            Modifica el precio, stock, descripción o categoría de tu producto.
          </p>
        </div>
        <Link href="/dashboard/products" className="text-xs font-bold text-blue-600 hover:underline">
          ← Volver a Mis Productos
        </Link>
      </div>

      <form onSubmit={form.handleUpdateProduct} className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-gray-200/90 dark:border-slate-800 shadow-2xs space-y-6">
        <div>
          <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700 dark:text-slate-300 mb-1">
            Título del Producto
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => form.setTitle(e.target.value)}
            className="w-full p-3 text-xs border border-gray-300 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-slate-100 font-medium"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700 dark:text-slate-300 mb-1">
              Precio ($ CLP)
            </label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => form.setPrice(e.target.value)}
              className="w-full p-3 text-xs border border-gray-300 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-slate-100 font-bold"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700 dark:text-slate-300 mb-1">
              Stock Disponible
            </label>
            <input
              type="number"
              value={form.stock}
              onChange={(e) => form.setStock(e.target.value)}
              className="w-full p-3 text-xs border border-gray-300 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-slate-100 font-bold"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700 dark:text-slate-300 mb-1">
            Categoría
          </label>
          <select
            value={form.categoryId}
            onChange={(e) => form.setCategoryId(e.target.value)}
            className="w-full p-3 text-xs border border-gray-300 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-slate-100 font-bold"
          >
            <option value="">Selecciona una categoría</option>
            {form.categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700 dark:text-slate-300 mb-1">
            Descripción del Vendedor
          </label>
          <textarea
            value={form.description}
            onChange={(e) => form.setDescription(e.target.value)}
            rows={5}
            className="w-full p-3 text-xs border border-gray-300 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-slate-100 font-medium"
          />
        </div>

        <div className="flex gap-4 pt-4 border-t border-gray-100 dark:border-slate-800">
          <Link
            href="/dashboard/products"
            className="w-1/2 py-3 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 rounded-xl text-xs font-bold text-center"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={form.submitting}
            className="w-1/2 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition shadow-xs disabled:opacity-50"
          >
            {form.submitting ? 'Guardando Cambios...' : 'Guardar Cambios'}
          </button>
        </div>
      </form>
    </div>
  );
}