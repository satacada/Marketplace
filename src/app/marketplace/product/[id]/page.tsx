'use client';

import { useEffect, useState, use } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ImageGallery from '@/components/marketplace/ImageGallery';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

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
  categories: { name: string } | null;
  profiles: { store_name: string | null; email: string | null } | null;
};

type Question = {
  id: string;
  question: string;
  answer: string | null;
  created_at: string;
  profiles: { store_name: string | null } | null;
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
      .eq('is_deleted', false)
      .single();

    if (productError || !productData) {
      showModalMessage('Error', 'Producto no encontrado', 'error');
      router.push('/marketplace');
      setLoading(false);
      return;
    }

    setProduct(productData as Product);

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

    // 4. Verificar si es favorito
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
      setNewQuestion('');
      loadData(); // Recargar preguntas
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <p className="text-gray-500 text-center py-8">Cargando producto...</p>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link href="/marketplace" className="text-indigo-600 hover:text-indigo-700 text-sm">
            ← Volver al Marketplace
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Galería de imágenes */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
            <ImageGallery images={product.image_urls || []} />
          </div>

          {/* Información del producto */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
            <div className="mb-4">
              {product.categories?.name && (
                <span className="inline-block text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded mb-2">
                  {product.categories.name}
                </span>
              )}
              <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>
            </div>

            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-4xl font-bold text-indigo-600">${product.price}</span>
              <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.stock > 0 ? `Stock: ${product.stock} disponibles` : 'Sin stock'}
              </span>
            </div>

            <div className="prose prose-gray mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Descripción</h3>
              <p className="text-gray-600 whitespace-pre-wrap">{product.description}</p>
            </div>

            <div className="border-t border-gray-200 pt-4 mb-6">
              <p className="text-xs text-gray-500 mb-1">Vendido por:</p>
              <p className="text-lg font-semibold text-gray-900">
                {product.profiles?.store_name || 'Tienda sin nombre'}
              </p>
            </div>
            {/* Botones de acción */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || product.seller_id === userId}
                className={`flex-1 py-3 rounded-lg font-bold text-white transition ${
                  product.stock === 0 || product.seller_id === userId
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {product.seller_id === userId ? 'Es tu producto' : ' Agregar al carrito'}
              </button>
              
              {/* Solo mostrar favoritos si NO es tu propio producto */}
              {product.seller_id !== userId && (
                <button
                  onClick={handleToggleFavorite}
                  className={`px-6 py-3 rounded-lg font-bold transition ${
                    isFavorite
                      ? 'bg-red-100 text-red-600 hover:bg-red-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {isFavorite ? '❤️' : '🤍'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Sección de Preguntas */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Preguntas y Respuestas</h2>

          {/* Lista de preguntas existentes */}
          {questions.length > 0 ? (
            <div className="space-y-4 mb-8">
              {questions.map((q) => (
                <div key={q.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                  <div className="flex gap-3 mb-2">
                    <span className="text-2xl">❓</span>
                    <div className="flex-1">
                      <p className="text-gray-900 font-medium">{q.question}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(q.created_at).toLocaleDateString('es-AR')}
                      </p>
                    </div>
                  </div>
                  
                  {q.answer && (
                    <div className="flex gap-3 ml-8">
                      <span className="text-2xl">✅</span>
                      <div className="flex-1 bg-green-50 p-3 rounded">
                        <p className="text-gray-900">{q.answer}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Respondido por: {q.profiles?.store_name || 'Vendedor'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4 mb-8">
              Aún no hay preguntas sobre este producto. ¡Sé el primero!
            </p>
          )}

          {/* Formulario para hacer pregunta */}
          {userId && product.seller_id !== userId && (
            <form onSubmit={handleAskQuestion} className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Haz una pregunta sobre este producto</h3>
              <textarea
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                required
                placeholder="Ej: ¿Tiene garantía? ¿Hacen envíos a todo el país?"
                className="w-full p-3 border border-gray-300 rounded-lg h-24 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-3"
              />
              <button
                type="submit"
                disabled={submitting || !newQuestion.trim()}
                className={`px-6 py-2 rounded-lg font-medium text-white transition ${
                  submitting || !newQuestion.trim()
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {submitting ? 'Enviando...' : 'Enviar Pregunta'}
              </button>
            </form>
          )}

          {!userId && (
            <div className="border-t border-gray-200 pt-6 text-center">
              <p className="text-gray-600 mb-3">¿Tienes preguntas sobre este producto?</p>
              <Link href="/auth" className="text-blue-600 hover:text-blue-700 font-medium">
                Inicia sesión para preguntar
              </Link>
            </div>
          )}
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
    </div>
  );
}