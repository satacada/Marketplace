-- ============================================================================
-- SCRIPT DE MIGRACIÓN SUPABASE: TABLA DE VALORACIONES Y RESEÑAS DE VENDEDORES
-- ============================================================================
-- Ejecutar este script en Supabase -> SQL Editor para habilitar la persistencia
-- de comentarios positivos, negativos y estrellas de vendedores en la nube.
-- ============================================================================

-- 1. Crear tabla de reseñas de vendedores
CREATE TABLE IF NOT EXISTS public.seller_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  sentiment VARCHAR(20) NOT NULL CHECK (sentiment IN ('positive', 'neutral', 'negative')),
  comment TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Habilitar Row Level Security (RLS)
ALTER TABLE public.seller_reviews ENABLE ROW LEVEL SECURITY;

-- 3. Políticas de seguridad
-- Permitir lectura pública a cualquiera
CREATE POLICY "Cualquiera puede leer reseñas de vendedores"
  ON public.seller_reviews FOR SELECT USING (true);

-- Permitir a usuarios autenticados crear valoraciones
CREATE POLICY "Usuarios autenticados pueden crear reseñas"
  ON public.seller_reviews FOR INSERT WITH CHECK (auth.uid() = buyer_id);

-- Permitir al autor eliminar/actualizar su propia reseña
CREATE POLICY "Usuarios pueden gestionar sus propias reseñas"
  ON public.seller_reviews FOR UPDATE USING (auth.uid() = buyer_id);

-- 4. Crear índices de rendimiento
CREATE INDEX IF NOT EXISTS idx_seller_reviews_seller ON public.seller_reviews(seller_id);
CREATE INDEX IF NOT EXISTS idx_seller_reviews_buyer ON public.seller_reviews(buyer_id);
CREATE INDEX IF NOT EXISTS idx_seller_reviews_sentiment ON public.seller_reviews(sentiment);

-- 5. Insertar datos de prueba para tiendas iniciales
INSERT INTO public.seller_reviews (seller_id, buyer_id, rating, sentiment, comment, created_at)
SELECT 
  p.id as seller_id,
  p.id as buyer_id,
  5 as rating,
  'positive' as sentiment,
  '¡Excelente atención y rapidez en la entrega! Producto 100% recomendado.' as comment,
  NOW() - INTERVAL '2 days'
FROM public.profiles p
WHERE p.role = 'seller' OR p.store_name IS NOT NULL
ON CONFLICT DO NOTHING;
