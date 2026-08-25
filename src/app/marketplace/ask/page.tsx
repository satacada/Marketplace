'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import { useCart } from '@/features/cart/hooks/useCart';
import { useOrders } from '@/features/orders/hooks/useOrders';

export default function AskQuestionPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [question, setQuestion] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const router = useRouter();

  const { cart } = useCart(userId);
  const { orders } = useOrders('buyer', userId);

  useEffect(() => {
    checkUserAndFetchData();
  }, []);

  const fetchChatHistory = useCallback(async (productId: string, currentUserId: string | null) => {
    if (!productId) return;
    
    let query = supabase
      .from('questions')
      .select('id, question, answer, created_at, is_answered, buyer_id')
      .eq('product_id', productId)
      .order('created_at', { ascending: true });

    if (currentUserId) {
      query = query.eq('buyer_id', currentUserId);
    }

    const { data } = await query;
    setChatHistory(data || []);
  }, []);

  const checkUserAndFetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUserId(user.id);
    }

    // Traer todos los productos aprobados
    const { data } = await supabase
      .from('products')
      .select('id, title, price, image_urls, profiles(store_name)')
      .eq('is_deleted', false)
      .eq('status', 'approved')
      .order('title');
    setProducts(data || []);
  };

  const handleProductSelect = (productId: string) => {
    setSelectedProductId(productId);
    const product = products.find(p => p.id === productId);
    setSelectedProduct(product);
    fetchChatHistory(productId, userId);
  };

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId || !question.trim()) return;

    // Si no está logueado, pedir login
    if (!userId) {
      router.push('/auth');
      return;
    }

    setIsSending(true);

    const { error } = await supabase.from('questions').insert([
      {
        product_id: selectedProductId,
        buyer_id: userId,
        question: question.trim(),
      },
    ]);

    setIsSending(false);

    if (error) {
      setMessage('Error al enviar: ' + error.message);
    } else {
      setMessage('¡Mensaje enviado al vendedor!');
      setQuestion('');
      fetchChatHistory(selectedProductId, userId);
      setTimeout(() => setMessage(''), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        cartItemCount={cart.itemCount}
        cartTotal={cart.total}
        ordersCount={orders.length}
      />

      <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-4">
          <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
            <span>💬</span> Messenger Marketplace
          </h1>
          <p className="text-xs text-gray-500">Conversa directamente con los vendedores sobre sus publicaciones</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[600px]">
          {/* Panel Izquierdo: Lista de publicaciones y chats */}
          <div className="lg:col-span-4 border-r border-gray-200 bg-gray-50/50 flex flex-col">
            <div className="p-4 border-b border-gray-200 bg-white">
              <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Publicaciones</h2>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {products.length === 0 ? (
                <p className="text-xs text-gray-500 text-center py-8">No hay publicaciones disponibles</p>
              ) : (
                products.map((product) => {
                  const isSelected = selectedProductId === product.id;
                  const formattedPrice = new Intl.NumberFormat('es-CL', {
                    style: 'currency',
                    currency: 'CLP',
                    maximumFractionDigits: 0,
                  }).format(product.price || 0);

                  return (
                    <button
                      key={product.id}
                      onClick={() => handleProductSelect(product.id)}
                      className={`w-full text-left p-3 rounded-xl transition flex items-center gap-3 ${
                        isSelected 
                          ? 'bg-blue-600 text-white shadow-xs' 
                          : 'hover:bg-gray-100 text-gray-800'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0 border border-black/10">
                        {product.image_urls?.[0] ? (
                          <img src={product.image_urls[0]} alt={product.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs">📦</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-bold text-sm truncate ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                          {product.title}
                        </p>
                        <p className={`text-xs font-semibold ${isSelected ? 'text-blue-100' : 'text-blue-600'}`}>
                          {formattedPrice}
                        </p>
                        <p className={`text-[10px] truncate ${isSelected ? 'text-blue-100' : 'text-gray-400'}`}>
                          📍 {product.profiles?.store_name || 'Vendedor'}
                        </p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Panel Derecho: Vista de Mensajería Estilo Facebook Messenger */}
          <div className="lg:col-span-8 flex flex-col bg-white">
            {!selectedProduct ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gray-50/30">
                <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-4xl mb-4 shadow-inner">
                  💬
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Selecciona una publicación</h3>
                <p className="text-xs text-gray-500 max-w-sm">
                  Elige un producto del panel izquierdo para chatear en tiempo real con el vendedor.
                </p>
              </div>
            ) : (
              <>
                {/* Header del Chat Messenger */}
                <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white shadow-2xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden border border-gray-200">
                      {selectedProduct.image_urls?.[0] && (
                        <img src={selectedProduct.image_urls[0]} alt={selectedProduct.title} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm">{selectedProduct.title}</h3>
                      <p className="text-xs text-gray-500">
                        Vendedor: <span className="font-semibold text-gray-700">{selectedProduct.profiles?.store_name || 'Tienda'}</span>
                      </p>
                    </div>
                  </div>

                  <Link 
                    href={`/marketplace/product/${selectedProduct.id}`}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition"
                  >
                    Ver detalle
                  </Link>
                </div>

                {/* Área de Conversación (Burbujas de Chat) */}
                <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
                  {message && (
                    <div className="bg-green-50 border border-green-200 text-green-800 text-xs p-3 rounded-xl text-center font-medium">
                      ✅ {message}
                    </div>
                  )}

                  {chatHistory.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-xs text-gray-400">Aún no hay mensajes en esta conversación.</p>
                      <p className="text-xs text-blue-600 font-semibold mt-1">¡Sé el primero en escribirle al vendedor!</p>
                    </div>
                  ) : (
                    chatHistory.map((item) => (
                      <div key={item.id} className="space-y-2">
                        {/* Mensaje enviado por el comprador (Burbuja Azul a la derecha) */}
                        <div className="flex justify-end">
                          <div className="max-w-[75%] bg-blue-600 text-white p-3 rounded-2xl rounded-tr-xs text-xs shadow-xs leading-relaxed">
                            <p className="font-medium">{item.question}</p>
                            <span className="text-[9px] text-blue-200 block text-right mt-1">
                              {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>

                        {/* Respuesta enviada por el vendedor (Burbuja Gris a la izquierda) */}
                        {item.answer && (
                          <div className="flex justify-start">
                            <div className="max-w-[75%] bg-gray-100 text-gray-800 border border-gray-200 p-3 rounded-2xl rounded-tl-xs text-xs leading-relaxed">
                              <p className="font-semibold text-[10px] text-blue-600 mb-0.5">Vendedor</p>
                              <p>{item.answer}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>

                {/* Campo de Entrada de Mensaje (Barra Messenger) */}
                <form onSubmit={handleAsk} className="p-3 border-t border-gray-200 bg-white flex gap-2 items-center">
                  <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Escribe un mensaje al vendedor..."
                    className="flex-1 px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-full text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none focus:bg-white transition"
                  />
                  <button
                    type="submit"
                    disabled={isSending || !question.trim()}
                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-5 py-2.5 rounded-full text-xs font-bold transition flex items-center gap-1 shadow-xs"
                  >
                    {isSending ? 'Enviando...' : 'Enviar ➔'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}