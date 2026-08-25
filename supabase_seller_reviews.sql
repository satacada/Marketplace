-- ============================================================================
-- SCRIPT DE MIGRACIÓN SUPABASE: TABLA DE VALORACIONES Y RESEÑAS DE VENDEDORES
-- Estándar Multi-criterio de e-Commerce (Amazon, AliExpress & BestBuy)
-- ============================================================================

-- 1. Crear tabla de reseñas de vendedores con criterios de Amazon / AliExpress
CREATE TABLE IF NOT EXISTS public.seller_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  item_as_described_rating INTEGER DEFAULT 5 CHECK (item_as_described_rating >= 1 AND item_as_described_rating <= 5),
  shipping_speed_rating INTEGER DEFAULT 5 CHECK (shipping_speed_rating >= 1 AND shipping_speed_rating <= 5),
  communication_rating INTEGER DEFAULT 5 CHECK (communication_rating >= 1 AND communication_rating <= 5),
  packaging_rating INTEGER DEFAULT 5 CHECK (packaging_rating >= 1 AND packaging_rating <= 5),
  sentiment VARCHAR(20) NOT NULL CHECK (sentiment IN ('positive', 'neutral', 'negative')),
  comment TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Habilitar Row Level Security (RLS)
ALTER TABLE public.seller_reviews ENABLE ROW LEVEL SECURITY;

-- 3. Políticas de seguridad
CREATE POLICY "Cualquiera puede leer reseñas de vendedores"
  ON public.seller_reviews FOR SELECT USING (true);

CREATE POLICY "Usuarios autenticados pueden crear reseñas"
  ON public.seller_reviews FOR INSERT WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Usuarios pueden gestionar sus propias reseñas"
  ON public.seller_reviews FOR UPDATE USING (auth.uid() = buyer_id);

-- 4. Crear índices de rendimiento
CREATE INDEX IF NOT EXISTS idx_seller_reviews_seller ON public.seller_reviews(seller_id);
CREATE INDEX IF NOT EXISTS idx_seller_reviews_buyer ON public.seller_reviews(buyer_id);
CREATE INDEX IF NOT EXISTS idx_seller_reviews_sentiment ON public.seller_reviews(sentiment);

-- 5. Insertar datos iniciales de prueba con criterios multidimensionales
INSERT INTO public.seller_reviews (
  seller_id, buyer_id, rating, 
  item_as_described_rating, shipping_speed_rating, communication_rating, packaging_rating,
  sentiment, comment, created_at
)
SELECT 
  p.id as seller_id,
  p.id as buyer_id,
  5 as rating,
  5 as item_as_described_rating,
  5 as shipping_speed_rating,
  5 as communication_rating,
  5 as packaging_rating,
  'positive' as sentiment,
  '¡Excelente atención y rapidez en la entrega! Producto 100% tal cual la descripción.' as comment,
  NOW() - INTERVAL '2 days'
FROM public.profiles p
WHERE p.role = 'seller' OR p.store_name IS NOT NULL
ON CONFLICT DO NOTHING;
