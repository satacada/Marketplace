'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CartPage() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/auth');
      return;
    }
    setUserId(user.id);

    // Traer items del carrito junto con los datos del producto
    const { data } = await supabase
      .from('cart_items')
      .select('id, quantity, products(title, price, image_urls)')
      .eq('buyer_id', user.id);

    const items = data || [];
    setCartItems(items);
    
    // Calcular total
    const totalAmount = items.reduce((sum: number, item: any) => {
      return sum + (item.products.price * item.quantity);
    }, 0);
    setTotal(totalAmount);
  };

  const handleRemove = async (itemId: string) => {
    const { error } = await supabase.from('cart_items').delete().eq('id', itemId);
    if (!error) {
      setCartItems(cartItems.filter(item => item.id !== itemId));
      // Recalcular total
      const newTotal = cartItems
        .filter(item => item.id !== itemId)
        .reduce((sum: number, item: any) => sum + (item.products.price * item.quantity), 0);
      setTotal(newTotal);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mi Carrito de Compras</h1>
          <Link href="/marketplace" className="text-indigo-600 hover:text-indigo-800 font-medium">
            ← Seguir comprando
          </Link>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white p-12 rounded-lg shadow-md text-center">
            <p className="text-gray-500 text-lg mb-4">Tu carrito está vacío.</p>
            <Link href="/marketplace" className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700">
              Ir al Marketplace
            </Link>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-8">
            {/* Lista de productos */}
            <div className="flex-1 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm flex gap-4 items-center">
                  {item.products.image_urls && item.products.image_urls.length > 0 && (
                    <img src={item.products.image_urls[0]} alt={item.products.title} className="w-20 h-20 object-cover rounded" />
                  )}
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{item.products.title}</h3>
                    <p className="text-indigo-600 font-semibold">${item.products.price}</p>
                    <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                  </div>
                  <button 
                    onClick={() => handleRemove(item.id)}
                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>

            {/* Resumen de compra */}
            <div className="w-full md:w-80">
              <div className="bg-white p-6 rounded-lg shadow-md sticky top-8">
                <h2 className="text-xl font-bold mb-4">Resumen</h2>
                <div className="flex justify-between mb-4 text-gray-600">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-6 text-gray-600">
                  <span>Envío</span>
                  <span>Gratis</span>
                </div>
                <div className="border-t pt-4 flex justify-between mb-6">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-lg font-bold text-indigo-600">${total.toFixed(2)}</span>
                </div>
                <Link href="/marketplace/checkout" className="block w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition text-center">
                    Proceder al Pago
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}