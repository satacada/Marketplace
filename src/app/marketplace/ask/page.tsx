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

    // 2. Traer todos los productos para el menú desplegable
    const { data } = await supabase.from('products').select('id, title');
    setProducts(data || []);
  };

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !selectedProductId) return;

    // 3. Insertar la pregunta vinculada al producto y al comprador
    const { error } = await supabase.from('questions').insert([
      {
        product_id: selectedProductId,
        buyer_id: userId,
        question: question,
      },
    ]);

    if (error) {
      setMessage('Error: ' + error.message);
    } else {
      setMessage('¡Pregunta enviada exitosamente!');
      setQuestion('');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUserId(null);
    setCartItems([]);
    router.push('/auth');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header unificado con acciones de usuario */}
        
        <Header title="Hacer una Pregunta" />  

        {/* Formulario de pregunta */}
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md border border-gray-100">
          {message && (
            <div className={`p-3 rounded mb-4 ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleAsk} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Selecciona un producto:</label>
              <select 
                value={selectedProductId} 
                onChange={(e) => setSelectedProductId(e.target.value)} 
                required 
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Elige un producto --</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tu pregunta:</label>
              <textarea 
                value={question} 
                onChange={(e) => setQuestion(e.target.value)} 
                required 
                className="w-full p-3 border border-gray-300 rounded-lg h-32 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="Ej: ¿Tiene garantía? ¿Hacen envíos a todo el país?"
              />
            </div>

            <button type="submit" className="w-full bg-green-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-green-700 transition">
              Enviar Pregunta
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}