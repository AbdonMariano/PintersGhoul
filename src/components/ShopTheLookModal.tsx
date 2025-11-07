import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
  ScrollView,
  Linking,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/Colors';
import { ShopItem, LinkService } from '../services/LinkService';
import AnimatedButton from './AnimatedButton';

interface ShopTheLookModalProps {
  visible: boolean;
  onClose: () => void;
  pinImage: string | number;
  pinTitle: string;
}

export default function ShopTheLookModal({ 
  visible, 
  onClose, 
  pinImage, 
  pinTitle 
}: ShopTheLookModalProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const shopItems = LinkService.getShopItems();

  const handleItemPress = async (item: ShopItem) => {
    try {
      const canOpen = await Linking.canOpenURL(item.shopUrl);
      if (canOpen) {
        await Linking.openURL(item.shopUrl);
      } else {
        Alert.alert('Error', 'No se puede abrir este enlace de compra');
      }
    } catch (error) {
      Alert.alert('Error', 'Error al abrir el enlace de compra');
    }
  };

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'in_stock': return '#4CAF50';
      case 'limited': return '#FF9800';
      case 'out_of_stock': return '#F44336';
      default: return Colors.textSecondary;
    }
  };

  const getAvailabilityText = (availability: string) => {
    switch (availability) {
      case 'in_stock': return 'Disponible';
      case 'limited': return 'Últimas unidades';
      case 'out_of_stock': return 'Agotado';
      default: return 'Desconocido';
    }
  };

  const renderShopItem = (item: ShopItem) => (
    <AnimatedButton
      key={item.id}
      onPress={() => handleItemPress(item)}
      style={styles.shopItem}
    >
      <LinearGradient
        colors={[Colors.surface, Colors.background]}
        style={styles.shopItemGradient}
      >
        <View style={styles.itemHeader}>
          <Image source={{ uri: item.image }} style={styles.itemImage} />
          <View style={styles.itemInfo}>
            <Text style={styles.itemName} numberOfLines={2}>
              {item.name}
            </Text>
            <Text style={styles.shopName}>{item.shopName}</Text>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>
                {item.currency} {item.price}
              </Text>
              <View style={[
                styles.availabilityBadge,
                { backgroundColor: getAvailabilityColor(item.availability) }
              ]}>
                <Text style={styles.availabilityText}>
                  {getAvailabilityText(item.availability)}
                </Text>
              </View>
            </View>
            {item.rating && (
              <View style={styles.ratingContainer}>
                <Text style={styles.rating}>⭐ {item.rating}</Text>
                <Text style={styles.reviews}>({item.reviews} reseñas)</Text>
              </View>
            )}
          </View>
        </View>
        
        <View style={styles.itemActions}>
          <TouchableOpacity
            style={styles.selectButton}
            onPress={() => toggleItemSelection(item.id)}
          >
            <Text style={styles.selectButtonText}>
              {selectedItems.includes(item.id) ? '✓ Seleccionado' : 'Seleccionar'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buyButton}
            onPress={() => handleItemPress(item)}
          >
            <LinearGradient
              colors={[Colors.redGradientStart, Colors.redGradientEnd]}
              style={styles.buyButtonGradient}
            >
              <Text style={styles.buyButtonText}>Comprar</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </AnimatedButton>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.title}>Shop the Look</Text>
              <Text style={styles.subtitle}>Productos relacionados con este pin</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.pinPreview}>
            {typeof pinImage === 'string' && pinImage ? (
              <Image source={{ uri: pinImage }} style={styles.pinImage} />
            ) : typeof pinImage === 'number' ? (
              <Image source={pinImage} style={styles.pinImage} />
            ) : null}
            <Text style={styles.pinTitle}>{pinTitle}</Text>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>🛒 Productos Recomendados</Text>
              <Text style={styles.sectionSubtitle}>
                Encuentra productos similares en estas tiendas
              </Text>
            </View>

            {shopItems.map(renderShopItem)}

            {selectedItems.length > 0 && (
              <View style={styles.selectedItemsContainer}>
                <Text style={styles.selectedItemsTitle}>
                  Items seleccionados ({selectedItems.length})
                </Text>
                <AnimatedButton
                  onPress={() => {
                    Alert.alert('Lista de Compras', 'Funcionalidad de lista de compras');
                  }}
                  style={styles.createListButton}
                >
                  <LinearGradient
                    colors={[Colors.primary, Colors.secondary]}
                    style={styles.createListGradient}
                  >
                    <Text style={styles.createListText}>
                      📝 Crear Lista de Compras
                    </Text>
                  </LinearGradient>
                </AnimatedButton>
              </View>
            )}

            <View style={styles.featuresContainer}>
              <Text style={styles.featuresTitle}>Características:</Text>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>🔍</Text>
                <Text style={styles.featureText}>Detección automática de productos</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>💰</Text>
                <Text style={styles.featureText}>Comparación de precios</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>⭐</Text>
                <Text style={styles.featureText}>Reseñas y calificaciones</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>📱</Text>
                <Text style={styles.featureText}>Enlaces directos a tiendas</Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    width: '95%',
    maxHeight: '90%',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  closeButton: {
    padding: 5,
  },
  closeIcon: {
    fontSize: 20,
    color: Colors.text,
  },
  pinPreview: {
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  pinImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginBottom: 8,
  },
  pinTitle: {
    fontSize: 14,
    color: Colors.text,
    textAlign: 'center',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    paddingVertical: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  shopItem: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 15,
  },
  shopItemGradient: {
    padding: 15,
  },
  itemHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  shopName: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  availabilityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  availabilityText: {
    fontSize: 10,
    color: Colors.text,
    fontWeight: 'bold',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 12,
    color: Colors.text,
    marginRight: 8,
  },
  reviews: {
    fontSize: 10,
    color: Colors.textSecondary,
  },
  itemActions: {
    flexDirection: 'row',
    gap: 10,
  },
  selectButton: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  selectButtonText: {
    fontSize: 12,
    color: Colors.text,
    fontWeight: '500',
  },
  buyButton: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  buyButtonGradient: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  buyButtonText: {
    fontSize: 12,
    color: Colors.text,
    fontWeight: 'bold',
  },
  selectedItemsContainer: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  selectedItemsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 10,
  },
  createListButton: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  createListGradient: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  createListText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: 'bold',
  },
  featuresContainer: {
    marginBottom: 20,
  },
  featuresTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 10,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  featureText: {
    fontSize: 12,
    color: Colors.textSecondary,
    flex: 1,
  },
});
