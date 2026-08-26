/**
 * ============================================================================
 * FILE: useEditProductForm.ts
 * ============================================================================
 * 
 * @description Custom Hook para controlar el formulario de edición de un producto
 *              existente (SOLID / SRP).
 * 
 * @module Features/Products/Hooks/useEditProductForm
 * ============================================================================
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useCategories } from '@/features/categories/hooks/useCategories';

export function useEditProductForm(productId: string) {
  const router = useRouter();
  const { categories } = useCategories({ level: 1 });

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [locationName, setLocationName] = useState('Barracas, Buenos Aires');
  const [categoryId, setCategoryId] = useState('');
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (productId) {
      loadProduct();
    }
  }, [productId]);

  const loadProduct = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/auth');
      return;
    }

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();

    if (error || !data) {
      console.error('Error cargando producto para edición:', error);
      router.push('/dashboard/products');
      return;
    }

    setTitle(data.title || '');
    setDescription(data.description || '');
    setPrice(data.price ? String(data.price) : '');
    setStock(data.stock ? String(data.stock) : '');
    setLocationName(data.location_name || 'Barracas, Buenos Aires');
    setCategoryId(data.category_id || '');
    setExistingImages(data.image_urls || []);
    setLoading(false);
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const numericPrice = parseFloat(price) || 0;
      const numericStock = parseInt(stock, 10) || 0;

      const { error } = await supabase
        .from('products')
        .update({
          title,
          description,
          price: numericPrice,
          stock: numericStock,
          category_id: categoryId || null,
          location_name: locationName,
        })
        .eq('id', productId);

      if (!error) {
        router.push('/dashboard/products');
      }
    } catch (err) {
      console.error('Error actualizando producto:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return {
    title,
    setTitle,
    description,
    setDescription,
    price,
    setPrice,
    stock,
    setStock,
    locationName,
    setLocationName,
    categoryId,
    setCategoryId,
    categories,
    existingImages,
    loading,
    submitting,
    handleUpdateProduct,
    router,
  };
}
