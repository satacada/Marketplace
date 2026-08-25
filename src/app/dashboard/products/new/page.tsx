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
  const [locationError, setLocationError] = useState('');
  const [isDetectingGPS, setIsDetectingGPS] = useState(false);
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

  // Función de geolocalización por GPS para el vendedor
  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      showModalMessage('GPS no soportado', 'Tu navegador no soporta geolocalización por GPS. Por favor ingresa manualmente el nombre exacto de tu ciudad/barrio.', 'info');
      return;
    }

    setIsDetectingGPS(true);
    setLocationError('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          // Reverse geocoding via OpenStreetMap / Nominatim API
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
          const data = await res.json();
          
          const city = data.address?.city || data.address?.town || data.address?.suburb || data.address?.neighbourhood || data.address?.county || 'Buenos Aires';
          const state = data.address?.state || 'BA';
          const detectedName = `${city}, ${state}`;

          setLocationName(detectedName);
          showModalMessage('Ubicación GPS detectada', `Se estableció tu ubicación exacta: ${detectedName}`, 'success');
        } catch (err) {
          setLocationName('Palermo, CABA');
          showModalMessage('Ubicación estimada', 'Se asignó la ubicación aproximada: Palermo, CABA', 'info');
        } finally {
          setIsDetectingGPS(false);
        }
      },
      (err) => {
        setIsDetectingGPS(false);
        showModalMessage('Permiso GPS denegado', 'No se pudo obtener acceso a tu posición GPS. Por favor escribe el nombre exacto de tu barrio/ciudad en el campo.', 'info');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    // VALIDACIÓN MANDATORIA DE UBICACIÓN
    if (!locationName || locationName.trim().length < 3) {
      setLocationError('Debes ingresar el nombre exacto de tu ubicación (ej: Palermo, CABA) o presionar "📍 Usar mi GPS"');
      showModalMessage(
        'Ubicación requerida',
        'No es posible publicar el producto sin ingresar una ubicación válida. Por favor escribe tu barrio/ciudad o utiliza el botón "📍 Usar mi GPS".',
        'info'
      );
      return;
    }

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

        {/* CAMPO DE UBICACIÓN VALIDADA CON GPS & GOOGLE MAPS */}
        <div className="bg-gray-50/90 p-4 rounded-2xl border border-gray-200 space-y-2">
          <div className="flex justify-between items-center">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700">
              Ubicación de la Publicación (Barrio / Ciudad) <span className="text-red-500">*</span>
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
              onChange={(e) => {
                setLocationName(e.target.value);
                if (e.target.value.trim().length >= 3) setLocationError('');
              }}
              className={`flex-1 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium bg-white ${
                locationError ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ej: Palermo, CABA o Barracas, Buenos Aires"
            />
            <button
              type="button"
              onClick={handleDetectGPS}
              disabled={isDetectingGPS}
              className="px-3.5 py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5 flex-shrink-0 shadow-2xs cursor-pointer"
              title="Detectar mi ciudad o barrio actual por GPS"
            >
              <span>{isDetectingGPS ? '⏳ Buscando...' : '📍 Usar mi GPS'}</span>
            </button>
          </div>

          {locationError && (
            <p className="text-xs text-red-600 font-bold mt-1 flex items-center gap-1">
              <span>⚠️</span>
              <span>{locationError}</span>
            </p>
          )}

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

        {/* SECTOR DE SELECCIÓN DE IMÁGENES EN CASTELLANO */}
        <div>
          <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700 mb-1.5">
            Imágenes del Producto (PNG, JPG, WEBP)
          </label>
          
          <div className="border-2 border-dashed border-gray-300 hover:border-blue-500 rounded-2xl p-6 text-center bg-gray-50/80 transition-all cursor-pointer relative group">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setImageFiles(Array.from(e.target.files || []))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              id="product-image-upload"
            />
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shadow-2xs">
                🖼️
              </div>
              <div>
                <p className="text-sm font-extrabold text-blue-600 group-hover:text-blue-700">
                  Seleccionar imágenes de tu equipo...
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Haz clic aquí o arrastra tus fotos (puedes elegir varias)
                </p>
              </div>
            </div>
          </div>

          {/* Previsualización de imágenes seleccionadas */}
          {imageFiles.length > 0 && (
            <div className="mt-3 bg-white p-3 rounded-2xl border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-extrabold text-gray-800">
                  📷 {imageFiles.length} {imageFiles.length === 1 ? 'foto seleccionada' : 'fotos seleccionadas'}:
                </p>
                <button
                  type="button"
                  onClick={() => setImageFiles([])}
                  className="text-red-600 hover:text-red-800 font-extrabold text-[11px]"
                >
                  Quitar todas
                </button>
              </div>
              <div className="flex gap-2.5 overflow-x-auto pb-1">
                {imageFiles.map((file, idx) => (
                  <div key={idx} className="relative group/img flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border border-gray-200 bg-gray-100 shadow-2xs">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Vista previa ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setImageFiles(imageFiles.filter((_, i) => i !== idx))}
                      className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold shadow-xs transition"
                      title="Eliminar esta foto"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
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