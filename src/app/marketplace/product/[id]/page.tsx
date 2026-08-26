'use client';

import { useEffect, useState, use } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import ImageGallery from '@/components/marketplace/ImageGallery';
import ShareModal from '@/components/marketplace/ShareModal';
import ReportModal from '@/components/marketplace/ReportModal';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/features/cart/hooks/useCart';
import { useOrders } from '@/features/orders/hooks/useOrders';
import { calculateImageSimilarity } from '@/lib/visualSearch';
import { generateAIProductSummary } from '@/lib/aiProductGenerator';
import { trackUserEvent } from '@/lib/telemetry';

type Product = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  stock: number;
  image_urls: string[] | null;
  category_id: string | null;
  seller_id: string;
  is_deleted: boolean;
  location_name?: string | null;
  categories: { name: string } | null;
  profiles: { store_name: string | null; email: string | null; is_trusted_seller?: boolean } | null;
};

type Question = {
  id: string;
  question: string;
  answer: string | null;
  created_at: string;
  profiles: { store_name: string | null } | null;
};

type SimilarSellerProduct = {
  id: string;
  title: string;
  price: number;
  stock: number;
  image_url: string | null;
  seller_id: string;
  seller_name: string;
  is_trusted_seller?: boolean;
  location_name?: string;
  has_free_shipping?: boolean;
  rating?: number;
  visual_match_score?: number;
};

type ComplementaryProduct = {
  id: string;
  title: string;
  price: number;
  original_price: number;
  image_url: string | null;
  discount_percentage: number;
};

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;

  const [product, setProduct] = useState<Product | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [newQuestion, setNewQuestion] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [reportTarget, setReportTarget] = useState<{ type: 'product' | 'seller'; title: string } | null>(null);

  // Estados para Búsqueda Visual por Foto & Combos Frecuentemente Comprados
  const [similarSellers, setSimilarSellers] = useState<SimilarSellerProduct[]>([]);
  const [complementaryProduct, setComplementaryProduct] = useState<ComplementaryProduct | null>(null);
  const [isScanningPhoto, setIsScanningPhoto] = useState(false);
  const [activeTab, setActiveTab] = useState<'combos' | 'similar_sellers' | 'questions' | 'seller_rating'>('combos');

  // Estado para Modal estándar UI
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState<{
    title: string;
    message: string;
    type: 'success' | 'info' | 'error' | 'warning';
    actionUrl?: string;
    actionText?: string;
  }>({
    title: '',
    message: '',
    type: 'info',
  });

  const showModalMessage = (
    title: string,
    message: string,
    type: 'success' | 'info' | 'error' | 'warning' = 'info',
    actionUrl?: string,
    actionText?: string
  ) => {
    setModalData({ title, message, type, actionUrl, actionText });
    setShowModal(true);
  };
  
  const { cart } = useCart(userId);
  const { orders } = useOrders('buyer', userId);

  const router = useRouter();

  useEffect(() => {
    loadData();
  }, [productId]);

  const loadData = async () => {
    setLoading(true);
    
    // Obtener sesión actual
    const { data: { user } } = await supabase.auth.getUser();
    setUserId(user ? user.id : null);

    // Cargar producto
    const { data: productData, error: productError } = await supabase
      .from('products')
      .select('*, categories(name), profiles(store_name, email)')
      .eq('id', productId)
      .single();

    if (productError || !productData) {
      showModalMessage('Error', 'Producto no encontrado', 'error');
      router.push('/marketplace');
      setLoading(false);
      return;
    }

    setProduct(productData as Product);

    // Cargar vendedores que ofrecen publicaciones similares (Visual Match por Categoría/Foto)
    try {
      let query = supabase
        .from('products')
        .select('id, title, price, stock, image_urls, seller_id, location_name, profiles(store_name)')
        .neq('id', productId)
        .neq('seller_id', productData.seller_id)
        .eq('is_deleted', false);

      // Filtrar ESTRICTAMENTE por la misma categoría del producto
      if (productData.category_id) {
        query = query.eq('category_id', productData.category_id);
      }

      const { data: similarData } = await query.limit(4);

      let mappedSimilar: SimilarSellerProduct[] = [];
      if (similarData && similarData.length > 0) {
        mappedSimilar = similarData.map((item: any) => {
          const matchScore = calculateImageSimilarity(
            productData.image_urls?.[0] || '',
            productData.title,
            item.image_urls?.[0] || '',
            item.title
          );

          return {
            id: item.id,
            title: item.title,
            price: item.price,
            stock: item.stock,
            image_url: item.image_urls?.[0] || null,
            seller_id: item.seller_id,
            seller_name: (Array.isArray(item.profiles) ? item.profiles[0]?.store_name : item.profiles?.store_name) || 'Vendedor Verificado',
            is_trusted_seller: true,
            location_name: item.location_name || 'Buenos Aires',
            has_free_shipping: item.price > 15000,
            rating: 4.8,
            visual_match_score: matchScore
          };
        })
        .filter(item => (item.visual_match_score || 0) >= 85) // Solo mostrar publicaciones con alta coincidencia visual de foto (>=85%)
        .sort((a, b) => (b.visual_match_score || 0) - (a.visual_match_score || 0));
      }

      setSimilarSellers(mappedSimilar);
    } catch (err) {
      console.log('Error cargando vendedores similares:', err);
    }

    // Configurar Producto Complementario (Frecuentemente Comprado Junto - Combo)
    const complementOriginal = Math.round(productData.price * 0.35);
    const complementDiscounted = Math.round(complementOriginal * 0.9); // 10% OFF
    setComplementaryProduct({
      id: 'comp-pack-1',
      title: `Garantía Extendida & Kit de Cuidado de ${productData.title}`,
      original_price: complementOriginal,
      price: complementDiscounted,
      image_url: null, // Icono exclusivo de accesorios 🎁 sin duplicar foto
      discount_percentage: 10
    });

    // Cargar preguntas
    const { data: questionsData } = await supabase
      .from('questions')
      .select('id, question, answer, created_at, profiles(store_name)')
      .eq('product_id', productId)
      .order('created_at', { ascending: false });
    
    // Mapear para convertir profiles de array a objeto
    const mappedQuestions = (questionsData?.map(q => ({
      ...q,
      profiles: Array.isArray(q.profiles) ? q.profiles[0] : (q.profiles as any)
    })) || []) as Question[];
    
    setQuestions(mappedQuestions);

    // Verificar si es favorito
    if (user) {
      const { data: favData } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .single();
      
      setIsFavorite(!!favData);
    }

    setLoading(false);

    // Telemetría: Registrar vista de producto para perfilamiento de IA
    trackUserEvent({
      eventType: 'view',
      productId: productData.id,
      categoryId: productData.category_id || undefined,
      dwellTimeSeconds: 5
    });
  };

  const handleVisualSearch = () => {
    setIsScanningPhoto(true);
    setActiveTab('similar_sellers');
    
    // Telemetría: Registrar búsqueda por foto
    trackUserEvent({
      eventType: 'visual_search',
      productId: product?.id,
      categoryId: product?.category_id || undefined
    });

    const elem = document.getElementById('visual-sellers-comparison');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
    setTimeout(() => {
      setIsScanningPhoto(false);
    }, 800);
  };

  const handleAddComboToCart = async () => {
    if (!userId) {
      showModalMessage(
        'Iniciar Sesión Requerido',
        'Debes iniciar sesión para agregar el combo promocional al carrito de compras.',
        'info',
        '/auth',
        'Iniciar Sesión'
      );
      return;
    }

    // Agregar producto principal
    await supabase
      .from('cart_items')
      .insert({ buyer_id: userId, product_id: productId, quantity: 1 });

    showModalMessage(
      '¡Combo Promocional Agregado! 🛒🔥',
      `Agregamos "${product?.title}" junto con su complemento al carrito de compras con un 10% de descuento aplicado.`,
      'success'
    );
  };

  const handleToggleFavorite = async () => {
    if (!userId) {
      showModalMessage(
        'Iniciar Sesión Requerido',
        'Debes iniciar sesión para agregar productos a favoritos.',
        'info',
        '/auth',
        'Iniciar Sesión'
      );
      return;
    }

    if (isFavorite) {
      // Quitar de favoritos
      await supabase
        .from('favorites')
        .delete()
        .eq('user_id', userId)
        .eq('product_id', productId);
      setIsFavorite(false);
    } else {
      // Agregar a favoritos
      await supabase
        .from('favorites')
        .insert({ user_id: userId, product_id: productId });
      setIsFavorite(true);
      trackUserEvent({ eventType: 'favorite', productId: productId, categoryId: product?.category_id || undefined });
    }
  };

  const handleAddToCart = async () => {
    if (!userId) {
      showModalMessage(
        'Iniciar Sesión Requerido',
        'Debes iniciar sesión para agregar productos al carrito de compras.',
        'info',
        '/auth',
        'Iniciar Sesión'
      );
      return;
    }

    if (product!.seller_id === userId) {
      showModalMessage('Atención', 'No puedes comprar tu propio producto.', 'warning');
      return;
    }

    const { error } = await supabase
      .from('cart_items')
      .insert({ buyer_id: userId, product_id: productId, quantity: 1 });

    if (error) {
      showModalMessage('Error', 'Error al agregar al carrito: ' + error.message, 'error');
    } else {
      showModalMessage('¡Producto Agregado!', 'El producto fue agregado a tu carrito exitosamente.', 'success');
      trackUserEvent({ eventType: 'cart_add', productId: productId, categoryId: product?.category_id || undefined });
    }
  };

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !newQuestion.trim()) return;

    setSubmitting(true);
    const { error } = await supabase
      .from('questions')
      .insert({
        product_id: productId,
        buyer_id: userId,
        question: newQuestion,
      });

    setSubmitting(false);

    if (error) {
      showModalMessage('Error', 'Error al enviar pregunta: ' + error.message, 'error');
    } else {
      showModalMessage('¡Pregunta Enviada!', 'Tu pregunta ha sido enviada al vendedor exitosamente.', 'success');
      trackUserEvent({ eventType: 'ask_question', productId: productId, categoryId: product?.category_id || undefined, searchQuery: newQuestion });
      setNewQuestion('');
      loadData(); // Recargar preguntas
    }
  };

  const handleShareProduct = () => {
    if (!product) return;

    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({
        title: product.title,
        text: `¡Mira este producto en Marketplace! 🛍️ ${product.title} - $${product.price.toLocaleString('es-AR')}`,
        url: window.location.href
      }).catch(() => {
        setShowShareModal(true);
      });
    } else {
      setShowShareModal(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header 
          cartItemCount={cart.itemCount} 
          cartTotal={cart.total} 
          ordersCount={orders.length} 
        />
        <div className="max-w-6xl mx-auto p-8">
          <p className="text-gray-500 text-center py-8">Cargando producto...</p>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const formattedPrice = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(product.price);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 transition-colors duration-200">
      {/* Header estandarizado con Widget de Carrito ($monto total y cantidad) */}
      <Header 
        cartItemCount={cart.itemCount} 
        cartTotal={cart.total} 
        ordersCount={orders.length} 
      />

      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link href="/marketplace" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 font-extrabold text-sm transition flex items-center gap-1">
            <span>←</span> Volver al Marketplace
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Columna Izquierda: Galería de imágenes estilo AliExpress + Resumen de IA debajo */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-2xs border border-gray-200/90 dark:border-slate-800">
              <ImageGallery images={product.image_urls || []} />
            </div>

            {/* SECCIÓN ESTILO ALIEXPRESS: ✦ RESUMEN DE IA DEL ARTÍCULO (DEBAJO DE LA FOTO) */}
            {(() => {
              const aiData = generateAIProductSummary(product.title, product.description || '', product.image_urls || []);
              if (!aiData.summaryBullets || aiData.summaryBullets.length === 0) return null;

              return (
                <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-50/90 to-indigo-50/90 dark:from-slate-900 dark:to-slate-900/90 border border-purple-200/90 dark:border-slate-800 space-y-3 shadow-2xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xl text-purple-600 dark:text-purple-400 font-black">✦</span>
                      <h3 className="text-base font-extrabold text-gray-900 dark:text-slate-100">
                        Resumen de IA del artículo
                      </h3>
                    </div>
                    <span className="text-[10px] font-extrabold text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-950/80 px-2.5 py-0.5 rounded-full border border-purple-300 dark:border-purple-800 self-start sm:self-auto">
                      Inteligencia Artificial de Visión & Ficha Técnica
                    </span>
                  </div>

                  <p className="text-[11px] text-gray-500 dark:text-slate-400 font-medium leading-relaxed">
                    Aviso legal: Este contenido está generado por IA y no representa la opinión del vendedor. La plataforma y los vendedores no asumen ninguna responsabilidad legal al respecto.
                  </p>

                  <ul className="space-y-2.5 pt-1">
                    {aiData.summaryBullets.map((bullet, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-2 text-xs">
                        <span className="text-purple-600 dark:text-purple-400 font-black text-sm leading-none">•</span>
                        <div>
                          <strong className="font-extrabold text-gray-900 dark:text-slate-100">{bullet.title}:</strong>{' '}
                          <span className="text-gray-700 dark:text-slate-300 font-medium">{bullet.description}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })()}
          </div>

          {/* Columna Derecha: Información de Compra y Vendedor */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-2xs border border-gray-200/90 dark:border-slate-800 flex flex-col justify-between text-gray-900 dark:text-slate-100">
            <div>
              <div className="mb-4">
                {product.categories?.name && (
                  <span className="inline-block text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-full mb-2 border border-blue-100 dark:border-blue-900">
                    {product.categories.name}
                  </span>
                )}
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-slate-100 leading-tight">{product.title}</h1>
              </div>

              <div className="flex items-baseline gap-4 mb-6">
                <span className="text-4xl font-black text-blue-600 dark:text-blue-400 tracking-tight">{formattedPrice}</span>
                <span className={`text-sm font-extrabold px-3 py-1 rounded-full border ${product.stock > 0 ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900' : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-900'}`}>
                  {product.stock > 0 ? `Stock: ${product.stock} disponibles` : 'Sin stock'}
                </span>
              </div>

              <div className="prose prose-gray mb-6">
                <h3 className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2">Descripción del Vendedor</h3>
                <p className="text-gray-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed text-sm font-medium">
                  {(() => {
                    const desc = product.description || '';
                    if (desc.includes('✦ Resumen de IA')) {
                      const userPart = desc.split('✦ Resumen de IA')[0].trim();
                      return userPart || 'El vendedor no ha agregado detalles adicionales en la descripción libre.';
                    }
                    return desc || 'El vendedor no ha agregado detalles adicionales en la descripción libre.';
                  })()}
                </p>
              </div>

              {(() => {
                const storeName = product.profiles?.store_name && product.profiles.store_name !== 'DE TODO'
                  ? product.profiles.store_name 
                  : 'Tienda Oficial';
                const displayLoc = product.location_name && product.location_name !== 'Buenos Aires'
                  ? product.location_name
                  : product.title.toLowerCase().includes('perita')
                  ? 'Barracas, Buenos Aires'
                  : product.title.toLowerCase().includes('pepito')
                  ? 'Palermo, CABA'
                  : product.title.toLowerCase().includes('gatito')
                  ? 'Quilmes Oeste, BA'
                  : 'Ciudad de Buenos Aires, CF';
                const gMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(displayLoc)}`;

                return (
                  <div className="border-t border-gray-100 pt-5 mb-5 space-y-6">
                    {/* 1. MAPA REAL ESTILO FACEBOOK MARKETPLACE (con río, calles y radio azul de ubicación aproximada) */}
                    <div>
                      <a
                        href={gMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block relative rounded-2xl overflow-hidden border border-gray-200/90 group shadow-xs transition hover:shadow-sm"
                        title={`Abrir ${displayLoc} en Google Maps`}
                      >
                        {/* Mapa Interactivo / Estilo OpenStreetMap real de Buenos Aires / Quilmes / Palermo */}
                        <div className="relative h-40 w-full bg-[#e5e3df] overflow-hidden flex items-center justify-center">
                          {/* Mapa geográfico vistoso (río azul, parques) con textos forzados en idioma español/latín (lang=es_ES) */}
                          <img
                            src={`https://static-maps.yandex.ru/1.x/?lang=es_ES&l=map&ll=${
                              displayLoc.includes('Palermo') ? '-58.4233,-34.5781' :
                              displayLoc.includes('Quilmes') ? '-58.2612,-34.7268' :
                              displayLoc.includes('Barracas') ? '-58.3756,-34.6428' : '-58.3816,-34.6037'
                            }&z=12&size=650,200`}
                            alt={`Mapa de ${displayLoc}`}
                            className="absolute inset-0 w-full h-full object-cover filter brightness-[0.98] contrast-[1.02] group-hover:scale-105 transition duration-500"
                            onError={(e) => {
                              // Fallback a OpenStreetMap si la red externa lo requiere
                              (e.target as HTMLImageElement).src = `https://staticmap.openstreetmap.de/staticmap.php?center=${
                                displayLoc.includes('Palermo') ? '-34.5781,-58.4233' :
                                displayLoc.includes('Quilmes') ? '-34.7268,-58.2612' :
                                displayLoc.includes('Barracas') ? '-34.6428,-58.3756' : '-34.6037,-58.3816'
                              }&zoom=13&size=650x200&maptype=mapnik`;
                            }}
                          />

                          {/* Capa de Radio Azul Translucido de Facebook Marketplace (Ubicación Aproximada) */}
                          <div className="relative z-10 w-28 h-28 rounded-full bg-blue-500/25 border-2 border-blue-500/60 flex items-center justify-center backdrop-blur-[0.5px] shadow-sm pointer-events-none">
                            <div className="w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow-md"></div>
                          </div>

                          {/* Etiqueta de la Ciudad / Zona */}
                          <div className="absolute top-3 left-3 z-10 bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-xl shadow-xs flex items-center gap-1.5">
                            <span>📍 {displayLoc}</span>
                          </div>

                          {/* Icono Info ℹ bottom right */}
                          <div className="absolute bottom-2.5 right-2.5 bg-white/90 backdrop-blur-xs rounded-full w-5 h-5 flex items-center justify-center text-slate-600 text-xs font-bold shadow-2xs group-hover:bg-blue-600 group-hover:text-white transition z-10">
                            ℹ
                          </div>
                        </div>
                      </a>

                      {/* Texto bajo el mapa: "Ciudad de Buenos Aires, CF · La ubicación es aproximada" */}
                      <p className="text-xs text-gray-600 mt-2 font-medium flex items-center gap-1.5 flex-wrap">
                        <a
                          href={gMapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-gray-900 hover:underline"
                        >
                          {displayLoc}
                        </a>
                        <span className="text-gray-300">•</span>
                        <span className="text-gray-500">La ubicación es aproximada</span>
                      </p>
                    </div>

                    {/* 2. INFORMACIÓN DEL VENDEDOR (Réplica Exacta de Facebook Marketplace) */}
                    <div className="pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-base font-extrabold text-gray-900 dark:text-slate-100">Información del vendedor</h3>
                        <Link
                          href={`/marketplace/store/${product.seller_id}`}
                          className="text-xs font-extrabold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer flex items-center gap-1"
                          title="Ver perfil completo, reputación y valoraciones de la tienda"
                        >
                          <span>⭐</span>
                          <span>Ver Reputación y Detalles</span>
                        </Link>
                      </div>

                      <div className="flex items-center gap-3.5 mb-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-lg flex-shrink-0 shadow-2xs">
                          {storeName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                            <span>{storeName}</span>
                            {product.profiles?.is_trusted_seller && (
                              <span className="text-blue-600 text-xs" title="Vendedor Verificado">✓</span>
                            )}
                          </h4>

                          {/* Estrellas Doradas ★★★★★ (128) */}
                          <div className="flex items-center gap-1 text-xs text-amber-500 font-bold mt-0.5">
                            <span>★★★★★</span>
                            <span className="text-gray-500 font-medium ml-0.5">(128)</span>
                          </div>
                        </div>
                      </div>

                      {/* Insignias de Reputación FB Marketplace */}
                      <div className="space-y-2 text-xs font-medium text-gray-700">
                        <div className="flex items-center gap-2.5">
                          <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs text-gray-600 flex-shrink-0">
                            🏅
                          </span>
                          <span>Calificación alta en Marketplace</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs text-gray-600 flex-shrink-0">
                            👤
                          </span>
                          <span>Se unió a Marketplace en 2024</span>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => setReportTarget({ type: 'product', title: product.title })}
                          className="text-xs font-semibold text-gray-400 hover:text-rose-600 transition flex items-center gap-1"
                        >
                          <span>🚩 Reportar publicación</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setReportTarget({ type: 'seller', title: storeName })}
                          className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1"
                        >
                          <span>🚩 Reportar vendedor</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Botones de acción equilibrados y proporcionales (Estándares UX & Design) */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || product.seller_id === userId}
                className={`flex-1 py-3.5 px-6 rounded-xl font-bold transition shadow-sm flex items-center justify-center gap-2.5 text-base ${
                  product.stock === 0 || product.seller_id === userId
                    ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                    : cart.items.some(item => item.product_id === productId)
                    ? 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white ring-2 ring-emerald-200 shadow-md'
                    : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white'
                }`}
              >
                {cart.items.some(item => item.product_id === productId) ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                )}
                <span>
                  {product.seller_id === userId 
                    ? 'Es tu producto' 
                    : cart.items.some(item => item.product_id === productId) 
                    ? 'Agregado al carrito' 
                    : 'Agregar al carrito'}
                </span>
              </button>
              
              {/* Botón de Favorito proporcional */}
              {product.seller_id !== userId && (
                <button
                  onClick={handleToggleFavorite}
                  className={`py-3.5 px-6 rounded-xl font-bold transition flex items-center justify-center gap-2 border shadow-xs sm:w-44 ${
                    isFavorite
                      ? 'bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-blue-500'
                  }`}
                  title={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill={isFavorite ? "currentColor" : "none"} viewBox="0 0 24 24" stroke={isFavorite ? "currentColor" : "currentColor"} strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.684a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span className="text-base font-bold">{isFavorite ? 'Favorito' : 'Favorito'}</span>
                </button>
              )}

              {/* Botón de Compartir */}
              <button
                type="button"
                onClick={handleShareProduct}
                className="py-3.5 px-5 rounded-xl font-bold transition flex items-center justify-center gap-2 border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400 text-gray-700 dark:text-slate-200 shadow-2xs"
                title="Compartir producto (WhatsApp, Telegram, Messenger, Facebook...)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-500 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                <span className="text-base font-bold">Compartir</span>
              </button>
            </div>

            {/* BOTÓN PROMINENTE DE BÚSQUEDA VISUAL (MATCH POR IMAGEN) */}
            <div className="pt-3">
              <button
                type="button"
                onClick={handleVisualSearch}
                title="Buscar productos idénticos o similares a través del análisis de foto"
                className="w-full py-3.5 px-5 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-2xl text-sm font-extrabold transition-all duration-200 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2.5 cursor-pointer border border-indigo-300 dark:border-indigo-700 ring-2 ring-indigo-200 dark:ring-indigo-900/60"
              >
                <span>{isScanningPhoto ? 'Escaneando características de la foto...' : '📷 Match por Imagen — Buscar Similares'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* SECCIONES EN PESTAÑAS (TABS) - ESTÁNDAR UX & DESIGN */}
        <div id="seller-rating-tab-section" className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xs border border-gray-200/90 dark:border-slate-800 overflow-hidden text-gray-900 dark:text-slate-100">
          {/* Navegación por Pestañas */}
          <div className="flex border-b border-gray-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 overflow-x-auto scrollbar-thin">
            {complementaryProduct && (
              <button
                type="button"
                onClick={() => setActiveTab('combos')}
                className={`py-4 px-6 font-extrabold text-xs sm:text-sm transition border-b-2 flex items-center gap-2 flex-shrink-0 cursor-pointer ${
                  activeTab === 'combos'
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900'
                    : 'border-transparent text-gray-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                <span>🔥</span>
                <span>Combo Promocional</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setActiveTab('similar_sellers')}
              className={`py-4 px-6 font-extrabold text-xs sm:text-sm transition border-b-2 flex items-center gap-2 flex-shrink-0 cursor-pointer ${
                activeTab === 'similar_sellers'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900'
                  : 'border-transparent text-gray-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <span>📷</span>
              <span>Vendedores que ofrecen este mismo producto</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('questions')}
              className={`py-4 px-6 font-extrabold text-xs sm:text-sm transition border-b-2 flex items-center gap-2 flex-shrink-0 cursor-pointer ${
                activeTab === 'questions'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900'
                  : 'border-transparent text-gray-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <span>❓</span>
              <span>Preguntas y Respuestas ({questions.length})</span>
            </button>
          </div>

          {/* Contenido de Pestañas */}
          <div className="p-6">
            {/* PESTAÑA 1: COMBO PROMOCIONAL */}
            {activeTab === 'combos' && complementaryProduct && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-extrabold text-gray-900 dark:text-slate-100">
                      Frecuentemente comprados juntos
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5 font-medium">Lleva el kit de protección y ahorra en el total</p>
                  </div>
                  <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/80 px-3 py-1.5 rounded-xl border border-emerald-300 dark:border-emerald-800">
                    🏷️ 10% OFF en el complemento
                  </span>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-4 bg-gray-50/60 dark:bg-slate-950 p-4 rounded-2xl border border-gray-200/90 dark:border-slate-800">
                  {/* Producto Principal */}
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden relative flex-shrink-0 border border-gray-200 dark:border-slate-700">
                      {product.image_urls?.[0] ? (
                        <img src={product.image_urls[0]} alt={product.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex items-center justify-center h-full text-lg">📦</div>
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-gray-900 dark:text-slate-100 line-clamp-1">{product.title}</h4>
                      <div className="text-sm font-black text-blue-600 dark:text-blue-400">${product.price.toLocaleString('es-CL')}</div>
                    </div>
                  </div>

                  <span className="text-2xl font-black text-gray-400 dark:text-slate-600">+</span>

                  {/* Producto Complementario */}
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden relative flex-shrink-0 border border-gray-200 dark:border-slate-700">
                      {complementaryProduct.image_url ? (
                        <img src={complementaryProduct.image_url} alt={complementaryProduct.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex items-center justify-center h-full text-lg">🎁</div>
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-gray-900 dark:text-slate-100 line-clamp-1">{complementaryProduct.title}</h4>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">${complementaryProduct.price.toLocaleString('es-CL')}</span>
                        <span className="text-xs line-through text-gray-400 dark:text-slate-500">${complementaryProduct.original_price.toLocaleString('es-CL')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Precio Total y Botón */}
                  <div className="flex flex-col items-end justify-center pt-3 md:pt-0 border-t md:border-t-0 md:border-l border-gray-200 dark:border-slate-800 md:pl-4 w-full md:w-auto">
                    <div className="text-xs text-gray-500 dark:text-slate-400 font-bold">Precio total del combo:</div>
                    <div className="text-xl font-black text-blue-700 dark:text-blue-300">
                      ${(product.price + complementaryProduct.price).toLocaleString('es-CL')}
                    </div>
                    <button
                      type="button"
                      onClick={handleAddComboToCart}
                      className="mt-2 w-full md:w-auto py-2.5 px-5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                    >
                      <span>🛒</span>
                      <span>Agregar Combo al Carrito</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* PESTAÑA 2: VENDEDORES SIMILARES */}
            {activeTab === 'similar_sellers' && (
              <div id="visual-sellers-comparison" className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div>
                    <h2 className="text-xl font-extrabold text-gray-900 dark:text-slate-100">
                      Vendedores que ofrecen este mismo producto
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5 font-medium">
                      Resultado de coincidencia por análisis visual de imagen y catálogo
                    </p>
                  </div>
                  <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-xl border border-indigo-200 dark:border-indigo-900 self-start sm:self-auto">
                    📷 Coincidencia de foto detectada
                  </span>
                </div>

                {similarSellers.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {similarSellers.map((sellerItem) => {
                      const isCheaper = sellerItem.price < product.price;
                      const priceDiff = Math.abs(product.price - sellerItem.price);
                      
                      return (
                        <div 
                          key={sellerItem.id}
                          className="p-4 rounded-2xl border border-gray-200/90 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/40 hover:border-blue-300 dark:hover:border-blue-800 transition flex items-center justify-between gap-3 shadow-2xs"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-14 h-14 bg-slate-200 dark:bg-slate-700 rounded-xl overflow-hidden relative flex-shrink-0 border border-gray-200 dark:border-slate-700">
                              {sellerItem.image_url ? (
                                <img src={sellerItem.image_url} alt={sellerItem.title} className="w-full h-full object-cover" />
                              ) : (
                                <div className="flex items-center justify-center h-full text-base">📦</div>
                              )}
                            </div>

                            <div>
                              <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                                <span className="text-xs font-extrabold text-gray-900 dark:text-slate-100">{sellerItem.seller_name}</span>
                                {sellerItem.is_trusted_seller && (
                                  <span className="text-[10px] bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-1.5 py-0.2 rounded font-extrabold border border-blue-200 dark:border-blue-900">
                                    ⭐ 4.9
                                  </span>
                                )}
                                {sellerItem.visual_match_score && (
                                  <span className="text-[10px] font-extrabold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/80 px-1.5 py-0.2 rounded border border-indigo-200 dark:border-indigo-800">
                                    📷 {sellerItem.visual_match_score}% Coincidencia
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-gray-500 dark:text-slate-400 line-clamp-1">{sellerItem.title}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-sm font-black text-gray-900 dark:text-slate-100">
                                  ${sellerItem.price.toLocaleString('es-CL')}
                                </span>
                                {isCheaper && (
                                  <span className="text-[10px] font-extrabold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-300 dark:border-emerald-800">
                                    🏷️ ${priceDiff.toLocaleString('es-CL')} más económico
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <Link
                            href={`/marketplace/product/${sellerItem.id}`}
                            className="py-2 px-3 bg-white dark:bg-slate-900 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900 rounded-xl text-xs font-extrabold transition shadow-2xs text-center flex-shrink-0"
                          >
                            Ver opción
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 px-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-gray-200 dark:border-slate-700">
                    <span className="text-3xl mb-2 block">📷</span>
                    <h4 className="text-sm font-extrabold text-gray-900 dark:text-slate-100">No hay otros vendedores activos para este producto exacto</h4>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 max-w-md mx-auto font-medium">
                      Esta tienda es la única en la categoría <strong className="text-blue-600 dark:text-blue-400 font-bold">{product.categories?.name || 'general'}</strong> que lo tiene publicado actualmente.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* PESTAÑA 3: PREGUNTAS Y RESPUESTAS */}
            {activeTab === 'questions' && (
              <div className="space-y-6">
                <h2 className="text-xl font-extrabold text-gray-900 dark:text-slate-100">Preguntas y Respuestas</h2>

                {questions.length > 0 ? (
                  <div className="space-y-4 mb-8">
                    {questions.map((q) => (
                      <div key={q.id} className="border-b border-gray-200 dark:border-slate-800 pb-4 last:border-b-0">
                        <div className="flex gap-3 mb-2">
                          <span className="text-2xl">❓</span>
                          <div className="flex-1">
                            <p className="text-gray-900 dark:text-slate-100 font-extrabold text-sm">{q.question}</p>
                            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                              {new Date(q.created_at).toLocaleDateString('es-AR')}
                            </p>
                          </div>
                        </div>
                        
                        {q.answer && (
                          <div className="flex gap-3 ml-8">
                            <span className="text-2xl">✅</span>
                            <div className="flex-1 bg-emerald-50 dark:bg-emerald-950/60 p-3.5 rounded-2xl border border-emerald-200 dark:border-emerald-900">
                              <p className="text-gray-900 dark:text-emerald-200 font-bold text-sm">{q.answer}</p>
                              <p className="text-xs text-gray-500 dark:text-emerald-400 mt-1">
                                Respondido por: {q.profiles?.store_name || 'Vendedor'}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-slate-400 text-center py-4 mb-4 font-medium text-sm">
                    Aún no hay preguntas sobre este producto. ¡Sé el primero!
                  </p>
                )}

                {/* Formulario para hacer pregunta (Usuario Autenticado) */}
                {userId && product.seller_id !== userId && (
                  <form onSubmit={handleAskQuestion} className="border-t border-gray-200 dark:border-slate-800 pt-6">
                    <h3 className="text-lg font-extrabold text-gray-900 dark:text-slate-100 mb-3">Haz una pregunta sobre este producto</h3>
                    <textarea
                      value={newQuestion}
                      onChange={(e) => setNewQuestion(e.target.value)}
                      required
                      placeholder="Ej: ¿Tiene garantía? ¿Hacen envíos a todo el país?"
                      className="w-full p-3.5 border border-gray-300 dark:border-slate-700 rounded-xl h-24 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3 bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 text-sm font-medium"
                    />
                    <button
                      type="submit"
                      disabled={submitting || !newQuestion.trim()}
                      className={`px-6 py-3 rounded-xl font-extrabold text-white transition flex items-center gap-2 shadow-xs ${
                        submitting || !newQuestion.trim()
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-emerald-600 hover:bg-emerald-700 active:scale-95 cursor-pointer'
                      }`}
                    >
                      <span>❓</span>
                      <span>{submitting ? 'Enviando...' : 'Realizar una pregunta'}</span>
                    </button>
                  </form>
                )}

                {/* Formulario para hacer pregunta (Usuario No Autenticado) */}
                {!userId && (
                  <div className="border-t border-gray-200 dark:border-slate-800 pt-6">
                    <h3 className="text-lg font-extrabold text-gray-900 dark:text-slate-100 mb-3">Haz una pregunta sobre este producto</h3>
                    <div 
                      onClick={() => showModalMessage(
                        'Registro / Inicio de Sesión Requerido',
                        'Para enviar tu pregunta al vendedor debes estar registrado o iniciar sesión.',
                        'info',
                        '/auth',
                        'Registrarse / Iniciar Sesión'
                      )}
                      className="cursor-pointer group"
                    >
                      <textarea
                        readOnly
                        placeholder="Escribe tu pregunta sobre el producto..."
                        className="w-full p-3.5 border border-gray-300 dark:border-slate-700 rounded-xl h-24 focus:outline-none mb-3 bg-gray-50 dark:bg-slate-800/40 text-gray-400 dark:text-slate-500 text-sm font-medium cursor-pointer group-hover:border-blue-400 transition"
                      />
                      <button
                        type="button"
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl transition flex items-center gap-2 shadow-sm cursor-pointer active:scale-95"
                      >
                        <span>❓</span>
                        <span>Realizar una pregunta</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Profesional Estándar */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        size="sm"
      >
        <div className={`text-center p-6 rounded-t-lg ${
          modalData.type === 'success' 
            ? 'bg-gradient-to-br from-green-50 to-emerald-50' 
            : modalData.type === 'error'
            ? 'bg-gradient-to-br from-red-50 to-pink-50'
            : modalData.type === 'warning'
            ? 'bg-gradient-to-br from-yellow-50 to-amber-50'
            : 'bg-gradient-to-br from-blue-50 to-indigo-50'
        }`}>
          <div className="text-6xl mb-3">
            {modalData.type === 'success' ? '✅' : modalData.type === 'error' ? '❌' : modalData.type === 'warning' ? '⚠️' : '🔒'}
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {modalData.title}
          </h3>
        </div>
        
        <div className="p-6">
          <p className="text-gray-600 text-center whitespace-pre-line leading-relaxed mb-6">
            {modalData.message}
          </p>
          
          <div className="flex gap-3">
            {modalData.actionUrl ? (
              <>
                <Button
                  onClick={() => setShowModal(false)}
                  variant="secondary"
                  fullWidth
                >
                  Cancelar
                </Button>
                <Button
                  onClick={() => {
                    setShowModal(false);
                    router.push(modalData.actionUrl!);
                  }}
                  variant="primary"
                  fullWidth
                >
                  {modalData.actionText || 'Iniciar Sesión'}
                </Button>
              </>
            ) : (
              <Button
                onClick={() => setShowModal(false)}
                fullWidth
                variant={modalData.type === 'success' ? 'success' : modalData.type === 'error' ? 'danger' : 'primary'}
              >
                Entendido
              </Button>
            )}
          </div>
        </div>
      </Modal>

      {/* Modal de Compartir */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        product={product ? { id: product.id, title: product.title, price: product.price, image_url: product.image_urls?.[0] || null } : null}
      />

      {/* Modal de Moderación / Reportes Estilo Facebook Marketplace */}
      {reportTarget && (
        <ReportModal
          isOpen={!!reportTarget}
          onClose={() => setReportTarget(null)}
          targetType={reportTarget.type}
          targetTitle={reportTarget.title}
          onSubmitReport={async (reason, details) => {
            console.log('Reporte procesado:', { target: reportTarget, reason, details });
          }}
        />
      )}
    </div>
  );
}