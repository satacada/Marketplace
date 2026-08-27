/**
 * ============================================================================
 * FILE: useProductForm.ts
 * ============================================================================
 * 
 * @description Custom Hook para la gestión de estado y lógica de negocio
 *              del formulario de creación de productos (SOLID - Single Responsibility).
 * 
 * @module Features/Products/Hooks/useProductForm
 * ============================================================================
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { generateAIProductSummary, fetchLiveWebProductSpecs } from '@/lib/aiProductGenerator';

export type PublicationType = 'none' | 'article' | 'vehicle' | 'property';

export function useProductForm() {
  const router = useRouter();

  // Estados principales de la publicación
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

  // Viñetas técnicas generadas por IA
  const [aiSummaryBullets, setAiSummaryBullets] = useState<{ title: string; description: string }[]>([]);

  // Campos adaptativos
  const [vehicleYear, setVehicleYear] = useState('');
  const [vehicleMileage, setVehicleMileage] = useState('');
  const [vehicleFuel, setVehicleFuel] = useState('Nafta');
  const [propertyOperation, setPropertyOperation] = useState('Venta');
  const [propertyRooms, setPropertyRooms] = useState('');
  const [propertyArea, setPropertyArea] = useState('');

  // Geolocalización y mapa
  const [mapCoords, setMapCoords] = useState<{ lat: number; lng: number; key: number } | null>(null);
  const [locationSuggestions, setLocationSuggestions] = useState<{ label: string; lat: number; lng: number }[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearchingSuggestions, setIsSearchingSuggestions] = useState(false);
  const [isDetectingGPS, setIsDetectingGPS] = useState(false);
  const [currencySymbol, setCurrencySymbol] = useState('$');
  const [thousandsSep, setThousandsSep] = useState('.');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  // Modal informativo
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState<{
    title: string;
    message: string;
    type: 'success' | 'info';
    shouldRedirect?: boolean;
  }>({ title: '', message: '', type: 'success', shouldRedirect: false });

  useEffect(() => {
    loadData();
    detectUserCurrency();
    autoDetectGPS(true);
  }, []);

  // Auto-detección en tiempo real de Categoría a partir del texto ingresado
  useEffect(() => {
    if (categories.length === 0) return;
    const fullText = `${title} ${brand} ${model} ${description}`.toLowerCase();
    if (!fullText.trim()) return;

    const rules = [
      {
        keywords: ['zapatilla', 'zapatillas', 'calzado', 'nike', 'adidas', 'jordan', 'puma', 'reebok', 'ropa', 'campera', 'remera', 'pantalon', 'talle', 'zapato', 'botas', 'ojotas'],
        names: ['Moda y Calzado', 'Calzado', 'Moda', 'Ropa']
      },
      {
        keywords: ['celular', 'smartphone', 'samsung', 'iphone', 'xiaomi', 'motorola', 'tv', 'televisor', 'smart tv', 'laptop', 'notebook', 'pc', 'computadora', 'consola', 'playstation', 'ps5', 'xbox', 'nintendo', 'audifonos', 'auriculares'],
        names: ['Electrónica', 'Tecnología']
      },
      {
        keywords: ['auto', 'camioneta', 'moto', 'motocicleta', 'honda', 'toyota', 'ford', 'chevrolet', 'volkswagen', 'fiat', 'peugeot', 'renault', 'vehiculo', 'km'],
        names: ['Vehículos', 'Autos', 'Motos']
      },
      {
        keywords: ['departamento', 'casa', 'terreno', 'inmueble', 'propiedad', 'alquiler', 'ambientes'],
        names: ['Inmuebles', 'Propiedades']
      },
      {
        keywords: ['herramienta', 'taladro', 'amoladora', 'morsa', 'soldadora', 'mueble', 'mesa', 'silla', 'cocina', 'jardin'],
        names: ['Hogar y Herramientas', 'Hogar']
      }
    ];

    for (const rule of rules) {
      if (rule.keywords.some(kw => fullText.includes(kw))) {
        const matched = categories.find(c => 
          rule.names.some(n => c.name.toLowerCase().includes(n.toLowerCase()))
        );
        if (matched) {
          setCategoryId(matched.id);
          break;
        }
      }
    }
  }, [title, brand, model, description, categories]);

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
            detected = `${city}, Buenos Aires`;
          }

          const finalLocation = detected || 'Barracas, Buenos Aires';
          setLocationName(finalLocation);
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

  const handleGenerateAISummary = async () => {
    if (!brand.trim() && !model.trim() && !title.trim()) {
      showModalMessage(
        '⚠️ Atributos Requeridos para IA',
        'Ingresa al menos el Título, la Marca o el Modelo de tu producto para que la IA investigue las especificaciones técnicas en la web en tiempo real.',
        'info'
      );
      return;
    }

    setIsGeneratingAI(true);

    try {
      // 🌐 Intentar búsqueda web en tiempo real para obtener datos técnicos auténticos
      const liveWebData = await fetchLiveWebProductSpecs(title, brand, model, material, condition);

      const aiData = liveWebData || generateAIProductSummary(
        title || model || brand || 'Producto',
        description,
        imagePreviews,
        { brand, model, material, condition }
      );

      if (!title.trim() && aiData.optimizedTitle) {
        setTitle(aiData.optimizedTitle);
      }

      setAiSummaryBullets(aiData.summaryBullets);

      if (categories.length > 0) {
        const matched = categories.find(c => 
          c.name.toLowerCase().includes(aiData.category.toLowerCase()) || 
          aiData.category.toLowerCase().includes(c.name.toLowerCase())
        );
        if (matched) {
          setCategoryId(matched.id);
        }
      }

      setIsGeneratingAI(false);
      showModalMessage(
        '✨ Especificaciones Técnicas Web Generadas',
        `Se investigaron las especificaciones técnicas reales de la web para "${brand} ${model || title}". Se asignaron los datos a las viñetas técnicas sin alterar tu cuadro de descripción libre.`,
        'success'
      );
    } catch (error) {
      console.error('Error generando ficha con IA:', error);
      setIsGeneratingAI(false);
    }
  };

  const formatNumber = (value: string): string => {
    const numericValue = value.replace(/\D/g, '');
    if (!numericValue) return '';
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSep);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(formatNumber(e.target.value));
  };

  const getNumericValue = (formattedValue: string): number => {
    const rawNumber = formattedValue.replace(new RegExp(`\\${thousandsSep}`, 'g'), '');
    return parseFloat(rawNumber) || 0;
  };

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

    let finalDescription = description.trim();
    if (publicationType === 'vehicle') {
      finalDescription = `🚗 VEHÍCULO EN VENTA\nAño: ${vehicleYear || 'N/D'} | Kilometraje: ${vehicleMileage || '0'} km | Combustible: ${vehicleFuel}\n\n${description}`.trim();
    } else if (publicationType === 'property') {
      finalDescription = `🏠 PROPIEDAD EN ${propertyOperation.toUpperCase()}\nAmbientes: ${propertyRooms || '1'} | Superficie: ${propertyArea || '0'} m²\n\n${description}`.trim();
    }

    if (aiSummaryBullets.length > 0) {
      const aiBlock = `✦ Resumen de IA del artículo\nAviso legal: Este contenido está generado por IA y no representa la opinión del vendedor. La plataforma y los vendedores no asumen ninguna responsabilidad legal al respecto.\n\n${aiSummaryBullets.map(b => `• **${b.title}**: ${b.description}`).join('\n\n')}`;
      finalDescription = finalDescription ? `${finalDescription}\n\n${aiBlock}` : aiBlock;
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
          'Tu publicación se revisará en menos de 24 horas y estará visible inmediatamente en tu panel de Mis Productos.',
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

  return {
    publicationType,
    setPublicationType,
    title,
    setTitle,
    description,
    setDescription,
    price,
    stock,
    setStock,
    brand,
    setBrand,
    model,
    setModel,
    material,
    setMaterial,
    condition,
    setCondition,
    locationName,
    setLocationName,
    categoryId,
    setCategoryId,
    imageFiles,
    imagePreviews,
    uploading,
    categories,
    userStoreName,
    showModal,
    setShowModal,
    modalData,
    currencySymbol,
    isGeneratingAI,
    aiSummaryBullets,
    vehicleYear,
    setVehicleYear,
    vehicleMileage,
    setVehicleMileage,
    vehicleFuel,
    setVehicleFuel,
    propertyOperation,
    setPropertyOperation,
    propertyRooms,
    setPropertyRooms,
    propertyArea,
    setPropertyArea,
    mapCoords,
    setMapCoords,
    locationSuggestions,
    showSuggestions,
    setShowSuggestions,
    isDetectingGPS,
    handleImageSelect,
    handleRemoveImage,
    handleGenerateAISummary,
    handleLocationInputChange,
    autoDetectGPS,
    handlePriceChange,
    handleAddProduct,
    router,
  };
}
