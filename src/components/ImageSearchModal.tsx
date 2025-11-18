import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { Colors } from '../constants/Colors';
import AnimatedButton from './AnimatedButton';

interface ImageSearchModalProps {
  visible: boolean;
  onClose: () => void;
  onSearchResults: (results: any[]) => void;
}

export default function ImageSearchModal({ visible, onClose, onSearchResults }: ImageSearchModalProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const searchSimilarImages = async () => {
    if (!selectedImage) return;

    setIsSearching(true);
    // Simulación instantánea de resultados de búsqueda de imágenes
    const mockResults = [
      {
        id: '1',
        imageUri: 'https://i.pinimg.com/564x/8a/4b/2a/8a4b2a1c3f5e7d9b8c6a4e2f1d3c5b7a.jpg',
        title: 'Kaneki Ken - Similar Image',
        description: 'Imagen similar encontrada',
        author: 'AI Search',
          likes: 42,
          isLiked: false,
          isSaved: false,
          similarity: 95
        },
        {
          id: '2',
          imageUri: 'https://i.pinimg.com/564x/7b/3c/9d/7b3c9d2e4f6a8c1b9d7e5f3a2c4b6d8e.jpg',
          title: 'Tokyo Ghoul Art - Similar',
          description: 'Arte similar detectado',
          author: 'AI Search',
          likes: 28,
          isLiked: false,
          isSaved: false,
          similarity: 87
        }
      ];
      
      onSearchResults(mockResults);
      setIsSearching(false);
      onClose();
  };

  const handleClose = () => {
    setSelectedImage(null);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>Búsqueda por Imagen</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            <Text style={styles.subtitle}>
              Sube una imagen para encontrar pins similares de Tokyo Ghoul
            </Text>

            {selectedImage ? (
              <View style={styles.imageContainer}>
                <Image source={{ uri: selectedImage }} style={styles.previewImage} />
                <AnimatedButton
                  onPress={searchSimilarImages}
                  disabled={isSearching}
                  gradient
                  gradientColors={[Colors.redGradientStart, Colors.redGradientEnd]}
                  style={styles.searchButton}
                >
                  <Text style={styles.searchButtonText}>
                    {isSearching ? 'Buscando...' : '🔍 Buscar Similares'}
                  </Text>
                </AnimatedButton>
              </View>
            ) : (
              <View style={styles.uploadOptions}>
                <AnimatedButton
                  onPress={pickImage}
                  style={styles.optionButton}
                >
                  <LinearGradient
                    colors={[Colors.surface, Colors.background]}
                    style={styles.optionGradient}
                  >
                    <Text style={styles.optionIcon}>📷</Text>
                    <Text style={styles.optionText}>Elegir de Galería</Text>
                  </LinearGradient>
                </AnimatedButton>

                <AnimatedButton
                  onPress={takePhoto}
                  style={styles.optionButton}
                >
                  <LinearGradient
                    colors={[Colors.surface, Colors.background]}
                    style={styles.optionGradient}
                  >
                    <Text style={styles.optionIcon}>📸</Text>
                    <Text style={styles.optionText}>Tomar Foto</Text>
                  </LinearGradient>
                </AnimatedButton>
              </View>
            )}

            <View style={styles.featuresContainer}>
              <Text style={styles.featuresTitle}>Características de búsqueda:</Text>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>🎯</Text>
                <Text style={styles.featureText}>Detección de personajes de Tokyo Ghoul</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>🎨</Text>
                <Text style={styles.featureText}>Búsqueda por estilo artístico</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>🔍</Text>
                <Text style={styles.featureText}>Análisis de colores y composición</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>⚡</Text>
                <Text style={styles.featureText}>Resultados en tiempo real</Text>
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
    width: '90%',
    maxHeight: '80%',
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  closeButton: {
    padding: 5,
  },
  closeIcon: {
    fontSize: 20,
    color: Colors.text,
  },
  content: {
    padding: 20,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  previewImage: {
    width: 200,
    height: 200,
    borderRadius: 12,
    marginBottom: 15,
  },
  searchButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  searchButtonText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  uploadOptions: {
    gap: 15,
    marginBottom: 20,
  },
  optionButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  optionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  optionIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  optionText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '500',
  },
  featuresContainer: {
    marginTop: 20,
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 15,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  featureIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  featureText: {
    color: Colors.textSecondary,
    fontSize: 14,
    flex: 1,
  },
});
