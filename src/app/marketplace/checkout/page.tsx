'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadCheckout();
  }, []);

  const loadCheckout = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/auth');
      return;
    }
    setUserId(user.id);

    // Traer carrito con datos del producto y seller_id
    const { data } = await supabase
      .from('cart_items')
      .select('id, quantity, product_id, products(title, price, image_urls, seller_id)')
      .eq('buyer_id', user.id);

    const items = data || [];
    setCartItems(items);
    
    const totalAmount = items.reduce((sum: number, item: any) => {
      return sum + (item.products.price * item.quantity);
    }, 0);
    setTotal(totalAmount);
  };

  const handleConfirmPurchase = async () => {
    if (!userId || cartItems.length === 0) return;
    setProcessing(true);

    try {
      // 1. Crear la Orden
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({ buyer_id: userId, total_amount: total })
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. Crear los Items de la Orden
      const itemsToInsert = cartItems.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        seller_id: item.products.seller_id,
        quantity: item.quantity,
        price_at_purchase: item.products.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(itemsToInsert);

      if (itemsError) throw itemsError;

      // 3. Vaciar el carrito
      await supabase.from('cart_items').delete().eq('buyer_id', userId);

      // 4. Redirigir al historial
      router.push('/dashboard/orders?success=true');
    } catch (error: any) {
      alert('Error al procesar la compra: ' + error.message);
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header unificado */}
        <Header title="Finalizar Compra" />

        {cartItems.length === 0 ? (
          <div className="bg-white p-12 rounded-lg shadow-md text-center border border-gray-100">
            <p className="text-gray-500 text-lg mb-4">No hay productos para comprar.</p>
            <Link href="/marketplace" className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 font-medium transition inline-block">
              Ir al Marketplace
            </Link>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex gap-4 items-center">
                  {item.products?.image_urls && item.products.image_urls.length > 0 && (
                    <img src={item.products.image_urls[0]} alt={item.products.title} className="w-20 h-20 object-cover rounded" />
                  )}
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{item.products?.title}</h3>
                    <p className="text-blue-600 font-semibold">${item.products?.price?.toLocaleString('es-CL')}</p>
                    <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="w-full md:w-80">
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 sticky top-8">
                <h2 className="text-xl font-bold mb-4">Resumen del Pedido</h2>
                <div className="flex justify-between mb-6 text-gray-600 border-b border-gray-100 pb-4">
                  <span className="text-lg font-bold">Total a pagar</span>
                  <span className="text-lg font-bold text-blue-600">${total.toLocaleString('es-CL')}</span>
                </div>
                
                <button 
                  onClick={handleConfirmPurchase}
                  disabled={processing}
                  className={`w-full py-3 rounded-lg font-bold text-white transition shadow-xs ${
                    processing ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {processing ? 'Procesando...' : 'Confirmar y Pagar'}
                </button>
                <p className="text-xs text-gray-400 mt-4 text-center">
                  * Esto es un MVP. No se procesa pago real.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}