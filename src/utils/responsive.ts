/**
 * Utilidades para diseño responsivo multi-dispositivo
 * Soporta: móvil, tablet, laptop/desktop, TV
 */
import { Dimensions, Platform, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Breakpoints estándar para dispositivos
export const BREAKPOINTS = {
  mobile: 480,
  tablet: 768,
  laptop: 1024,
  desktop: 1440,
  tv: 1920,
};

// Detectar tipo de dispositivo
export const getDeviceType = () => {
  if (SCREEN_WIDTH < BREAKPOINTS.mobile) {
    return 'mobile';
  } else if (SCREEN_WIDTH < BREAKPOINTS.tablet) {
    return 'mobile-large';
  } else if (SCREEN_WIDTH < BREAKPOINTS.laptop) {
    return 'tablet';
  } else if (SCREEN_WIDTH < BREAKPOINTS.desktop) {
    return 'laptop';
  } else if (SCREEN_WIDTH < BREAKPOINTS.tv) {
    return 'desktop';
  } else {
    return 'tv';
  }
};

// Detectar si es web
export const isWeb = Platform.OS === 'web';

// Detectar si es mobile (iOS o Android)
export const isMobile = Platform.OS === 'ios' || Platform.OS === 'android';

// Escalar según el tamaño del dispositivo
export const scale = (size: number): number => {
  const baseWidth = 375; // iPhone SE como referencia
  return (SCREEN_WIDTH / baseWidth) * size;
};

// Escalar verticalmente
export const verticalScale = (size: number): number => {
  const baseHeight = 667; // iPhone SE como referencia
  return (SCREEN_HEIGHT / baseHeight) * size;
};

// Escala moderada (combinación de ambas)
export const moderateScale = (size: number, factor: number = 0.5): number => {
  return size + (scale(size) - size) * factor;
};

// Obtener número de columnas para masonry layout según dispositivo
export const getMasonryColumns = (): number => {
  const deviceType = getDeviceType();
  
  switch (deviceType) {
    case 'mobile':
      return 2;
    case 'mobile-large':
      return 2;
    case 'tablet':
      return 3;
    case 'laptop':
      return 5; // Aumentado de 4 a 5 para mejor visualización
    case 'desktop':
      return 6; // Aumentado de 5 a 6
    case 'tv':
      return 8; // Aumentado de 6 a 8
    default:
      return 2;
  }
};

// Obtener ancho de columna según dispositivo
export const getColumnWidth = (): number => {
  const columns = getMasonryColumns();
  const gap = 16; // Espacio entre columnas
  const horizontalPadding = 16; // Padding horizontal total
  
  return (SCREEN_WIDTH - horizontalPadding - (gap * (columns - 1))) / columns;
};

// Determinar si se debe mostrar en modo compacto
export const isCompactMode = (): boolean => {
  return SCREEN_WIDTH < BREAKPOINTS.tablet;
};

// Obtener padding responsivo
export const getResponsivePadding = (): number => {
  const deviceType = getDeviceType();
  
  switch (deviceType) {
    case 'mobile':
      return 16;
    case 'mobile-large':
      return 20;
    case 'tablet':
      return 24;
    case 'laptop':
      return 32;
    case 'desktop':
      return 40;
    case 'tv':
      return 48;
    default:
      return 16;
  }
};

// Obtener tamaño de fuente responsivo
export const getResponsiveFontSize = (baseSize: number): number => {
  const deviceType = getDeviceType();
  const pixelRatio = PixelRatio.get();
  
  // Ajustar tamaño base según dispositivo
  let multiplier = 1;
  switch (deviceType) {
    case 'mobile':
      multiplier = 1;
      break;
    case 'mobile-large':
      multiplier = 1.1;
      break;
    case 'tablet':
      multiplier = 1.2;
      break;
    case 'laptop':
      multiplier = 1.3;
      break;
    case 'desktop':
      multiplier = 1.4;
      break;
    case 'tv':
      multiplier = 1.6;
      break;
  }
  
  return Math.round(baseSize * multiplier);
};

// Exportar dimensiones
export const SCREEN_DIMENSIONS = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
};

// Configuración para cada tipo de dispositivo
export const DEVICE_CONFIG = {
  mobile: {
    columns: 2,
    columnWidth: 238,
    padding: 16,
    fontSize: 1,
  },
  tablet: {
    columns: 3,
    columnWidth: 238,
    padding: 24,
    fontSize: 1.2,
  },
  laptop: {
    columns: 5,
    columnWidth: 238,
    padding: 32,
    fontSize: 1.3,
  },
  desktop: {
    columns: 6,
    columnWidth: 238,
    padding: 40,
    fontSize: 1.4,
  },
  tv: {
    columns: 8,
    columnWidth: 238,
    padding: 48,
    fontSize: 1.6,
  },
};

// Obtener configuración del dispositivo actual
export const getCurrentDeviceConfig = () => {
  const deviceType = getDeviceType();
  return DEVICE_CONFIG[deviceType as keyof typeof DEVICE_CONFIG] || DEVICE_CONFIG.mobile;
};
