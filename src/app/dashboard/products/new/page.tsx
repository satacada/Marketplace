/**
 * ============================================================================
 * FILE: page.tsx (dashboard/products/new)
 * ============================================================================
 * 
 * @description Asistente de Creación de Publicaciones estilo Facebook Marketplace.
 *              Soporta Selector de Tipo de Publicación, Formulario Adaptativo,
 *              Asistente de IA y Vista Previa en Tiempo Real (Live Preview).
 * 
 * @module Presentation/Pages/Dashboard/Products/New
 * ============================================================================
 */

'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { generateAIProductSummary } from '@/lib/aiProductGenerator';
import ProductLivePreview from '@/components/marketplace/ProductLivePreview';

type PublicationType = 'none' | 'article' | 'vehicle' | 'property';

export default function NewProductPage() {
  const [publicationType, setPublicationType] = useState<PublicationType>('none');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('1');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [material, setMaterial] = useState('');
  const [condition, setCondition] = useState('Nuevo');
  const [locationName, setLocationName] = useState('Barracas, Buenos Aires');
  const [categoryId, setCategoryId] = useState('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [userStoreName, setUserStoreName] = useState('Vendedor en Marketplace');
  const [isTrustedSeller, setIsTrustedSeller] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState<{
    title: string;
    message: string;
    type: 'success' | 'info';
    shouldRedirect?: boolean;
  }>({ title: '', message: '', type: 'success', shouldRedirect: false });
  const [currencySymbol, setCurrencySymbol] = useState('$');
  const [thousandsSep, setThousandsSep] = useState('.');
  const [loadingGeo, setLoadingGeo] = useState(true);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const router = useRouter();

  // Campos adaptativos para Vehículos y Propiedades
  const [vehicleYear, setVehicleYear] = useState('');
  const [vehicleMileage, setVehicleMileage] = useState('');
  const [vehicleFuel, setVehicleFuel] = useState('Nafta');
  const [propertyOperation, setPropertyOperation] = useState('Venta');
  const [propertyRooms, setPropertyRooms] = useState('');
  const [propertyArea, setPropertyArea] = useState('');

  // Estados para búsqueda de ubicación y mapa
  const [mapCoords, setMapCoords] = useState<{ lat: number; lng: number; key: number } | null>(null);
  const [locationSuggestions, setLocationSuggestions] = useState<{ label: string; lat: number; lng: number }[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearchingSuggestions, setIsSearchingSuggestions] = useState(false);
  const [isDetectingGPS, setIsDetectingGPS] = useState(false);

  useEffect(() => {
    loadData();
    detectUserCurrency();
    autoDetectGPS(true);
  }, []);

  const handleLocationInputChange = (value: string) => {
    setLocationName(value);
    if (value.trim().length >= 3) {
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
    } catch {
      console.log('Error buscando sugerencias de ubicación');
    } finally {
      setIsSearchingSuggestions(false);
    }
  };

  const autoDetectGPS = (silent = false) => {
    if (!navigator.geolocation) {
      if (!silent) showModalMessage('GPS no soportado', 'Tu navegador no soporta geolocalización por GPS.', 'info');
      return;
    }

    setIsDetectingGPS(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
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
        } catch {
          if (!silent) {
            setLocationName('Plaza Colombia, Barracas');
            showModalMessage('Ubicación estimada', 'Se asignó la ubicación aproximada: Plaza Colombia, Barracas', 'info');
          }
        } finally {
          setIsDetectingGPS(false);
        }
      },
      () => {
        setIsDetectingGPS(false);
        if (!silent) {
          showModalMessage('Permiso GPS denegado', 'No pudimos acceder a tu GPS. Por favor escribe tu ubicación manualmente.', 'info');
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
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
      .select('store_name, is_trusted_seller')
      .eq('id', user.id)
      .single();
    
    if (profile?.store_name) {
      setUserStoreName(profile.store_name);
    }
    setIsTrustedSeller(profile?.is_trusted_seller || false);

    const { data: cats } = await supabase
      .from('categories')
      .select('id, name')
      .eq('level', 1)
      .order('name');
    setCategories(cats || []);
  };

  const detectUserCurrency = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      if (data.currency) {
        setCurrencySymbol(data.currency === 'ARS' || data.currency === 'USD' || data.currency === 'CLP' ? '$' : data.currency);
        setThousandsSep(data.country_code === 'MX' || data.country_code === 'US' ? ',' : '.');
      }
    } catch {
      setCurrencySymbol('$');
      setThousandsSep('.');
    } finally {
      setLoadingGeo(false);
    }
  };

  const showModalMessage = (
    title: string,
    message: string,
    type: 'success' | 'info' = 'success',
    shouldRedirect: boolean = false
  ) => {
    setModalData({ title, message, type, shouldRedirect });
    setShowModal(true);
  };

  // Carga de imágenes con previsualización instantánea
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const filesArray = Array.from(e.target.files);
    const updatedFiles = [...imageFiles, ...filesArray].slice(0, 10);
    setImageFiles(updatedFiles);

    const updatedPreviews = updatedFiles.map(file => URL.createObjectURL(file));
    setImagePreviews(updatedPreviews);
  };

  const handleRemoveImage = (index: number) => {
    const updatedFiles = imageFiles.filter((_, i) => i !== index);
    setImageFiles(updatedFiles);

    const updatedPreviews = updatedFiles.map(file => URL.createObjectURL(file));
    setImagePreviews(updatedPreviews);
  };

  // Generación por IA
  const handleGenerateAISummary = () => {
    if (imageFiles.length === 0) {
      showModalMessage(
        '📷 Foto Requerida para Análisis Visual',
        'Por favor sube al menos 1 foto representativa de tu producto para que la IA realice el análisis visual.',
        'info'
      );
      return;
    }

    if (!brand.trim() || !material.trim()) {
      showModalMessage(
        '⚠️ Atributos Requeridos para Ficha de IA',
        'Para que la Ficha Técnica sea 100% exacta y sin alucinaciones, debes ingresar la Marca y Material principal.',
        'info'
      );
      return;
    }

    setIsGeneratingAI(true);
    setTimeout(() => {
      const aiData = generateAIProductSummary(title || 'Producto en Venta', description, imagePreviews, {
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
        'Se ha redactado el título optimizado y la Ficha Técnica con 100% de coincidencia exacta.',
        'success'
      );
    }, 800);
  };

  // Formato numérico
  const formatNumber = (value: string): string => {
    const numericValue = value.replace(/\D/g, '');
    if (!numericValue) return '';
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSep);
  };

  const getNumericValue = (value: string): number => {
    const clean = value.replace(/\D/g, '');
    return parseInt(clean, 10) || 0;
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = e.target.value.replace(/\D/g, '');
    setPrice(numericValue ? numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSep) : '');
  };

  // Envío del Formulario
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      showModalMessage('Inicia sesión', 'Debes estar autenticado para publicar.', 'info');
      return;
    }

    const numericPrice = getNumericValue(price);
    if (!title.trim() || numericPrice <= 0) {
      showModalMessage('Campos requeridos', 'Por favor ingresa un Título válido y un Precio mayor a 0.', 'info');
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

    // Construir descripción complementaria según tipo
    let finalDescription = description;
    if (publicationType === 'vehicle') {
      finalDescription = `🚗 VEHÍCULO EN VENTA\nAño: ${vehicleYear || 'N/D'} | Kilometraje: ${vehicleMileage || '0'} km | Combustible: ${vehicleFuel}\n\n${description}`;
    } else if (publicationType === 'property') {
      finalDescription = `🏠 PROPIEDAD EN ${propertyOperation.toUpperCase()}\nAmbientes: ${propertyRooms || '1'} | Superficie: ${propertyArea || '0'} m²\n\n${description}`;
    }

    const productStatus = isTrustedSeller ? 'approved' : 'pending';

    const { error: dbError } = await supabase
      .from('products')
      .insert({
        seller_id: userId,
        title,
        description: finalDescription,
        price: numericPrice,
        stock: getNumericValue(stock) || 1,
        category_id: categoryId || null,
        image_urls: imageUrls,
        status: productStatus,
        is_deleted: false,
        location_name: locationName || 'Barracas, Buenos Aires',
      });

    if (dbError) {
      showModalMessage('Error al crear producto', dbError.message, 'info');
    } else {
      if (productStatus === 'pending') {
        showModalMessage(
          'Publicación enviada a revisión',
          'Tu publicación se revisará en menos de 24 horas y estará visible inmediatamente al ser aprobada.',
          'success',
          true
        );
      } else {
        showModalMessage(
          '¡Producto publicado con éxito!',
          `Tu publicación ya está activa en el Marketplace.\nPrecio: ${currencySymbol} ${price}`,
          'success',
          true
        );
      }
    }

    setUploading(false);
  };

  // --------------------------------------------------------------------------
  // PASO 0: SELECTOR DE TIPO DE PUBLICACIÓN (ESTILO FACEBOOK MARKETPLACE)
  // --------------------------------------------------------------------------
  if (publicationType === 'none') {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 sm:p-8">
        <div className="max-w-4xl w-full text-center space-y-3 mb-8">
          <span className="text-4xl">🛍️</span>
          <h1 className="text-3xl font-black text-gray-900 dark:text-slate-100 tracking-tight">
            Crear publicación en Marketplace
          </h1>
          <p className="text-sm text-gray-600 dark:text-slate-400 font-medium max-w-lg mx-auto">
            Selecciona el tipo de anuncio que deseas publicar. Muestra tu artículo a miles de compradores en tu zona.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
          {/* Opción 1: Artículo en venta */}
          <button
            type="button"
            onClick={() => {
              setPublicationType('article');
              if (categories.length > 0) setCategoryId(categories[0].id);
            }}
            className="p-8 bg-white dark:bg-slate-900 rounded-3xl border-2 border-gray-200/90 dark:border-slate-800 hover:border-blue-600 dark:hover:border-blue-500 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center group cursor-pointer active:scale-95"
          >
            <div className="w-20 h-20 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center text-4xl mb-4 group-hover:scale-110 transition">
              📦
            </div>
            <h3 className="text-lg font-extrabold text-gray-900 dark:text-slate-100 group-hover:text-blue-600 transition">
              Artículo en venta
            </h3>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-2 font-medium leading-relaxed">
              Crea una sola publicación para vender electrónica, ropa, herramientas, artículos de hogar o accesorios.
            </p>
          </button>

          {/* Opción 2: Vehículo en venta */}
          <button
            type="button"
            onClick={() => setPublicationType('vehicle')}
            className="p-8 bg-white dark:bg-slate-900 rounded-3xl border-2 border-gray-200/90 dark:border-slate-800 hover:border-indigo-600 dark:hover:border-indigo-500 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center group cursor-pointer active:scale-95"
          >
            <div className="w-20 h-20 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-4xl mb-4 group-hover:scale-110 transition">
              🚗
            </div>
            <h3 className="text-lg font-extrabold text-gray-900 dark:text-slate-100 group-hover:text-indigo-600 transition">
              Vehículo en venta
            </h3>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-2 font-medium leading-relaxed">
              Publica un auto, camioneta, moto u otro tipo de vehículo especificando kilometraje y año.
            </p>
          </button>

          {/* Opción 3: Propiedad en venta o alquiler */}
          <button
            type="button"
            onClick={() => setPublicationType('property')}
            className="p-8 bg-white dark:bg-slate-900 rounded-3xl border-2 border-gray-200/90 dark:border-slate-800 hover:border-purple-600 dark:hover:border-purple-500 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center group cursor-pointer active:scale-95"
          >
            <div className="w-20 h-20 rounded-full bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 flex items-center justify-center text-4xl mb-4 group-hover:scale-110 transition">
              🏠
            </div>
            <h3 className="text-lg font-extrabold text-gray-900 dark:text-slate-100 group-hover:text-purple-600 transition">
              Propiedad en venta o alquiler
            </h3>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-2 font-medium leading-relaxed">
              Publica una casa, departamento, terreno o local comercial detallando ambientes y m².
            </p>
          </button>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // PASO 1: ASISTENTE DE CARGA (SPLIT SCREEN: FORMULARIO + VISTA PREVIA LIVE)
  // --------------------------------------------------------------------------
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      {/* Botón de navegación para regresar al selector de tipo */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-slate-800">
        <button
          type="button"
          onClick={() => setPublicationType('none')}
          className="text-xs font-extrabold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1.5 cursor-pointer"
        >
          <span>←</span>
          <span>Cambiar tipo de publicación</span>
        </button>

        <span className="text-xs font-extrabold px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full">
          {publicationType === 'article' && '📦 Artículo en venta'}
          {publicationType === 'vehicle' && '🚗 Vehículo en venta'}
          {publicationType === 'property' && '🏠 Propiedad'}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* COLUMNA IZQUIERDA: FORMULARIO DE CÓDIGO Y DATOS */}
        <form onSubmit={handleAddProduct} className="lg:col-span-7 space-y-6 bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-gray-200/90 dark:border-slate-800 text-gray-900 dark:text-slate-100">
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-slate-100">
              Crear publicación
            </h1>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 font-medium">
              Completa los datos de tu producto. A la derecha verás cómo queda en tiempo real.
            </p>
          </div>

          {/* SECCIÓN 1: FOTOS DEL PRODUCTO */}
          <div className="space-y-3 pt-2 border-t border-gray-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-800 dark:text-slate-200">
                Fotos del producto (Hasta 10 fotos) *
              </label>
              <span className="text-[11px] font-bold text-gray-400">{imageFiles.length}/10 fotos</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Dropzone para cargar fotos */}
              <label className="border-2 border-dashed border-gray-300 dark:border-slate-700 hover:border-blue-500 rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition bg-slate-50 dark:bg-slate-800/40 hover:bg-blue-50/50 aspect-square">
                <span className="text-2xl mb-1">📸</span>
                <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400">Agregar fotos</span>
                <span className="text-[10px] text-gray-400 mt-0.5">o arrastra aquí</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </label>

              {/* Previsualización de miniaturas subidas */}
              {imagePreviews.map((url, idx) => (
                <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-700 group">
                  <img src={url} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1.5 right-1.5 bg-slate-900/80 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold hover:bg-rose-600 transition"
                    title="Eliminar foto"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* SECCIÓN 2: TARJETA UNIFICADA DE ASISTENTE DE IA & ATRIBUTOS */}
          <div className="bg-gradient-to-br from-purple-50/90 via-indigo-50/80 to-blue-50/90 dark:from-slate-800 dark:via-slate-800/90 dark:to-slate-800 p-5 rounded-3xl border border-purple-200/90 dark:border-slate-700 space-y-4">
            <div className="flex items-center justify-between border-b border-purple-200/60 dark:border-slate-700 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-purple-600 dark:text-purple-400 text-xl font-black">✨</span>
                <div>
                  <h4 className="text-sm font-extrabold text-gray-900 dark:text-slate-100">
                    Asistente de IA & Atributos de Identificación
                  </h4>
                  <p className="text-[11px] text-gray-600 dark:text-slate-400 font-medium">
                    Completa los campos obligatorios para generar una Ficha Técnica 100% exacta.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-900/60 text-xs text-amber-900 dark:text-amber-200 font-medium flex items-start gap-2">
              <span className="text-base leading-none">⚠️</span>
              <p>
                <strong>Requisito para IA:</strong> Para que la IA redacte el detalle técnico exacto, debes ingresar <strong>Marca, Material y subir al menos 1 foto</strong>. Si prefieres redactar a tu manera, puedes escribir directamente en la descripción.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-extrabold text-gray-800 dark:text-slate-200 mb-1">
                  Marca / Fabricante *
                </label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="Ej: Nike, Samsung, Honda"
                  className="w-full p-2.5 text-xs border border-gray-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 font-medium focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-gray-800 dark:text-slate-200 mb-1">
                  Modelo / Serie
                </label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="Ej: Air Max, Civic, Galaxy"
                  className="w-full p-2.5 text-xs border border-gray-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 font-medium focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-gray-800 dark:text-slate-200 mb-1">
                  Material Principal *
                </label>
                <input
                  type="text"
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  placeholder="Ej: Algodón, Cuero, Aluminio"
                  className="w-full p-2.5 text-xs border border-gray-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 font-medium focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-gray-800 dark:text-slate-200 mb-1">
                  Estado del Producto *
                </label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="w-full p-2.5 text-xs border border-gray-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 font-medium focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Nuevo">Nuevo</option>
                  <option value="Reacondicionado">Reacondicionado</option>
                  <option value="Usado - Como Nuevo">Usado - Como Nuevo</option>
                  <option value="Usado - Buen Estado">Usado - Buen Estado</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-purple-200/60 dark:border-slate-700">
              <p className="text-[11px] text-gray-500 dark:text-slate-400 font-medium">
                Presiona el botón para que la IA redacte automáticamente el título y el resumen técnico.
              </p>
              <button
                type="button"
                onClick={handleGenerateAISummary}
                disabled={isGeneratingAI}
                className="py-2.5 px-5 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl text-xs font-extrabold transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer flex-shrink-0"
              >
                <span>✨</span>
                <span>{isGeneratingAI ? 'Generando por IA...' : 'Generar Ficha Técnica con IA'}</span>
              </button>
            </div>
          </div>

          {/* SECCIÓN 3: CAMPOS PRINCIPALES Y ADAPTATIVOS */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700 dark:text-slate-300 mb-1">
                Título de la publicación *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej: Zapatillas deportivas Nike Air Max talle 42"
                className="w-full p-3 text-sm border border-gray-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700 dark:text-slate-300 mb-1">
                  Precio ({currencySymbol}) *
                </label>
                <input
                  type="text"
                  required
                  value={price}
                  onChange={handlePriceChange}
                  placeholder="Ej: 25.000"
                  className="w-full p-3 text-sm border border-gray-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 font-bold"
                />
              </div>

              {publicationType === 'article' && (
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700 dark:text-slate-300 mb-1">
                    Stock disponible (unidades)
                  </label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="1"
                    className="w-full p-3 text-sm border border-gray-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 font-medium"
                  />
                </div>
              )}
            </div>

            {/* CAMPOS ESPECÍFICOS PARA VEHÍCULOS */}
            {publicationType === 'vehicle' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-indigo-50/50 dark:bg-indigo-950/30 rounded-2xl border border-indigo-200 dark:border-indigo-900">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 dark:text-slate-300 mb-1">Año</label>
                  <input
                    type="number"
                    value={vehicleYear}
                    onChange={(e) => setVehicleYear(e.target.value)}
                    placeholder="2022"
                    className="w-full p-2.5 text-xs border rounded-xl bg-white dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 dark:text-slate-300 mb-1">Kilometraje (km)</label>
                  <input
                    type="number"
                    value={vehicleMileage}
                    onChange={(e) => setVehicleMileage(e.target.value)}
                    placeholder="45000"
                    className="w-full p-2.5 text-xs border rounded-xl bg-white dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 dark:text-slate-300 mb-1">Combustible</label>
                  <select
                    value={vehicleFuel}
                    onChange={(e) => setVehicleFuel(e.target.value)}
                    className="w-full p-2.5 text-xs border rounded-xl bg-white dark:bg-slate-900 font-medium"
                  >
                    <option value="Nafta">Nafta</option>
                    <option value="Diésel">Diésel</option>
                    <option value="Híbrido">Híbrido</option>
                    <option value="Eléctrico">Eléctrico</option>
                  </select>
                </div>
              </div>
            )}

            {/* CAMPOS ESPECÍFICOS PARA PROPIEDADES */}
            {publicationType === 'property' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-purple-50/50 dark:bg-purple-950/30 rounded-2xl border border-purple-200 dark:border-purple-900">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 dark:text-slate-300 mb-1">Transacción</label>
                  <select
                    value={propertyOperation}
                    onChange={(e) => setPropertyOperation(e.target.value)}
                    className="w-full p-2.5 text-xs border rounded-xl bg-white dark:bg-slate-900 font-medium"
                  >
                    <option value="Venta">Venta</option>
                    <option value="Alquiler">Alquiler</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 dark:text-slate-300 mb-1">Ambientes</label>
                  <input
                    type="number"
                    value={propertyRooms}
                    onChange={(e) => setPropertyRooms(e.target.value)}
                    placeholder="3"
                    className="w-full p-2.5 text-xs border rounded-xl bg-white dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 dark:text-slate-300 mb-1">Superficie (m²)</label>
                  <input
                    type="number"
                    value={propertyArea}
                    onChange={(e) => setPropertyArea(e.target.value)}
                    placeholder="85"
                    className="w-full p-2.5 text-xs border rounded-xl bg-white dark:bg-slate-900"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-700 dark:text-slate-300 mb-1">
                Descripción del producto *
              </label>
              <textarea
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                className="w-full p-3 text-sm border border-gray-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 font-medium"
                placeholder="Describe tu producto libremente o presiona 'Generar Ficha Técnica con IA' para autocompletar..."
              />
            </div>
          </div>

          {/* SECCIÓN 4: UBICACIÓN DEL VENDEDOR CON MAPA E INPUT INTELIGENTE */}
          <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-gray-800 dark:text-slate-200">
                Ubicación de la publicación *
              </label>
              <button
                type="button"
                onClick={() => autoDetectGPS(false)}
                disabled={isDetectingGPS}
                className="text-xs font-extrabold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>🎯</span>
                <span>{isDetectingGPS ? 'Detectando GPS...' : 'Ubicar por GPS'}</span>
              </button>
            </div>

            <div className="relative">
              <input
                type="text"
                required
                value={locationName}
                onChange={(e) => handleLocationInputChange(e.target.value)}
                onFocus={() => locationSuggestions.length > 0 && setShowSuggestions(true)}
                placeholder="Escribe tu ciudad, barrio o dirección..."
                className="w-full p-3.5 text-xs font-extrabold border border-gray-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 shadow-2xs"
              />

              {/* Dropdown de sugerencias de autocompletado */}
              {showSuggestions && locationSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 z-30 mt-1 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden">
                  {locationSuggestions.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setLocationName(item.label);
                        setMapCoords({ lat: item.lat, lng: item.lng, key: Date.now() });
                        setShowSuggestions(false);
                      }}
                      className="w-full text-left p-3 text-xs font-bold text-gray-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 border-b border-gray-100 dark:border-slate-800/60 last:border-0 flex items-center gap-2 cursor-pointer"
                    >
                      <span>📍</span>
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mapa interactivo de vista previa centrado */}
            <div className="relative h-44 w-full rounded-2xl overflow-hidden border border-gray-200 dark:border-slate-700 shadow-2xs bg-slate-100 dark:bg-slate-800">
              <iframe
                key={mapCoords?.key || 'default-map'}
                title="Mapa de ubicación"
                width="100%"
                height="100%"
                frameBorder="0"
                src={`https://yandex.com/map-widget/v1/?ll=${mapCoords?.lng || -58.375}&pt=${mapCoords?.lng || -58.375},${mapCoords?.lat || -34.640},pm2rdm&z=14`}
                className="w-full h-full"
              />
              <div className="absolute top-2 left-2 z-10 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-extrabold px-2.5 py-1 rounded-xl flex items-center gap-1 shadow-xs">
                <span>📍 {locationName}</span>
                <span className="text-gray-400">• Ubicación aproximada</span>
              </div>
            </div>
          </div>

          {/* BOTÓN FINAL DE PUBLICACIÓN ESTILO FACEBOOK MARKETPLACE */}
          <div className="pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setPublicationType('none')}
              className="px-5 py-3 rounded-xl font-bold text-xs text-gray-700 dark:text-slate-300 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl text-sm transition shadow-md hover:shadow-lg active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {uploading ? 'Publicando...' : 'Publicar producto'}
            </button>
          </div>
        </form>

        {/* COLUMNA DERECHA: VISTA PREVIA EN TIEMPO REAL (LIVE PREVIEW) */}
        <div className="hidden lg:block lg:col-span-5">
          <ProductLivePreview
            title={title}
            price={price}
            description={description}
            brand={brand}
            model={model}
            material={material}
            condition={condition}
            locationName={locationName}
            currencySymbol={currencySymbol}
            imageUrls={imagePreviews}
            publicationType={publicationType}
            sellerName={userStoreName}
          />
        </div>
      </div>

      {/* MODAL INFORMATIVO O DE ÉXITO */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-200 dark:border-slate-800">
            <div className={`p-6 text-center ${
              modalData.type === 'success' 
                ? 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-emerald-950/60 dark:to-emerald-900/40' 
                : 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800/80'
            }`}>
              <div className="text-6xl mb-3">
                {modalData.type === 'success' ? '✅' : 'ℹ️'}
              </div>
              <h3 className="text-xl font-extrabold text-gray-900 dark:text-slate-100">
                {modalData.title}
              </h3>
            </div>
            
            <div className="p-6">
              <p className="text-gray-600 dark:text-slate-300 text-center text-xs whitespace-pre-line leading-relaxed font-medium">
                {modalData.message}
              </p>
              
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  if (modalData.shouldRedirect) {
                    router.push('/dashboard/products');
                  }
                }}
                className={`w-full mt-6 py-3 rounded-xl font-extrabold text-xs text-white transition shadow-sm cursor-pointer ${
                  modalData.type === 'success'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-blue-600 hover:bg-blue-700'
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