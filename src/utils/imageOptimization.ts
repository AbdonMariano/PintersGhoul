/**
 * Utilidades para optimización de imágenes al estilo Pinterest
 * 
 * Este archivo proporciona funciones para:
 * - Generar relaciones de aspecto variadas para layout de mampostería
 * - Optimizar dimensiones de imágenes
 * - Simular comportamiento de imágenes con diferentes proporciones
 */

// Relación de aspecto óptima de Pinterest: 2:3 (vertical)
export const OPTIMAL_ASPECT_RATIO = 2 / 3;

// Rangos de relación de aspecto permitidos
export const MIN_ASPECT_RATIO = 0.5; // 1:2 (muy vertical)
export const MAX_ASPECT_RATIO = 1.5; // 3:2 (horizontal)

// Ancho estándar de referencia para cálculos
export const REFERENCE_WIDTH = 1000;

/**
 * Relaciones de aspecto comunes en Pinterest
 * Basadas en las proporciones más populares de pins
 */
export const COMMON_ASPECT_RATIOS = [
  { width: 2, height: 3, label: 'Óptimo Pinterest (2:3)' },      // 0.667
  { width: 3, height: 4, label: 'Retrato estándar (3:4)' },      // 0.75
  { width: 1, height: 1, label: 'Cuadrado (1:1)' },              // 1.0
  { width: 4, height: 5, label: 'Retrato móvil (4:5)' },         // 0.8
  { width: 9, height: 16, label: 'Vertical móvil (9:16)' },      // 0.56
  { width: 1, height: 2, label: 'Muy vertical (1:2)' },          // 0.5
  { width: 4, height: 3, label: 'Paisaje (4:3)' },               // 1.33
];

/**
 * Genera dimensiones para una imagen basándose en una relación de aspecto
 * @param aspectRatio Relación ancho/alto
 * @param referenceWidth Ancho de referencia (por defecto 1000px)
 * @returns Objeto con width y height
 */
export function generateDimensions(
  aspectRatio: number = OPTIMAL_ASPECT_RATIO,
  referenceWidth: number = REFERENCE_WIDTH
): { width: number; height: number } {
  // Limitar la relación de aspecto a rangos razonables
  const clampedRatio = Math.max(
    MIN_ASPECT_RATIO,
    Math.min(MAX_ASPECT_RATIO, aspectRatio)
  );
  
  const height = Math.round(referenceWidth / clampedRatio);
  
  return {
    width: referenceWidth,
    height: height,
  };
}

/**
 * Genera dimensiones aleatorias con variación natural
 * Simula la variedad de imágenes que se encuentran en Pinterest
 * @param index Índice para generar variación determinística
 * @returns Objeto con width y height
 */
export function generateVariedDimensions(index: number): { width: number; height: number } {
  // Usar el índice para seleccionar una relación de aspecto de forma determinística
  const ratioIndex = index % COMMON_ASPECT_RATIOS.length;
  const ratio = COMMON_ASPECT_RATIOS[ratioIndex];
  
  const aspectRatio = ratio.width / ratio.height;
  
  return generateDimensions(aspectRatio, REFERENCE_WIDTH);
}

/**
 * Calcula la altura de renderizado basada en el ancho de columna
 * @param columnWidth Ancho disponible para la imagen
 * @param imageWidth Ancho original de la imagen
 * @param imageHeight Alto original de la imagen
 * @returns Altura calculada para el renderizado
 */
export function calculateRenderHeight(
  columnWidth: number,
  imageWidth: number,
  imageHeight: number
): number {
  if (!imageWidth || !imageHeight) {
    // Si no hay dimensiones, usar relación óptima
    return columnWidth / OPTIMAL_ASPECT_RATIO;
  }
  
  const aspectRatio = imageWidth / imageHeight;
  
  // Limitar la relación de aspecto
  const clampedRatio = Math.max(
    MIN_ASPECT_RATIO,
    Math.min(MAX_ASPECT_RATIO, aspectRatio)
  );
  
  return columnWidth / clampedRatio;
}

/**
 * Obtiene una relación de aspecto aleatoria pero realista
 * Favorece las proporciones verticales que funcionan mejor en móvil
 */
export function getRandomAspectRatio(): number {
  const weights = [
    { ratio: 2/3, weight: 30 },    // Óptimo Pinterest - más común
    { ratio: 3/4, weight: 25 },    // Retrato estándar
    { ratio: 4/5, weight: 20 },    // Retrato móvil
    { ratio: 9/16, weight: 10 },   // Muy vertical
    { ratio: 1/1, weight: 10 },    // Cuadrado
    { ratio: 4/3, weight: 5 },     // Paisaje
  ];
  
  const totalWeight = weights.reduce((sum, w) => sum + w.weight, 0);
  let random = Math.random() * totalWeight;
  
  for (const item of weights) {
    random -= item.weight;
    if (random <= 0) {
      return item.ratio;
    }
  }
  
  return OPTIMAL_ASPECT_RATIO;
}

/**
 * Añade dimensiones a un array de pines que no las tienen
 * @param pins Array de pines
 * @returns Array de pines con dimensiones añadidas
 */
export function enrichPinsWithDimensions<T extends Record<string, any>>(
  pins: T[]
): (T & { width: number; height: number })[] {
  return pins.map((pin, index) => {
    if (pin.width && pin.height) {
      return pin as T & { width: number; height: number }; // Ya tiene dimensiones
    }
    
    // Generar dimensiones basadas en el índice
    const dimensions = generateVariedDimensions(index);
    
    return {
      ...pin,
      width: dimensions.width,
      height: dimensions.height,
    };
  });
}
