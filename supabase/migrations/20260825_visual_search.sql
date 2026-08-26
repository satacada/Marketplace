-- ============================================================================
-- MIGRACIÓN DE BÚSQUEDA VISUAL POR FOTO & VECTOR EMBEDDINGS (SUPABASE)
-- ============================================================================
-- Descripción: Agrega soporte de vectores de imágenes de 512 dimensiones para
--              búsqueda por reconocimiento de fotos desde ángulos diferentes.
-- ============================================================================

-- 1. Habilitar la extensión de vectores en PostgreSQL (Si no está habilitada)
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Agregar columna para firma vectorial de imagen en la tabla de productos
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS image_embedding vector(512);

-- 3. Crear índice IVFFlat o HNSW para búsquedas ultrarrápidas de similitud de fotos
CREATE INDEX IF NOT EXISTS products_image_embedding_idx 
ON public.products 
USING ivfflat (image_embedding vector_cosine_ops)
WITH (lists = 100);

-- 4. Función SQL RPC para consultar productos similares por distancia del coseno entre vectores de imagen
CREATE OR REPLACE FUNCTION match_products_by_image(
  target_embedding vector(512),
  match_threshold float,
  match_count int,
  target_product_id uuid,
  target_seller_id uuid
)
RETURNS TABLE (
  id uuid,
  title text,
  price numeric,
  stock int,
  image_urls text[],
  seller_id uuid,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.title,
    p.price,
    p.stock,
    p.image_urls,
    p.seller_id,
    1 - (p.image_embedding <=> target_embedding) AS similarity
  FROM public.products p
  WHERE p.id != target_product_id
    AND p.seller_id != target_seller_id
    AND p.is_deleted = false
    AND 1 - (p.image_embedding <=> target_embedding) > match_threshold
  ORDER BY similarity DESC
  LIMIT match_count;
END;
$$;
