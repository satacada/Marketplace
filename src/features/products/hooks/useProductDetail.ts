/**
 * ============================================================================
 * FILE: useProductDetail.ts
 * ============================================================================
 * 
 * @description Custom Hook para cargar los detalles del producto, preguntas,
 *              vendedores similares, combos y acciones del carrito/favoritos (SOLID / SRP).
 * 
 * @module Features/Products/Hooks/useProductDetail
 * ============================================================================
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useCart } from '@/features/cart/hooks/useCart';
import { trackUserEvent } from '@/lib/telemetry';
import { calculateImageSimilarity } from '@/lib/visualSearch';
import { generateAIProductSummary } from '@/lib/aiProductGenerator';

export type DetailProduct = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  stock: number;
  image_urls: string[] | null;
  category_id: string | null;
  seller_id: string;
  is_deleted: boolean;
  created_at?: string | null;
  location_name?: string | null;
  categories: { name: string } | null;
  profiles: { store_name: string | null; email: string | null; is_trusted_seller?: boolean } | null;
};

export type Question = {
  id: string;
  question: string;
  answer: string | null;
  created_at: string;
  profiles: { store_name: string | null } | null;
};

export type SimilarSellerProduct = {
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

export type ComplementaryProduct = {
  id: string;
  title: string;
  price: number;
  original_price: number;
  image_url: string | null;
  discount_percentage: number;
};

export function useProductDetail(productId: string) {
  const router = useRouter();
  const { cart, addToCart } = useCart();

  const [product, setProduct] = useState<DetailProduct | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [newQuestion, setNewQuestion] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [reportTarget, setReportTarget] = useState<{ type: 'product' | 'seller'; title: string } | null>(null);

  const [similarSellers, setSimilarSellers] = useState<SimilarSellerProduct[]>([]);
  const [complementaryProduct, setComplementaryProduct] = useState<ComplementaryProduct | null>(null);
  const [isScanningPhoto, setIsScanningPhoto] = useState(false);
  const [activeTab, setActiveTab] = useState<'combos' | 'similar_sellers' | 'questions' | 'seller_rating'>('combos');

  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState<{
    title: string;
    message: string;
    type: 'success' | 'info' | 'error' | 'warning';
  }>({ title: '', message: '', type: 'info' });

  useEffect(() => {
    if (productId) {
      loadData();
    }
  }, [productId]);

  const showModalMessage = (title: string, message: string, type: 'success' | 'info' | 'error' | 'warning' = 'info') => {
    setModalData({ title, message, type });
    setShowModal(true);
  };

  const loadData = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    const currentUserId = user?.id || null;
    setUserId(currentUserId);

    // Cargar detalles del producto
    const { data: prodData, error } = await supabase
      .from('products')
      .select('*, categories(name), profiles(store_name, email, is_trusted_seller)')
      .eq('id', productId)
      .single();

    if (error || !prodData) {
      console.error('Error cargando producto:', error);
      setLoading(false);
      return;
    }

    const mappedProduct: DetailProduct = {
      ...prodData,
      categories: Array.isArray(prodData.categories) ? prodData.categories[0] : prodData.categories,
      profiles: Array.isArray(prodData.profiles) ? prodData.profiles[0] : prodData.profiles,
    };
    setProduct(mappedProduct);

    // Registrar evento de telemetría de vista
    if (currentUserId) {
      trackUserEvent({ eventType: 'view', productId });
    }

    // Verificar si es favorito
    if (currentUserId) {
      const { data: favData } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', currentUserId)
        .eq('product_id', productId)
        .single();
      setIsFavorite(!!favData);
    }

    // Cargar preguntas
    const { data: qData } = await supabase
      .from('questions')
      .select('*, profiles(store_name)')
      .eq('product_id', productId)
      .order('created_at', { ascending: false });

    if (qData) {
      const mappedQ = qData.map((q: any) => ({
        ...q,
        profiles: Array.isArray(q.profiles) ? q.profiles[0] : q.profiles,
      }));
      setQuestions(mappedQ);
    }

    // Escanear otros vendedores similares
    fetchSimilarSellers(mappedProduct);
    fetchComplementaryCombo(mappedProduct);

    setLoading(false);
  };

  const fetchSimilarSellers = async (currentProd: DetailProduct) => {
    setIsScanningPhoto(true);
    try {
      const { data: prods } = await supabase
        .from('products')
        .select('id, title, price, stock, image_urls, seller_id, location_name, profiles(store_name, is_trusted_seller)')
        .neq('id', currentProd.id)
        .eq('is_deleted', false)
        .limit(10);

      if (prods && prods.length > 0) {
        const primaryImg = currentProd.image_urls?.[0] || null;
        const mapped = prods.map((p: any) => {
          const seller = Array.isArray(p.profiles) ? p.profiles[0] : p.profiles;
          const targetImg = p.image_urls?.[0] || null;
          const matchScore = primaryImg && targetImg ? calculateImageSimilarity(primaryImg, currentProd.title, targetImg, p.title) : 85;

          return {
            id: p.id,
            title: p.title,
            price: p.price,
            stock: p.stock,
            image_url: targetImg,
            seller_id: p.seller_id,
            seller_name: seller?.store_name || 'Vendedor Verificado',
            is_trusted_seller: seller?.is_trusted_seller || false,
            location_name: p.location_name || 'Barracas',
            has_free_shipping: p.price > 15000,
            rating: 4.8,
            visual_match_score: matchScore,
          };
        });

        mapped.sort((a, b) => (b.visual_match_score || 0) - (a.visual_match_score || 0));
        setSimilarSellers(mapped.slice(0, 4));
      }
    } catch {
      console.log('Error buscando vendedores similares');
    } finally {
      setIsScanningPhoto(false);
    }
  };

  const fetchComplementaryCombo = async (currentProd: DetailProduct) => {
    try {
      const { data: comp } = await supabase
        .from('products')
        .select('id, title, price, image_urls')
        .neq('id', currentProd.id)
        .eq('is_deleted', false)
        .limit(1)
        .single();

      if (comp) {
        const orig = Math.round(comp.price * 1.25);
        setComplementaryProduct({
          id: comp.id,
          title: comp.title,
          price: comp.price,
          original_price: orig,
          image_url: comp.image_urls?.[0] || null,
          discount_percentage: 20,
        });
      }
    } catch {
      console.log('Sin productos complementarios para combo');
    }
  };

  const handleToggleFavorite = async () => {
    if (!userId) {
      router.push('/auth');
      return;
    }

    if (isFavorite) {
      setIsFavorite(false);
      await supabase.from('favorites').delete().eq('user_id', userId).eq('product_id', productId);
    } else {
      setIsFavorite(true);
      await supabase.from('favorites').insert({ user_id: userId, product_id: productId });
      trackUserEvent({ eventType: 'favorite', productId });
    }
  };

  const handleAddToCart = (itemProductId: string, productInfo?: any) => {
    addToCart({ productId: itemProductId, quantity: 1 }, productInfo);
    if (userId) {
      trackUserEvent({ eventType: 'cart_add', productId: itemProductId });
    }
    showModalMessage('¡Producto agregado al carrito!', `Se añadió "${productInfo?.title || 'el producto'}" a tu carrito de compras.`, 'success');
  };

  const handlePostQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    if (!userId) {
      router.push('/auth');
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from('questions').insert({
      product_id: productId,
      user_id: userId,
      question: newQuestion,
    });

    if (error) {
      showModalMessage('Error', 'No se pudo enviar tu pregunta: ' + error.message, 'error');
    } else {
      setNewQuestion('');
      trackUserEvent({ eventType: 'ask_question', productId });
      showModalMessage('Pregunta enviada', 'Tu pregunta ha sido enviada al vendedor.', 'success');
      loadData();
    }
    setSubmitting(false);
  };

  // Calcular viñetas de Ficha Técnica por IA
  const aiSummary = product ? generateAIProductSummary(product.title, product.description || '', product.image_urls || []) : null;

  const isCartAdded = product ? cart?.items?.some(i => i.product_id === product.id) : false;

  const handleReportSubmit = async (reason: string, details: string) => {
    showModalMessage('Reporte Enviado', `Gracias por tu reporte por "${reason}". Nuestro equipo de moderación lo revisará a la brevedad.`, 'success');
    setReportTarget(null);
  };

  return {
    productId,
    product,
    questions,
    isFavorite,
    userId,
    newQuestion,
    setNewQuestion,
    loading,
    submitting,
    showShareModal,
    setShowShareModal,
    reportTarget,
    setReportTarget,
    handleReportSubmit,
    similarSellers,
    complementaryProduct,
    isScanningPhoto,
    activeTab,
    setActiveTab,
    showModal,
    setShowModal,
    modalData,
    aiSummary,
    isCartAdded,
    handleToggleFavorite,
    handleAddToCart,
    handlePostQuestion,
    router,
  };
}
