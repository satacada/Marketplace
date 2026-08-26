-- ============================================================================
-- MIGRACIÓN DE TELEMETRÍA DE EVENTOS Y PERFILAMIENTO DE COMPORTAMIENTO
-- ============================================================================

-- 1. Tabla de Registro de Eventos de Navegación en Tiempo Real
CREATE TABLE IF NOT EXISTS user_event_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id TEXT NOT NULL,
  event_type TEXT NOT NULL, -- 'view', 'hover_photo', 'search', 'favorite', 'cart_add', 'cart_abandon', 'ask_question', 'visual_search'
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  search_query TEXT,
  dwell_time_seconds INT DEFAULT 0,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabla de Perfil Consolidado de Preferencias del Usuario (IA Recomendadora)
CREATE TABLE IF NOT EXISTS user_behavior_profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  top_categories UUID[] DEFAULT '{}',
  preferred_price_min NUMERIC(10,2) DEFAULT 0,
  preferred_price_max NUMERIC(10,2) DEFAULT 0,
  interest_keywords TEXT[] DEFAULT '{}',
  purchase_intent_score INT DEFAULT 0, -- Score de 0 a 100
  last_active_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices de alto rendimiento para consultas de IA
CREATE INDEX IF NOT EXISTS idx_user_event_logs_user_id ON user_event_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_user_event_logs_session_id ON user_event_logs(session_id);
CREATE INDEX IF NOT EXISTS idx_user_event_logs_product_id ON user_event_logs(product_id);
CREATE INDEX IF NOT EXISTS idx_user_event_logs_event_type ON user_event_logs(event_type);
CREATE INDEX IF NOT EXISTS idx_user_event_logs_created_at ON user_event_logs(created_at DESC);

-- Habilitar RLS (Row Level Security)
ALTER TABLE user_event_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_behavior_profiles ENABLE ROW LEVEL SECURITY;

-- Políticas para Insertar y Consultar Eventos
CREATE POLICY "Permitir insercion publica de eventos de telemetria" 
  ON user_event_logs 
  FOR INSERT 
  TO public 
  WITH CHECK (true);

CREATE POLICY "Permitir lectura de eventos propios o anonimos" 
  ON user_event_logs 
  FOR SELECT 
  TO public 
  USING (user_id IS NULL OR user_id = auth.uid());

CREATE POLICY "Permitir gestion de perfil de comportamiento propio" 
  ON user_behavior_profiles 
  FOR ALL 
  TO authenticated 
  USING (user_id = auth.uid());
