'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function NewProductPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [locationName, setLocationName] = useState('Barracas, Buenos Aires');
  const [categoryId, setCategoryId] = useState('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [isTrustedSeller, setIsTrustedSeller] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({ title: '', message: '', type: 'success' as 'success' | 'info' });
  const [currencySymbol, setCurrencySymbol] = useState('$');
  const [thousandsSep, setThousandsSep] = useState('.');
  const [loadingGeo, setLoadingGeo] = useState(true);
  const [priceError, setPriceError] = useState('');
  const [stockError, setStockError] = useState('');
  const router = useRouter();

  useEffect(() => {
    loadData();
    detectUserCurrency();
  }, []);

  // Detectar moneda y formato automáticamente
  const detectUserCurrency = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      if (data.country_code && data.currency) {
        const currencySymbols: Record<string, string> = {
          'ARS': '$',
          'USD': '$',
          'EUR': '€',
          'BRL': 'R$',
          'CLP': '$',
          'COP': '$',
          'PEN': 'S/',
          'UYU': '$U',
          'MXN': '$',
          'GBP': '£',
        };
        
        const thousandsSeparators: Record<string, string> = {
          'AR': '.',
          'CL': '.',
          'UY': '.',
          'ES': '.',
          'DE': '.',
          'MX': ',',
          'US': ',',
          'CO': '.',
          'PE': ',',
          'BR': '.',
          'GB': ',',
        };
        
        setCurrencySymbol(currencySymbols[data.currency] || data.currency);
        setThousandsSep(thousandsSeparators[data.country_code] || '.');
        setLoadingGeo(false);
        return;
      }
    } catch (error) {
      console.log('No se pudo detectar por IP');
    }

    // Fallback: Usar locale del navegador
    const locale = navigator.language || 'es-AR';
    const country = locale.split('-')[1] || 'AR';
    
    const thousandsSeparators: Record<string, string> = {
      'AR': '.',
      'CL': '.',
      'UY': '.',
      'ES': '.',
      'MX': ',',
      'US': ',',
      'CO': '.',
      'PE': ',',
      'BR': '.',
    };
    
    setCurrencySymbol('$');
    setThousandsSep(thousandsSeparators[country] || '.');
    setLoadingGeo(false);
  };

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/auth');
      return;
    }
    setUserId(user.id);

    const { data: profile } = await supabase
      .from('profiles')
      .select('is_trusted_seller, approved_products_count')
      .eq('id', user.id)
      .single();
    
    setIsTrustedSeller(profile?.is_trusted_seller || false);

    const { data: cats } = await supabase
      .from('categories')
      .select('id, name')
      .eq('level', 1)
      .order('name');
    setCategories(cats || []);
  };

  const showModalMessage = (title: string, message: string, type: 'success' | 'info' = 'success') => {
    setModalData({ title, message, type });
    setShowModal(true);
  };

  // Formatear número con separador de miles
  const formatNumber = (value: string): string => {
    const numericValue = value.replace(/\D/g, '');
    if (!numericValue) return '';
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSep);
  };

  // Obtener valor numérico limpio
  const getNumericValue = (value: string): number => {
    const clean = value.replace(/\D/g, '');
    return parseInt(clean, 10) || 0;
  };

  // Mientras escribe: formatear inmediatamente pero permitir backspace
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    
    // Extraer solo números
    const numericValue = rawValue.replace(/\D/g, '');
    
    if (!numericValue) {
      setPrice('');
      setPriceError('');
      return;
    }
    
    // Aplicar formato inmediatamente
    const formatted = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSep);
    setPrice(formatted);
    setPriceError('');
  };

  const handleStockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    
    // Extraer solo números
    const numericValue = rawValue.replace(/\D/g, '');
    
    if (!numericValue) {
      setStock('');
      setStockError('');
      return;
    }
    
    // Aplicar formato inmediatamente
    const formatted = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSep);
    setStock(formatted);
    setStockError('');
  };

  // Al perder el foco: asegurar formato correcto
  const handlePriceBlur = () => {
    if (price) {
      const numericValue = price.replace(/\D/g, '');
      if (numericValue) {
        const formatted = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSep);
        setPrice(formatted);
      }
    }
  };

  const handleStockBlur = () => {
    if (stock) {
      const numericValue = stock.replace(/\D/g, '');
      if (numericValue) {
        const formatted = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSep);
        setStock(formatted);
      }
    }
  };

  // Al enfocar: mantener formato visible
  const handlePriceFocus = () => {
    // No hacer nada, mantener el formato visible
  };

  const handleStockFocus = () => {
    // No hacer nada, mantener el formato visible
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    const numericPrice = getNumericValue(price);
    const numericStock = getNumericValue(stock);

    if (isNaN(numericPrice) || numericPrice <= 0) {
      showModalMessage('Precio inválido', 'El precio debe ser mayor a 0', 'info');
      return;
    }

    if (isNaN(numericStock) || numericStock < 0) {
      showModalMessage('Stock inválido', 'El stock no puede ser negativo', 'info');
      return;
    }

    setUploading(true);

    let imageUrls: string[] = [];

    if (imageFiles.length > 0) {
      const uploadPromises = imageFiles.map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(`${userId}/${fileName}`, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from('product-images')
          .getPublicUrl(`${userId}/${fileName}`);

        return data.publicUrl;
      });

      try {
        imageUrls = await Promise.all(uploadPromises);
      } catch (error: any) {
        showModalMessage('Error al subir imágenes', error.message, 'info');
        setUploading(false);
        return;
      }
    }

    const productStatus = isTrustedSeller ? 'approved' : 'pending';

    const { data: product, error: dbError } = await supabase
      .from('products')
      .insert({
        seller_id: userId,
        title,
        description,
        price: numericPrice,
        stock: numericStock,
        category_id: categoryId || null,
        image_urls: imageUrls,
        status: productStatus,
        is_deleted: false,
        location_name: locationName || 'Barracas, Buenos Aires',
      })
      .select()
      .single();

    if (dbError) {
      showModalMessage('Error al crear producto', dbError.message, 'info');
    } else {
      const { data: currentProfile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (currentProfile && currentProfile.role === 'buyer') {
        await supabase
          .from('profiles')
          .update({ role: 'seller' })
          .eq('id', userId);
      }

      const formattedPrice = `${currencySymbol} ${formatNumber(numericPrice.toString())}`;

      if (productStatus === 'pending') {
        showModalMessage(
          'Producto enviado a revisión',
          'Nuestro equipo revisará tu producto en menos de 24 horas.\n\nRecibirás una notificación cuando sea aprobado y publicado en el marketplace.\n\nEstado actual: Pendiente de aprobación'
        );
      } else {
        showModalMessage(
          'Producto publicado exitosamente',
          `Tu producto ya está visible en el marketplace.\n\nPrecio: ${formattedPrice}\nEstado: Publicado`
        );
      }

      setTimeout(() => {
        setShowModal(false);
        router.push('/dashboard/products');
      }, 4000);
    }

    setUploading(false);
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Nuevo Producto</h1>
        <p className="text-gray-600 mt-1">
          {!isTrustedSeller && 'Tu producto será revisado por nuestro equipo antes de publicarse.'}
        </p>
        {loadingGeo ? (
          <p className="text-xs text-gray-400 mt-2">🌍 Detectando tu ubicación y moneda...</p>
        ) : (
          <p className="text-xs text-green-600 mt-2 font-medium">
            ✓ Moneda configurada: {currencySymbol} (separador: {thousandsSep === '.' ? 'punto' : 'coma'})
          </p>
        )}
      </div>

      <form onSubmit={handleAddProduct} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Título del producto *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Ej: Zapatillas deportivas Nike"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción *
          </label>
          <textarea
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Describe tu producto..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            📍 Barrio / Localidad de publicación *
          </label>
          <input
            type="text"
            required
            value={locationName}
            onChange={(e) => setLocationName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Ej: Barracas, Buenos Aires / Palermo, CABA / Quilmes, GBA"
          />
          <p className="text-xs text-gray-400 mt-1">
            Especifica el barrio o localidad exacta (ej. Barracas, Palermo, Recoleta, Quilmes).
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Precio *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                {currencySymbol}
              </span>
              <input
                type="text"
                inputMode="numeric"
                required
                value={price}
                onChange={handlePriceChange}
                onBlur={handlePriceBlur}
                onFocus={handlePriceFocus}
                className={`w-full p-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  priceError ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0"
              />
            </div>
            {priceError && (
              <p className="text-xs text-red-500 mt-1">{priceError}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Separador de miles: {thousandsSep === '.' ? 'punto (.)' : 'coma (,)'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stock * (unidades)
            </label>
            <input
              type="text"
              inputMode="numeric"
              required
              value={stock}
              onChange={handleStockChange}
              onBlur={handleStockBlur}
              onFocus={handleStockFocus}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                stockError ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="0"
            />
            {stockError && (
              <p className="text-xs text-red-500 mt-1">{stockError}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">Solo números enteros</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Categoría
          </label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Sin categoría</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Imágenes
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setImageFiles(Array.from(e.target.files || []))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Puedes seleccionar múltiples imágenes
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={uploading || !!priceError || !!stockError}
            className={`flex-1 py-3 rounded-lg font-bold text-white transition ${
              uploading || !!priceError || !!stockError
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {uploading ? 'Subiendo...' : 'Publicar Producto'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 rounded-lg font-bold text-gray-700 bg-gray-200 hover:bg-gray-300 transition"
          >
            Cancelar
          </button>
        </div>
      </form>

      {/* Modal profesional */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className={`p-6 text-center ${
              modalData.type === 'success' 
                ? 'bg-gradient-to-br from-green-50 to-emerald-50' 
                : 'bg-gradient-to-br from-blue-50 to-indigo-50'
            }`}>
              <div className="text-6xl mb-3">
                {modalData.type === 'success' ? '✅' : 'ℹ️'}
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                {modalData.title}
              </h3>
            </div>
            
            <div className="p-6">
              <p className="text-gray-600 text-center whitespace-pre-line leading-relaxed">
                {modalData.message}
              </p>
              
              <button
                onClick={() => {
                  setShowModal(false);
                  router.push('/dashboard/products');
                }}
                className={`w-full mt-6 py-3 rounded-lg font-semibold text-white transition ${
                  modalData.type === 'success'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}