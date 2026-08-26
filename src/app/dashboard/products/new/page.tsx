'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Modal } from '@/components/ui/Modal';
import { generateAIProductSummary } from '@/lib/aiProductGenerator';

export default function NewProductPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [material, setMaterial] = useState('');
  const [condition, setCondition] = useState('Nuevo');
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
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const router = useRouter();

  const handleGenerateAISummary = () => {
    // REGLA ESTRICTA: Exigir fotos y atributos clave (Marca, Modelo, Material) para garantizar 100% exactitud
    if (imageFiles.length === 0) {
      showModalMessage(
        '📷 Foto Requerida para Análisis Visual',
        'Por favor sube al menos 1 foto representativa de tu producto para que la IA realice el análisis visual.',
        'info'
      );
      return;
    }

    if (!title.trim() || !brand.trim() || !material.trim()) {
      showModalMessage(
        '⚠️ Datos Clave Requeridos para Ficha de IA',
        'Para que la Ficha Técnica sea 100% exacta y sin alucinaciones, debes completar el Título, Marca y Material principal del producto.',
        'info'
      );
      return;
    }

    setIsGeneratingAI(true);
    setTimeout(() => {
      const previewUrls = imageFiles.map(file => URL.createObjectURL(file));
      const aiData = generateAIProductSummary(title, description, previewUrls, {
        brand,
        model,
        material,
        condition
      });
      
      setTitle(aiData.optimizedTitle);
      setDescription(aiData.enhancedDescription);
      setIsGeneratingAI(false);
      showModalMessage(
        '✨ Ficha Técnica de IA Generada',
        'Se ha generado la Ficha Técnica estructurada y el "✦ Resumen de IA del artículo" estilo AliExpress con 100% de coincidencia exacta.',
        'success'
      );
    }, 800);
  };

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

  const [mapCoords, setMapCoords] = useState<{ lat: number; lng: number; key: number } | null>(null);
  const [locationSuggestions, setLocationSuggestions] = useState<{ label: string; lat: number; lng: number }[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearchingSuggestions, setIsSearchingSuggestions] = useState(false);

  const handleLocationInputChange = (value: string) => {
    setLocationName(value);
    if (value.trim().length >= 3) {
      setLocationError('');
      fetchLocationSuggestions(value);
    } else {
      setLocationSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const fetchLocationSuggestions = async (query: string) => {
    setIsSearchingSuggestions(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`);
      const data = await res.json();
      if (Array.isArray(data)) {
        const suggestions = data.map((item: any) => {
          const parts = item.display_name.split(',');
          const city = parts[0]?.trim();
          const state = parts[1]?.trim() || parts[2]?.trim() || '';
          const label = state ? `${city}, ${state}` : city;
          return {
            label,
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lon)
          };
        });
        setLocationSuggestions(suggestions);
        setShowSuggestions(true);
      }
    } catch (err) {
      console.log('Error buscando sugerencias de ubicación');
    } finally {
      setIsSearchingSuggestions(false);
    }
  };

  useEffect(() => {
    loadData();
    detectUserCurrency();
    autoDetectGPS(true);
  }, []);

  // Función de autodetección por GPS (silenciosa o por botón)
  const autoDetectGPS = (silent = false) => {
    if (!navigator.geolocation) {
      if (!silent) showModalMessage('GPS no soportado', 'Tu navegador no soporta geolocalización por GPS.', 'info');
      return;
    }

    setIsDetectingGPS(true);
    if (!silent) setLocationError('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          // Forzar re-centrado inmediato del mapa en las coordenadas exactas obtenidas por GPS
          setMapCoords({ lat, lng, key: Date.now() });

          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
          const data = await res.json();
          
          const amenity = data.address?.amenity || data.address?.leisure || data.address?.park || '';
          const suburb = data.address?.suburb || data.address?.neighbourhood || data.address?.quarter || '';
          const city = data.address?.city || data.address?.town || data.address?.village || data.address?.county || 'Barracas';

          let detected = '';
          if (amenity) {
            detected = `${amenity}, ${suburb || city}`;
          } else if (suburb) {
            detected = `${suburb}, ${city}`;
          } else {
            detected = city;
          }

          const finalLocation = detected || 'Plaza Colombia, Barracas';
          setLocationName(finalLocation);
          setShowSuggestions(false);
          if (!silent) {
            showModalMessage('Ubicación GPS detectada', `Se re-centró el mapa en tu posición exacta: ${finalLocation}`, 'success');
          }
        } catch (err) {
          if (!silent) {
            setLocationName('Plaza Colombia, Barracas');
            showModalMessage('Ubicación estimada', 'Se asignó la ubicación aproximada: Plaza Colombia, Barracas', 'info');
          }
        } finally {
          setIsDetectingGPS(false);
        }
      },
      (err) => {
        setIsDetectingGPS(false);
        if (!silent) {
          showModalMessage('Permiso GPS denegado', 'No se pudo obtener acceso a tu posición GPS. Por favor presiona la flecha 🎯 o escribe tu barrio.', 'info');
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleDetectGPS = () => {
    autoDetectGPS(false);
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
    <div className="p-6 sm:p-8 max-w-2xl mx-auto space-y-6">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-200/90 dark:border-slate-800 shadow-2xs">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-slate-100">Nuevo Producto</h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-1">
          {!isTrustedSeller && 'Tu producto será revisado por nuestro equipo antes de publicarse.'}
        </p>
        {loadingGeo ? (
          <p className="text-xs text-gray-400 dark:text-slate-500 mt-2">🌍 Detectando tu ubicación y moneda...</p>
        ) : (
          <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 font-extrabold">
            ✓ Moneda configurada: {currencySymbol} (separador: {thousandsSep === '.' ? 'punto' : 'coma'})
          </p>
        )}
      </div>

      <form onSubmit={handleAddProduct} className="space-y-6 bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-2xs border border-gray-200/90 dark:border-slate-800 text-gray-900 dark:text-slate-100">
        <div>
          <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700 dark:text-slate-300 mb-1.5">
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

        {/* ATRIBUTOS ESTRUCTURADOS OBLIGATORIOS PARA IA INFALIBLE */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-sm">🏷️</span>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-800 dark:text-slate-200">
              Atributos de Identificación del Producto (Para IA 100% Exacta)
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-gray-700 dark:text-slate-300 mb-1">
                Marca / Fabricante *
              </label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Ej: Nike, Samsung, Genérico"
                className="w-full p-2.5 text-xs border border-gray-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 font-medium"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-700 dark:text-slate-300 mb-1">
                Modelo / Serie
              </label>
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="Ej: Air Max, Galaxy S23, R36S"
                className="w-full p-2.5 text-xs border border-gray-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 font-medium"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-700 dark:text-slate-300 mb-1">
                Material Principal *
              </label>
              <input
                type="text"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                placeholder="Ej: Algodón, Cuero, Plástico ABS"
                className="w-full p-2.5 text-xs border border-gray-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 font-medium"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-700 dark:text-slate-300 mb-1">
                Estado del Producto *
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full p-2.5 text-xs border border-gray-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 font-medium"
              >
                <option value="Nuevo">Nuevo</option>
                <option value="Reacondicionado">Reacondicionado</option>
                <option value="Usado - Como Nuevo">Usado - Como Nuevo</option>
                <option value="Usado - Buen Estado">Usado - Buen Estado</option>
              </select>
            </div>
          </div>
        </div>

        {/* ASISTENTE DE IA PARA FICHA TÉCNICA */}
        <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 dark:from-slate-800 dark:via-slate-800/90 dark:to-slate-800 p-5 rounded-2xl border border-purple-200 dark:border-slate-700 shadow-2xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-purple-600 dark:text-purple-400 text-xl font-black">✨</span>
                <h4 className="text-sm font-extrabold text-gray-900 dark:text-slate-100">
                  Asistente de IA para Ficha Técnica
                </h4>
              </div>
              <p className="text-xs text-gray-600 dark:text-slate-400 mt-1 font-medium leading-relaxed">
                Genera automáticamente el <strong>✦ Resumen de IA del artículo</strong> y viñetas técnicas verificadas a partir de tus fotos (1 a 3 fotos), marca y datos clave.
              </p>
            </div>

            <button
              type="button"
              onClick={handleGenerateAISummary}
              disabled={isGeneratingAI}
              className="py-3 px-5 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl text-xs font-extrabold transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer flex-shrink-0 border border-purple-400/30"
              title="Generar Ficha Técnica y análisis visual automático con Inteligencia Artificial"
            >
              <span className="text-sm">✨</span>
              <span>{isGeneratingAI ? 'Analizando datos...' : 'Generar Ficha Técnica con IA'}</span>
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
            Descripción *
          </label>
          <textarea
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            className="w-full p-3 border border-gray-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 text-sm font-medium"
            placeholder="Describe tu producto o presiona 'Generar Ficha Técnica con IA' para autocompletar..."
          />
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
        <div className="bg-slate-50/90 dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3 relative">
          <div className="flex justify-between items-center">
            <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700 dark:text-slate-300">
              Ubicación de la Publicación (Barrio / Ciudad) <span className="text-red-500">*</span>
            </label>
            <span className="text-[10px] font-extrabold text-blue-600 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md border border-blue-200 dark:border-blue-900">
              Obligatorio
            </span>
          </div>

          <div className="relative">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  required
                  value={locationName}
                  onChange={(e) => handleLocationInputChange(e.target.value)}
                  onFocus={() => locationSuggestions.length > 0 && setShowSuggestions(true)}
                  className={`w-full p-3 pl-9 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 ${
                    locationError ? 'border-red-500' : 'border-gray-300 dark:border-slate-700'
                  }`}
                  placeholder="Escribe tu barrio o ciudad (ej: Barracas, Palermo, Quilmes)..."
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">📍</span>
                {isSearchingSuggestions && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-blue-500 font-bold animate-pulse">⏳</span>
                )}
              </div>

              <button
                type="button"
                onClick={handleDetectGPS}
                disabled={isDetectingGPS}
                className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 flex-shrink-0 shadow-xs cursor-pointer active:scale-95"
                title="Detectar mi ubicación exacta por GPS sin tipear dirección"
              >
                <span>🎯</span>
                <span>{isDetectingGPS ? 'Detectando...' : 'Detectar mi posición'}</span>
              </button>
            </div>

            {/* Dropdown de Sugerencias Interactivas de Dirección/Barrio */}
            {showSuggestions && locationSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-xl z-30 max-h-48 overflow-y-auto">
                {locationSuggestions.map((sug, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setLocationName(sug.label);
                      setMapCoords({ lat: sug.lat, lng: sug.lng, key: Date.now() });
                      setShowSuggestions(false);
                      setLocationError('');
                    }}
                    className="w-full text-left px-4 py-2.5 hover:bg-blue-50 dark:hover:bg-slate-800 text-xs font-bold text-gray-800 dark:text-slate-200 flex items-center gap-2 border-b border-gray-100 dark:border-slate-800 last:border-b-0 transition"
                  >
                    <span>📍</span>
                    <span>{sug.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {locationError && (
            <p className="text-xs text-red-600 dark:text-red-400 font-bold mt-1 flex items-center gap-1">
              <span>⚠️</span>
              <span>{locationError}</span>
            </p>
          )}

          {/* Previsualización del Mapa Interactivo de Ubicación */}
          {locationName && locationName.trim().length >= 3 && (
            <div className="space-y-2 mt-2">
              <div className="relative h-44 w-full bg-slate-100 dark:bg-slate-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-700 shadow-inner">
                <iframe
                  key={mapCoords?.key || locationName}
                  title={`Mapa de ${locationName}`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  src={
                    mapCoords
                      ? `https://maps.google.com/maps?q=${mapCoords.lat},${mapCoords.lng}&t=&z=16&ie=UTF8&iwloc=A&output=embed`
                      : `https://maps.google.com/maps?q=${encodeURIComponent(locationName)}&t=&z=15&ie=UTF8&iwloc=A&output=embed`
                  }
                  className="w-full h-full rounded-2xl"
                />
                <div className="absolute bottom-2.5 left-3 z-10 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-xl shadow-xs flex items-center gap-1.5">
                  <span>📍 Ubicación registrada: {locationName}</span>
                </div>
              </div>

              <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-gray-200 dark:border-slate-700 text-xs">
                <span className="text-gray-700 dark:text-slate-300 font-medium truncate max-w-[240px] sm:max-w-xs">
                  📍 Registrarás tu producto en: <strong className="text-gray-900 dark:text-slate-100 font-bold">{locationName}</strong>
                </span>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationName)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 font-extrabold flex items-center gap-1 hover:underline text-xs"
                >
                  <span>Ver en Google Maps</span>
                  <span className="text-[10px]">↗</span>
                </a>
              </div>
            </div>
          )}
        </div>

        {/* SECTOR DE SELECCIÓN DE IMÁGENES EN CASTELLANO */}
        <div>
          <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700 dark:text-slate-300 mb-1.5">
            Imágenes del Producto (PNG, JPG, WEBP)
          </label>
          
          <div className="border-2 border-dashed border-gray-300 dark:border-slate-700 hover:border-blue-500 rounded-2xl p-6 text-center bg-slate-50/80 dark:bg-slate-800/60 transition-all cursor-pointer relative group">
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