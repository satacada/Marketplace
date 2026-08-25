'use client';

import { useEffect, useState, useRef, use } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Category = {
  id: string;
  name: string;
  parent_id: string | null;
  level: number;
};

type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  category_id: string;
  image_urls: string[];
};

// Next.js 15/16 requiere que params sea una Promise en rutas dinámicas
export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;

  const [categories, setCategories] = useState<Category[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [locationName, setLocationName] = useState('Barracas, Buenos Aires');
  const [categoryId, setCategoryId] = useState<string>('');
  const [categoryName, setCategoryName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    checkUserAndLoadData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const checkUserAndLoadData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/auth');
      return;
    }
    setUserId(user.id);
    await Promise.all([fetchCategories(), fetchProduct(user.id)]);
  };

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('id, name, parent_id, level')
      .order('level')
      .order('name');
    if (data) setCategories(data);
  };

  const fetchProduct = async (sellerId: string) => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .eq('seller_id', sellerId)
      .single();

    if (error || !data) {
      alert('Producto no encontrado o no tienes permiso');
      router.push('/dashboard/products');
      return;
    }

    setProduct(data);
    setTitle(data.title);
    setDescription(data.description || '');
    setPrice(data.price.toString());
    setStock(data.stock.toString());
    setLocationName(data.location_name || 'Barracas, Buenos Aires');
    setCategoryId(data.category_id || '');
    setExistingImages(data.image_urls || []);

    const { data: catData } = await supabase
      .from('categories')
      .select('name')
      .eq('id', data.category_id)
      .single();
    
    if (catData) setCategoryName(catData.name);
  };

  // Función de geolocalización por GPS para el vendedor
  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      alert('Tu navegador no soporta geolocalización por GPS.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
          const data = await res.json();
          const city = data.address?.city || data.address?.town || data.address?.suburb || data.address?.county || 'Buenos Aires';
          const state = data.address?.state || 'BA';
          const detectedName = `${city}, ${state}`;
          setLocationName(detectedName);
          alert(`Ubicación GPS detectada: ${detectedName}`);
        } catch {
          setLocationName('Palermo, CABA');
        }
      },
      () => alert('No se pudo obtener la posición GPS. Escribe manualmente tu ubicación.')
    );
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !categoryId) return alert('Faltan datos requeridos');

    setLoading(true);
    const imageUrls = [...existingImages];

    for (const file of files) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) {
        setLoading(false);
        return alert('Error al subir imagen: ' + uploadError.message);
      }

      const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(filePath);
      imageUrls.push(urlData.publicUrl);
    }

    if (!locationName || locationName.trim().length < 3) {
      setLoading(false);
      return alert('⚠️ Debes ingresar una ubicación válida (ej: Palermo, CABA) para poder guardar los cambios del producto.');
    }

    const { error: dbError } = await supabase
      .from('products')
      .update({ 
        title, 
        description, 
        price: parseFloat(price), 
        stock: parseInt(stock), 
        category_id: categoryId, 
        image_urls: imageUrls,
        location_name: locationName || 'Barracas, Buenos Aires' 
      })
      .eq('id', productId)
      .eq('seller_id', userId);

    setLoading(false);

    if (dbError) {
      alert('Error al actualizar: ' + dbError.message);
    } else {
      alert('Producto actualizado exitosamente');
      router.push('/dashboard/products');
    }
  };

  const handleRemoveImage = (imageUrl: string) => {
    setExistingImages(existingImages.filter(url => url !== imageUrl));
  };

  const filteredCategories = categories.filter(cat => cat.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 10);

  const handleCategorySelect = (category: Category) => {
    setCategoryId(category.id);
    setCategoryName(category.name);
    setSearchQuery('');
    setShowSuggestions(false);
  };

  const getParentCategoryName = (parentId: string | null) => {
    if (!parentId) return null;
    return categories.find(c => c.id === parentId)?.name || null;
  };

  if (!product) return <div className="p-8 text-center">Cargando...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="/dashboard/products" className="text-indigo-600 hover:text-indigo-700 text-sm">← Volver a Mis Productos</Link>
        <h1 className="text-3xl font-bold text-gray-900 mt-2">Editar Producto</h1>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
        <form onSubmit={handleUpdateProduct} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título:</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción:</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} required className="w-full p-3 border border-gray-300 rounded-lg h-32 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          {/* CAMPO DE UBICACIÓN VALIDADA CON GPS & GOOGLE MAPS */}
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700">
                📍 Ubicación de la Publicación (Barrio / Ciudad) *
              </label>
              <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                Obligatorio
              </span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                required
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                className="flex-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium bg-white"
                placeholder="Ej: Palermo, CABA o Barracas, BA"
              />
              <button
                type="button"
                onClick={handleDetectGPS}
                className="px-3.5 py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5 flex-shrink-0 cursor-pointer shadow-2xs"
                title="Detectar ubicación por GPS"
              >
                <span>📍 Usar mi GPS</span>
              </button>
            </div>

            {locationName && locationName.trim().length >= 3 && (
              <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-gray-200 text-xs mt-1">
                <span className="text-gray-700 font-medium truncate max-w-[240px] sm:max-w-xs">
                  📍 Ubicación registrada: <strong className="text-gray-900 font-bold">{locationName}</strong>
                </span>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationName)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 font-extrabold flex items-center gap-1 hover:underline text-xs"
                >
                  <span>Ver en Google Maps</span>
                  <span className="text-[10px]">↗</span>
                </a>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Precio ($):</label>
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock:</label>
              <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} required className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoría:</label>
            <div className="relative" ref={searchRef}>
              <input type="text" placeholder="Busca una categoría..." value={searchQuery || categoryName} onChange={(e) => { setSearchQuery(e.target.value); setCategoryName(''); setCategoryId(''); setShowSuggestions(true); }} onFocus={() => { if (searchQuery) setShowSuggestions(true); }} required className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              {showSuggestions && (searchQuery || categoryName) && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                  {filteredCategories.length === 0 ? (
                    <div className="px-4 py-2 text-gray-500 text-sm">No se encontraron categorías</div>
                  ) : (
                    filteredCategories.map((cat) => (
                      <button key={cat.id} type="button" onClick={() => handleCategorySelect(cat)} className="w-full px-4 py-2 text-left hover:bg-indigo-50 transition-colors border-b border-gray-100 last:border-b-0">
                        <div className="font-medium text-gray-900">{cat.name}</div>
                        {getParentCategoryName(cat.parent_id) && <div className="text-xs text-gray-500">{getParentCategoryName(cat.parent_id)}</div>}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Imágenes actuales:</label>
            <div className="grid grid-cols-3 gap-4 mb-4">
              {existingImages.map((url, index) => (
                <div key={index} className="relative group">
                  <img src={url} alt={`Imagen ${index + 1}`} className="w-full h-32 object-cover rounded-lg border border-gray-300" />
                  <button type="button" onClick={() => handleRemoveImage(url)} className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                </div>
              ))}
            </div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Agregar nuevas imágenes (Máx 3 en total):</label>
            <input type="file" accept="image/*" multiple onChange={(e) => { if (e.target.files) { const maxFiles = 3 - existingImages.length; setFiles(Array.from(e.target.files).slice(0, maxFiles)); } }} className="w-full p-3 border border-gray-300 rounded-lg" />
          </div>

          <div className="flex gap-4 pt-4">
            <button type="submit" disabled={loading} className={`flex-1 py-3 rounded-lg font-medium text-white transition ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
              {loading ? 'Actualizando...' : 'Actualizar Producto'}
            </button>
            <Link href="/dashboard/products" className="flex-1 py-3 rounded-lg font-medium text-center bg-gray-200 text-gray-700 hover:bg-gray-300 transition">Cancelar</Link>
          </div>
        </form>
      </div>
    </div>
  );
}