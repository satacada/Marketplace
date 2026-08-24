'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';

export default function AskQuestionPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [question, setQuestion] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [cartItems, setCartItems] = useState<string[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    checkUserAndFetchData();
  }, []);

  const checkUserAndFetchData = async () => {
    // 1. Verificar que el comprador esté logueado
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUserId(user.id);
      
      // Obtener items del carrito para el header
      const { data: cartData } = await supabase
        .from('cart_items')
        .select('product_id')
        .eq('buyer_id', user.id);
      setCartItems(cartData?.map((item: any) => item.product_id) || []);
    }

    // 2. Traer todos los productos con información relevante
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
  };

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !selectedProductId) return;

    setIsSending(true);

    // 3. Insertar la pregunta vinculada al producto y al comprador
    const { error } = await supabase.from('questions').insert([
      {
        product_id: selectedProductId,
        buyer_id: userId,
        question: question,
      },
    ]);

    setIsSending(false);

    if (error) {
      setMessage('Error: ' + error.message);
    } else {
      setMessage('¡Pregunta enviada exitosamente! El vendedor te responderá pronto.');
      setQuestion('');
      setTimeout(() => setMessage(''), 5000);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUserId(null);
    setCartItems([]);
    router.push('/auth');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
      <div className="max-w-6xl mx-auto">
        <Header title="💬 Chat con Vendedores" />  

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Panel de productos */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                <h2 className="text-lg font-bold text-white">Selecciona un Producto</h2>
                <p className="text-blue-100 text-sm">Elige para iniciar el chat</p>
              </div>
              
              <div className="p-4 max-h-96 overflow-y-auto">
                {products.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No hay productos disponibles</p>
                ) : (
                  <div className="space-y-2">
                    {products.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => handleProductSelect(product.id)}
                        className={`w-full text-left p-3 rounded-lg border-2 transition ${
                          selectedProductId === product.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {product.image_urls && product.image_urls[0] && (
                            <img 
                              src={product.image_urls[0]} 
                              alt={product.title}
                              className="w-12 h-12 object-cover rounded"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">{product.title}</p>
                            <p className="text-sm text-blue-600 font-bold">${product.price}</p>
                            <p className="text-xs text-gray-500 truncate">
                              {product.profiles?.store_name || 'Tienda'}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Panel de chat */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              {!selectedProduct ? (
                <div className="p-12 text-center">
                  <div className="text-6xl mb-4">💬</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Selecciona un producto</h3>
                  <p className="text-gray-600">Elige un producto de la lista para iniciar una conversación con el vendedor</p>
                </div>
              ) : (
                <>
                  {/* Header del chat */}
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center gap-4">
                    {selectedProduct.image_urls && selectedProduct.image_urls[0] && (
                      <img 
                        src={selectedProduct.image_urls[0]} 
                        alt={selectedProduct.title}
                        className="w-12 h-12 object-cover rounded-lg border-2 border-white"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white">{selectedProduct.title}</h3>
                      <p className="text-blue-100 text-sm">
                        Vendido por: {selectedProduct.profiles?.store_name || 'Tienda'}
                      </p>
                    </div>
                    <div className="text-white text-right">
                      <p className="text-2xl font-bold">${selectedProduct.price}</p>
                    </div>
                  </div>

                  {/* Área de mensajes */}
                  <div className="p-6">
                    {message && (
                      <div className={`p-4 rounded-lg mb-4 ${
                        message.includes('Error') 
                          ? 'bg-red-100 border border-red-200 text-red-700' 
                          : 'bg-green-100 border border-green-200 text-green-700'
                      }`}>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{message.includes('Error') ? '❌' : '✅'}</span>
                          <p className="font-medium">{message}</p>
                        </div>
                      </div>
                    )}

                    <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                          U
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-500 mb-1">Tu pregunta</p>
                          <form onSubmit={handleAsk} className="space-y-3">
                            <textarea
                              value={question}
                              onChange={(e) => setQuestion(e.target.value)}
                              required
                              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                              placeholder="Escribe tu pregunta al vendedor..."
                              rows={4}
                            />
                            <div className="flex gap-2">
                              <button
                                type="submit"
                                disabled={isSending}
                                className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                              >
                                {isSending ? (
                                  <>
                                    <span className="animate-spin">⏳</span>
                                    Enviando...
                                  </>
                                ) : (
                                  <>
                                    <span>📤</span>
                                    Enviar Pregunta
                                  </>
                                )}
                              </button>
                              <button
                                type="button"
                                onClick={() => setQuestion('')}
                                className="px-4 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                              >
                                Limpiar
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>

                    {/* Tips de conversación */}
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-100">
                      <h4 className="font-medium text-purple-900 mb-2 flex items-center gap-2">
                        <span>💡</span> Tips para mejores respuestas:
                      </h4>
                      <ul className="text-sm text-purple-700 space-y-1">
                        <li>• Sé específico sobre lo que necesitas saber</li>
                        <li>• Pregunta sobre stock, envíos o garantía</li>
                        <li>• Los vendedores responden más rápido a preguntas claras</li>
                        <li>• Puedes hacer múltiples preguntas sobre el mismo producto</li>
                      </ul>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}