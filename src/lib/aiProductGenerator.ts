/**
 * ============================================================================
 * FILE: aiProductGenerator.ts
 * ============================================================================
 * 
 * @description Servicio de Inteligencia Artificial para la generación
 *              de Ficha Técnica Estructurada y "✦ Resumen de IA del artículo"
 *              al estilo AliExpress con especificaciones particulares por modelo y marca.
 * 
 * @module Infrastructure/Services/AIProductGenerator
 * ============================================================================
 */

export type AISummaryBullet = {
  title: string;
  description: string;
};

export type AIGeneratedProductData = {
  optimizedTitle: string;
  enhancedDescription: string;
  summaryBullets: AISummaryBullet[];
  suggestedTags: string[];
  specs: Record<string, string>;
  category: string;
};

export type ProductAttributes = {
  brand?: string;
  model?: string;
  material?: string;
  condition?: string;
};

/**
 * Base de Conocimiento de Productos y Especificaciones de IA estilo AliExpress
 */
const WEB_KNOWLEDGE_MATRIX: {
  matchKeywords: string[];
  domain: string;
  category: string;
  titleBuilder: (brand: string, model: string, condition: string) => string;
  bullets: (brand: string, model: string, material: string, condition: string) => AISummaryBullet[];
}[] = [
  // AIR JORDAN 6 RETRO / JORDAN 6
  {
    matchKeywords: ['jordan 6', 'jordan vi', 'air jordan 6', 'aj6'],
    domain: 'footwear',
    category: 'Moda y Calzado',
    titleBuilder: (b, m, c) => `Nike Air Jordan 6 Retro — Silueta Icónica 1991 (${c})`,
    bullets: (b, m, mat, c) => [
      {
        title: 'Diseño de Campeonato de 1991 (Tinker Hatfield)',
        description: 'Silueta histórica inspirada en el automóvil deportivo de Michael Jordan, con paneles reforzados de soporte y geometría aerodinámica.'
      },
      {
        title: 'Cápsula Air-Sole Visible & Suela Translúcida Icy',
        description: 'Unidad de amortiguación de aire expuesta en el talón y suela de goma con acabado transparente "icy" de tracción multidireccional.'
      },
      {
        title: 'Lengüeta de Neopreno con Tiradores y Jumpman Lace Lock',
        description: 'Construcción con doble agujero en la lengüeta para calce rápido, tirador posterior tipo alerón y sujetador de cordones Lace Lock original.'
      },
      {
        title: `Capelada Exterior en ${mat || 'Cuero / Nubuck Premium'}`,
        description: `Materiales de alta durabilidad con microperforaciones laterales para ventilación continua y firmeza estructural superior.`
      },
      {
        title: `Estado y Verificación: ${c}`,
        description: `Unidad en condición ${c.toLowerCase()}, con costuras de alta densidad probadas y conservación intacta de la suela.`
      }
    ]
  },
  // AIR JORDAN 1 / JORDAN 1
  {
    matchKeywords: ['jordan 1', 'jordan i', 'air jordan 1', 'aj1'],
    domain: 'footwear',
    category: 'Moda y Calzado',
    titleBuilder: (b, m, c) => `Nike Air Jordan 1 Retro High — Edición Clásica (${c})`,
    bullets: (b, m, mat, c) => [
      {
        title: 'Silueta Leyenda del Baloncesto de 1985',
        description: 'Perfil alto característico con el logotipo gráfico "Wings" estampado en el tobillo y diseño de bloques de color vintage.'
      },
      {
        title: 'Amortiguación Air-Sole Encapsulada',
        description: 'Unidad de aire oculta en la entresuela de espuma para confort diario y protección contra impactos en el talón.'
      },
      {
        title: `Confección Exterior en ${mat || 'Cuero Genuino'}`,
        description: `Capelada de cuero de grano entero que ofrece flexibilidad, durabilidad y una pátina estética distintiva con el tiempo.`
      },
      {
        title: 'Suela de Goma vulcanizada con Punto de Pivote',
        description: 'Huella con diseño circular en el antepié para giros fluidos y máxima adherencia en asfalto y pavimento.'
      },
      {
        title: `Condición del Calzado: ${c}`,
        description: `Calzado verificado en estado ${c.toLowerCase()}, sin deformaciones en puntera ni desgaste anómalo.`
      }
    ]
  },
  // NIKE AIR MAX
  {
    matchKeywords: ['air max', 'airmax', 'max dn', 'max 90'],
    domain: 'footwear',
    category: 'Moda y Calzado',
    titleBuilder: (b, m, c) => `${b || 'Nike'} ${m || 'Air Max'} — Confort y Cámara de Aire (${c})`,
    bullets: (b, m, mat, c) => [
      {
        title: 'Cámara de Aire Expuesta de Alto Impacto',
        description: 'Sistema de amortiguación Air Max en el talón que proporciona elasticidad en cada pisada y absorción de energía continua.'
      },
      {
        title: `Capelada en ${mat || 'Malla Textil y Sintético'}`,
        description: `Construcción transpirable ultraligera que mantiene el pie fresco mientras los refuerzos sintéticos protegen el contorno.`
      },
      {
        title: 'Suela de Goma Waffle Antideslizante',
        description: 'Patrón acanalado de alta tracción en todo tipo de terreno urbano y deportivo.'
      },
      {
        title: 'Ajuste Ergonómico Acolchado',
        description: 'Cuello mullido alrededor del tobillo y plantilla interior moldeada que reduce la fatiga muscular.'
      },
      {
        title: `Condición del Calzado: ${c}`,
        description: `Unidad en condición ${c.toLowerCase()}, lista para uso inmediato con cámaras de aire totalmente herméticas.`
      }
    ]
  },
  // IPHONE 15 / 15 PRO / IPHONE
  {
    matchKeywords: ['iphone 15', 'iphone 14', 'iphone 13', 'iphone'],
    domain: 'electronics',
    category: 'Electrónica',
    titleBuilder: (b, m, c) => `Apple ${m || 'iPhone'} — Pantalla OLED & Cámara Pro (${c})`,
    bullets: (b, m, mat, c) => [
      {
        title: 'Construcción Premium con Ceramic Shield',
        description: 'Frente ultrarresistente a caídas y arañazos con marco metálico redondeado para un agarre suave e impecable.'
      },
      {
        title: 'Pantalla Super Retina XDR OLED',
        description: 'Panel de colores vibrantes y negros puros con tecnología de alto brillo para legibilidad bajo luz solar directa.'
      },
      {
        title: 'Sistema de Cámaras Avanzado de Alta Resolución',
        description: 'Captura fotográfica de nitidez profesional con modo Noche automático, estabilización óptica de imagen y video 4K HDR.'
      },
      {
        title: 'Chip Apple Bionic & Conectividad Ultra Rápida',
        description: 'Rendimiento fluido en edición de video, juegos exigentes y multitarea con gestión de energía eficiente.'
      },
      {
        title: `Verificación Operativa: ${c}`,
        description: `Dispositivo probado en condición ${c.toLowerCase()}, pasando test de pantalla, parlantes, micrófono y estado de batería.`
      }
    ]
  },
  // SAMSUNG GALAXY S24 / S23 / GALAXY
  {
    matchKeywords: ['galaxy s24', 'galaxy s23', 'samsung galaxy', 'galaxy ultra'],
    domain: 'electronics',
    category: 'Electrónica',
    titleBuilder: (b, m, c) => `Samsung ${m || 'Galaxy'} — Cámara ProVisual & Pantalla 120Hz (${c})`,
    bullets: (b, m, mat, c) => [
      {
        title: 'Pantalla Dynamic AMOLED 2X a 120Hz',
        description: 'Tasa de refresco adaptativa de máxima fluidez con cristal protector Corning Gorilla de alta resistencia.'
      },
      {
        title: 'Sensor de Cámara de Alta Resolución con IA',
        description: 'Motor fotográfico Nightography para imágenes nocturnas ultra claras y zoom óptico de alta definición.'
      },
      {
        title: 'Procesador Snapdragon / Exynos de Alto Rendimiento',
        description: 'Potencia avanzada para juegos móviles, edición multimedia y herramientas de productividad en multitarea.'
      },
      {
        title: 'Batería Intuitiva de Larga Duración',
        description: 'Carga rápida inteligente y gestión térmica que prolonga la autonomía durante todo el día.'
      },
      {
        title: `Estado Operativo: ${c}`,
        description: `Equipo probado en estado ${c.toLowerCase()}, con huella dactilar en pantalla y conectividad 100% funcional.`
      }
    ]
  },
  // PLAYSTATION 5 / PS5
  {
    matchKeywords: ['playstation 5', 'ps5', 'playstation'],
    domain: 'electronics',
    category: 'Electrónica',
    titleBuilder: (b, m, c) => `Sony PlayStation 5 — SSD Ultra Rápido & Gráficos 4K (${c})`,
    bullets: (b, m, mat, c) => [
      {
        title: 'Unidad SSD NVMe Ultra Rápida de Última Generación',
        description: 'Tiempos de carga casi nulos en juegos instalados con arquitectura de transferencia de datos de alta velocidad.'
      },
      {
        title: 'Mando Inalámbrico DualSense con Respuesta Háptica',
        description: 'Gatillos adaptables dinámicos que simulan la resistencia y sensación de armas, frenos y texturas del juego.'
      },
      {
        title: 'Motor de Audio Tempest 3D & Ray Tracing en 4K',
        description: 'Renderizado tridimensional de iluminación realista a 60 fps / 120 fps en pantallas HDR compatibles.'
      },
      {
        title: `Estado de la Consola: ${c}`,
        description: `Consola probada en condición ${c.toLowerCase()}, sin problemas de lectura de discos ni temperatura de ventilación.`
      }
    ]
  }
];

/**
 * Genera la Ficha Técnica Explicativa y "✦ Resumen de IA del artículo" estilo AliExpress
 * buscando coincidencia en la matriz de conocimiento web o sintetizando viñetas específicas.
 */
export function generateAIProductSummary(
  title: string,
  rawDescription: string,
  imageUrls: string[] = [],
  attributes?: ProductAttributes
): AIGeneratedProductData {
  const brand = attributes?.brand?.trim() || '';
  const model = attributes?.model?.trim() || '';
  const material = attributes?.material?.trim() || '';
  const condition = attributes?.condition?.trim() || 'Nuevo';

  const rawTitleClean = title.trim();
  const rawDescClean = rawDescription.trim();
  const fullSearchText = `${rawTitleClean} ${brand} ${model} ${rawDescClean}`.toLowerCase();

  // Buscar coincidencia en la matriz de conocimiento web
  const matchedProduct = WEB_KNOWLEDGE_MATRIX.find(item =>
    item.matchKeywords.some(kw => fullSearchText.includes(kw))
  );

  if (matchedProduct) {
    const finalTitle = matchedProduct.titleBuilder(brand || 'Marca', model || 'Modelo', condition);
    const bullets = matchedProduct.bullets(brand, model, material, condition);
    const bulletsFormatted = bullets.map(b => `• **${b.title}**: ${b.description}`).join('\n\n');

    const enhancedDescription = `✦ Resumen de IA del artículo\nAviso legal: Este contenido está generado por IA y no representa la opinión del vendedor. La plataforma y los vendedores no asumen ninguna responsabilidad legal al respecto.\n\n${bulletsFormatted}`;

    return {
      optimizedTitle: finalTitle,
      enhancedDescription,
      summaryBullets: bullets,
      suggestedTags: [brand, model, material, matchedProduct.category].filter(Boolean),
      specs: {
        'Estado': condition,
        'Marca': brand || 'Destacada',
        'Modelo': model || 'Especializado',
        'Material': material || 'Resistente'
      },
      category: matchedProduct.category
    };
  }

  // Generador dinámico para productos personalizados
  let categoryName = 'Moda y Calzado';
  let domainTitle = 'Estructura y Calidad de Confección';

  if (fullSearchText.includes('auto') || fullSearchText.includes('moto') || fullSearchText.includes('vehiculo')) {
    categoryName = 'Vehículos';
    domainTitle = 'Motorización y Rendimiento Mecánico';
  } else if (fullSearchText.includes('casa') || fullSearchText.includes('terreno') || fullSearchText.includes('inmueble') || fullSearchText.includes('departamento')) {
    categoryName = 'Inmuebles';
    domainTitle = 'Distribución de Ambientes y Espacios';
  } else if (fullSearchText.includes('tv') || fullSearchText.includes('celular') || fullSearchText.includes('laptop') || fullSearchText.includes('consola') || fullSearchText.includes('tecnologia')) {
    categoryName = 'Electrónica';
    domainTitle = 'Procesamiento y Rendimiento Tecnológico';
  } else if (fullSearchText.includes('herramienta') || fullSearchText.includes('mueble') || fullSearchText.includes('mesa') || fullSearchText.includes('taladro')) {
    categoryName = 'Hogar y Herramientas';
    domainTitle = 'Resistencia y Estructura Reforzada';
  }

  const generatedBullets: AISummaryBullet[] = [
    {
      title: `${domainTitle}: ${brand || 'Alta Gama'} ${model || ''}`.trim(),
      description: `Diseño concebido para brindar un rendimiento superior en ${rawTitleClean || 'uso cotidiano'}, con ingeniería probada en cada detalle de fabricación.`
    },
    {
      title: `Material Principal: ${material || 'Sintético / Textil de Alta Durabilidad'}`,
      description: `Confeccionado en ${material || 'materiales de alta durabilidad'}, resistiendo el desgaste continuo y manteniendo su forma estética.`
    },
    {
      title: 'Diseño Ergonómico y Funcionalidad Práctica',
      description: 'Dimensiones y contorno equilibrados que aseguran un manejo cómodo y adaptación versátil en cualquier ambiente.'
    },
    {
      title: `Condición de Verificación: ${condition}`,
      description: `Artículo inspeccionado en estado ${condition.toLowerCase()}, verificado para garantizar el 100% de su integridad técnica.`
    }
  ];

  const bulletsFormatted = generatedBullets.map(b => `• **${b.title}**: ${b.description}`).join('\n\n');
  const enhancedDescription = `✦ Resumen de IA del artículo\nAviso legal: Este contenido está generado por IA y no representa la opinión del vendedor. La plataforma y los vendedores no asumen ninguna responsabilidad legal al respecto.\n\n${bulletsFormatted}`;

  const titleSuffix = brand || model ? `${brand} ${model}`.trim() : rawTitleClean || 'Producto en Venta';

  return {
    optimizedTitle: `${titleSuffix} — (${condition})`,
    enhancedDescription,
    summaryBullets: generatedBullets,
    suggestedTags: [brand, model, material, categoryName].filter(Boolean),
    specs: {
      'Estado': condition,
      'Marca': brand || 'General',
      'Modelo': model || 'Único',
      'Material': material || 'Estándar'
    },
    category: categoryName
  };
}
