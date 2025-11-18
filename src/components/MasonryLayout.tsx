import React, { forwardRef, useState, useCallback } from 'react';
import { View, ScrollView, StyleSheet, Dimensions, ActivityIndicator, Text } from 'react-native';
import { Colors } from '../constants/Colors';
import { getMasonryColumns, getColumnWidth, getResponsivePadding, getDeviceType } from '../utils/responsive';

const { width: screenWidth } = Dimensions.get('window');

// Configuración basada en Pinterest con soporte responsivo
const COLUMN_WIDTH_DESKTOP = 238; // Ancho óptimo de columna en píxeles
const MIN_COLUMN_WIDTH = 150; // Ancho mínimo para columnas en móvil

// Espaciado dinámico según dispositivo
const getColumnGap = (): number => {
  const deviceType = getDeviceType();
  switch (deviceType) {
    case 'mobile':
    case 'mobile-large':
      return 12;
    case 'tablet':
      return 16;
    case 'laptop':
    case 'desktop':
      return 20;
    case 'tv':
      return 24;
    default:
      return 16;
  }
};

// Calcular número óptimo de columnas según el ancho de pantalla
const calculateColumns = (availableWidth: number): number => {
  // Usar la función responsiva que detecta el tipo de dispositivo
  return getMasonryColumns();
};

// Calcular ancho real de columna basado en el espacio disponible
const calculateColumnWidth = (availableWidth: number, numColumns: number, columnGap: number): number => {
  const paddingHorizontal = getResponsivePadding();
  const effectiveWidth = availableWidth - (paddingHorizontal * 2);
  const totalGapWidth = columnGap * (numColumns - 1);
  return (effectiveWidth - totalGapWidth) / numColumns;
};

interface MasonryLayoutProps {
  data: any[];
  renderItem: (item: any, index: number) => React.ReactNode;
  numColumns?: number;
  onScroll?: (event: any) => void;
  onEndReached?: () => void;
  onEndReachedThreshold?: number;
  isLoadingMore?: boolean;
}

const MasonryLayout = forwardRef<ScrollView, MasonryLayoutProps>(({
  data,
  renderItem,
  numColumns: forcedColumns,
  onScroll,
  onEndReached,
  onEndReachedThreshold = 0.5,
  isLoadingMore = false,
}, ref) => {
  // Calcular número de columnas y espaciado de forma dinámica
  const numColumns = forcedColumns || calculateColumns(screenWidth);
  const columnGap = getColumnGap();
  const columnWidth = calculateColumnWidth(screenWidth, numColumns, columnGap);

  // Distribuir items en columnas usando algoritmo de "menor altura"
  const columns: any[][] = Array.from({ length: numColumns }, () => []);
  const columnHeights = Array(numColumns).fill(0);

  // Relación de aspecto óptima de Pinterest: 2:3 (ancho:alto)
  const OPTIMAL_ASPECT_RATIO = 2 / 3;
  
  // Función para calcular altura estimada de un item
  const calculateItemHeight = (item: any): number => {
    // Si el item tiene dimensiones, usar relación de aspecto real
    if (item.width && item.height) {
      const aspectRatio = item.width / item.height;
      return columnWidth / aspectRatio;
    }
    
    // Para imágenes sin dimensiones, usar relación óptima de Pinterest
    // Esto asume imágenes verticales (2:3)
    const estimatedImageHeight = columnWidth / OPTIMAL_ASPECT_RATIO;
    
    // Agregar espacio para el contenido debajo (autor, título, acciones)
    const contentHeight = 80; // Altura del área de información
    
    return estimatedImageHeight + contentHeight;
  };

  // Asignar cada item a la columna con menor altura acumulada
  data.forEach((item, index) => {
    const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));
    columns[shortestColumnIndex].push({ item, index });
    
    // Actualizar altura de la columna
    const itemHeight = calculateItemHeight(item);
    columnHeights[shortestColumnIndex] += itemHeight + columnGap;
  });

  // Detectar cuando el usuario llega al final del scroll
  const handleScroll = useCallback((event: any) => {
    if (onScroll) {
      onScroll(event);
    }

    if (onEndReached) {
      const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
      const paddingToBottom = contentSize.height * onEndReachedThreshold;
      const isNearBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;

      if (isNearBottom && !isLoadingMore) {
        onEndReached();
      }
    }
  }, [onScroll, onEndReached, onEndReachedThreshold, isLoadingMore]);

  return (
    <ScrollView
      ref={ref}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
      onScroll={handleScroll}
      scrollEventThrottle={16}
      removeClippedSubviews={true}
    >
      <View style={[styles.container, { gap: columnGap }]}>
        {columns.map((column, columnIndex) => (
          <View 
            key={columnIndex} 
            style={[
              styles.column,
              { 
                width: columnWidth,
                gap: columnGap,
              }
            ]}
          >
            {column.map(({ item, index }) => (
              <View key={item.id || index}>
                {renderItem(item, index)}
              </View>
            ))}
          </View>
        ))}
      </View>
      
      {/* Indicador de carga al final */}
      {isLoadingMore && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Cargando más imágenes...</Text>
        </View>
      )}
    </ScrollView>
  );
});

export default MasonryLayout;

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 120,
  },
  container: {
    flexDirection: 'row',
    paddingHorizontal: getResponsivePadding(),
    paddingTop: 8,
    alignItems: 'flex-start',
  },
  column: {
    // El ancho se establece dinámicamente
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingBottom: 40,
  },
  loadingText: {
    marginTop: 8,
    color: Colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
});
