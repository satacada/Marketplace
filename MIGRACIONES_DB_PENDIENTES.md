# Migraciones de Base de Datos Pendientes

## 📋 Resumen

El código del proyecto fue diseñado para una estructura de base de datos más completa que la actual en Supabase. Se han realizado ajustes temporales en el código para que funcione con la estructura actual, pero se recomienda ejecutar las migraciones pendientes para tener todas las funcionalidades.

---

## 🔍 Diferencias Encontradas

### Tabla `categories`

**Campos que faltan en la base de datos actual:**

| Campo | Tipo | Propósito | Estado Actual |
|-------|------|-----------|---------------|
| `description` | text | Descripción detallada de la categoría | ❌ No existe - comentado en código |
| `is_active` | boolean | Indica si la categoría está activa | ❌ No existe - comentado en código |
| `sort_order` | integer | Orden personalizado de categorías | ❌ No existe - reemplazado por orden alfabético |

**Soluciones temporales aplicadas:**
- Ordenamiento por `name` en lugar de `sort_order`
- Filtros por `is_active` deshabilitados
- Búsqueda por `description` deshabilitada
- Métodos `updateSortOrder` y `toggleActive` deshabilitados temporalmente

---

## 🚀 Migraciones Recomendadas

### 1. Agregar campos faltantes a la tabla `categories`

```sql
-- Agregar descripción a categorías
ALTER TABLE public.categories 
ADD COLUMN description text;

-- Agregar campo de estado activo/inactivo
ALTER TABLE public.categories 
ADD COLUMN is_active boolean DEFAULT true;

-- Agregar orden personalizado
ALTER TABLE public.categories 
ADD COLUMN sort_order integer DEFAULT 0;

-- Crear índice para ordenamiento
CREATE INDEX idx_categories_sort_order ON public.categories(sort_order);
```

### 2. Crear índices para mejorar performance

```sql
-- Índice para búsquedas por nombre
CREATE INDEX idx_categories_name ON public.categories USING gin(to_tsvector('english', name));

-- Índice para filtrado por nivel
CREATE INDEX idx_categories_level ON public.categories(level);

-- Índice para relaciones padre-hijo
CREATE INDEX idx_categories_parent_id ON public.categories(parent_id);

-- Índice compuesto para categorías activas por nivel
CREATE INDEX idx_categories_active_level ON public.categories(is_active, level) WHERE is_active = true;
```

### 3. Agregar campos adicionales recomendados

```sql
-- Campo para tracking de actualizaciones
ALTER TABLE public.categories 
ADD COLUMN updated_at timestamp with time zone DEFAULT timezone('utc'::text, now());

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Campo para slug (URL amigable)
ALTER TABLE public.categories 
ADD COLUMN slug text;

-- Índice único para slug
CREATE UNIQUE INDEX idx_categories_slug ON public.categories(slug);
```

---

## 🔄 Pasos para Actualizar el Código Después de Migraciones

### 1. Descomentar campos en tipos

**Archivo:** `src/features/categories/types/category.types.ts`

```typescript
export interface Category extends BaseEntity {
  id: string;
  name: string;
  description?: string; // ✅ Descomentar después de migración
  parent_id?: string;
  level: number;
  is_active: boolean; // ✅ Descomentar después de migración
  sort_order?: number; // ✅ Descomentar después de migración
  created_at: string;
  updated_at?: string; // ✅ Agregar después de migración
  slug?: string; // ✅ Agregar después de migración

  // Relaciones
  parent?: Category | null;
  children?: Category[];
  product_count?: number;
}
```

### 2. Restaurar ordenamiento por sort_order

**Archivo:** `src/infrastructure/repositories/category.repository.ts`

```typescript
// En findByLevel, findByParent, getCategoryTree
.order('sort_order', { ascending: true, nullsFirst: false })
// en lugar de
.order('name', { ascending: true })
```

### 3. Restaurar filtros is_active

**Archivo:** `src/infrastructure/repositories/category.repository.ts`

```typescript
// En search y otros métodos
.eq('is_active', true) // ✅ Descomentar después de migración
```

### 4. Restaurar búsqueda por description

**Archivo:** `src/infrastructure/repositories/category.repository.ts`

```typescript
// En search
query = query.or(`name.ilike.%${trimmedQuery}%,description.ilike.%${trimmedQuery}%`);
// ✅ Descomentar después de migración
```

### 5. Restaurar métodos completos

**Archivo:** `src/infrastructure/repositories/category.repository.ts`

```typescript
async updateSortOrder(categoryId: string, sortOrder: number): Promise<Category> {
  const { data, error } = await supabase
    .from(this.tableName)
    .update({ sort_order: sortOrder })
    .eq('id', categoryId)
    .select()
    .single();

  if (error) this.handleError(error);
  return data;
}

async toggleActive(categoryId: string, isActive: boolean): Promise<Category> {
  const { data, error } = await supabase
    .from(this.tableName)
    .update({ is_active: isActive })
    .eq('id', categoryId)
    .select()
    .single();

  if (error) this.handleError(error);
  return data;
}
```

### 6. Restaurar servicio completo

**Archivo:** `src/features/categories/services/category.service.ts`

```typescript
const categoryData = {
  name: input.name,
  description: input.description, // ✅ Descomentar después de migración
  parent_id: input.parentId || undefined,
  level: input.level,
  is_active: true, // ✅ Descomentar después de migración
  sort_order: input.sortOrder || 0, // ✅ Descomentar después de migración
};
```

---

## 📊 Estado Actual de Funcionalidades

| Funcionalidad | Estado Actual | Estado Después de Migración |
|--------------|---------------|-----------------------------|
| Listar categorías | ✅ Funcional (orden alfabético) | ✅ Funcional (orden personalizado) |
| Crear categorías | ⚠️ Parcial (sin description, is_active, sort_order) | ✅ Completo |
| Actualizar categorías | ⚠️ Parcial (sin description, is_active, sort_order) | ✅ Completo |
| Buscar categorías | ⚠️ Parcial (solo por nombre) | ✅ Completo (nombre + descripción) |
| Filtrar por activo | ❌ No disponible | ✅ Disponible |
| Orden personalizado | ❌ No disponible | ✅ Disponible |
| Árbol jerárquico | ✅ Funcional | ✅ Funcional |

---

## 🎯 Prioridad de Migraciones

### Alta Prioridad (Funcionalidad básica)
1. ✅ **Campos básicos**: `description`, `is_active`, `sort_order`
2. ✅ **Índices de performance**: Para búsquedas y filtros

### Media Prioridad (Mejoras)
3. ⚠️ **Campo `updated_at`**: Para tracking de cambios
4. ⚠️ **Campo `slug`**: Para URLs amigables

### Baja Prioridad (Opcional)
5. 🔹 **Triggers adicionales**: Para automatización
6. 🔹 **Constraints adicionales**: Para validación a nivel DB

---

## 🧪 Verificación Después de Migraciones

Después de ejecutar las migraciones, verificar:

1. **Crear categoría con todos los campos:**
```typescript
const result = await categoryService.createCategory({
  name: 'Electrónica',
  description: 'Productos electrónicos y gadgets',
  level: 1,
  sortOrder: 1
});
```

2. **Verificar ordenamiento personalizado:**
```typescript
const categories = await categoryService.getCategoriesByLevel(1);
// Deberían venir ordenadas por sort_order
```

3. **Verificar filtro por activo:**
```typescript
const activeCategories = await categoryService.searchCategories({
  isActive: true
});
```

4. **Verificar búsqueda por descripción:**
```typescript
const results = await categoryService.searchCategories({
  searchQuery: 'electrónica'
});
// Debería buscar en nombre y descripción
```

---

## 📝 Notas Importantes

1. **Las migraciones son opcionales**: El código actual funciona con la estructura de DB existente
2. **Sin breaking changes**: Las migraciones solo agregan funcionalidad, no rompen lo existente
3. **Backward compatible**: El código ajustado funciona con y sin las migraciones
4. **Performance**: Los índices recomendados mejoran significativamente el rendimiento
5. **Testing**: Probar cada funcionalidad después de cada migración

---

## 🚨 Precauciones

1. **Backup**: Siempre hacer backup de la base de datos antes de migraciones
2. **Testing environment**: Probar migraciones en ambiente de desarrollo primero
3. **Data migration**: Si hay datos existentes, considerar migración de datos
4. **Rollback plan**: Tener plan de rollback por si algo sale mal
5. **Downtime**: Algunas migraciones pueden requerir tiempo de inactividad

---

## 📞 Soporte

Si tienes problemas con las migraciones:

1. Verificar que tienes permisos de administrador en Supabase
2. Revisar logs de errores en el dashboard de Supabase
3. Validar que las migraciones se ejecutaron correctamente
4. Probar las funcionalidades afectadas manualmente