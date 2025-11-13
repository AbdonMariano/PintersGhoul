import React from 'react';
import { View, ScrollView, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 48) / 2; // 2 columnas con padding de 16 en cada lado y gap de 16

interface MasonryLayoutProps {
  data: any[];
  renderItem: (item: any, index: number) => React.ReactNode;
  numColumns?: number;
  onScroll?: (event: any) => void;
}

export default function MasonryLayout({
  data,
  renderItem,
  numColumns = 2,
  onScroll,
}: MasonryLayoutProps) {
  // Distribuir items en columnas
  const columns: any[][] = Array.from({ length: numColumns }, () => []);
  const columnHeights = Array(numColumns).fill(0);

  // Asignar cada item a la columna con menor altura
  data.forEach((item, index) => {
    const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));
    columns[shortestColumnIndex].push({ item, index });
    // Estimar altura basada en el índice para distribución más uniforme
    const estimatedHeight = 200 + (index % 3) * 100;
    columnHeights[shortestColumnIndex] += estimatedHeight;
  });

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
      onScroll={onScroll}
      scrollEventThrottle={16}
    >
      <View style={styles.container}>
        {columns.map((column, columnIndex) => (
          <View key={columnIndex} style={styles.column}>
            {column.map(({ item, index }) => (
              <View key={item.id || index} style={styles.itemWrapper}>
                {renderItem(item, index)}
              </View>
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 120,
  },
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  column: {
    flex: 1,
    paddingHorizontal: 8,
  },
  itemWrapper: {
    marginBottom: 16,
  },
});
