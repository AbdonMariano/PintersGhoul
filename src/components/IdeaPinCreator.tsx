import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { Colors } from '../constants/Colors';
import AnimatedButton from './AnimatedButton';

interface IdeaPinCreatorProps {
  visible: boolean;
  onClose: () => void;
  onPublish: (ideaPin: any) => void;
}

interface IdeaPinSlide {
  id: string;
  type: 'image' | 'video' | 'text';
  content: string;
  text?: string;
  duration?: number;
}

export default function IdeaPinCreator({ visible, onClose, onPublish }: IdeaPinCreatorProps) {
  const [slides, setSlides] = useState<IdeaPinSlide[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const addImageSlide = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [9, 16],
      quality: 0.8,
    });

    if (!result.canceled) {
      const newSlide: IdeaPinSlide = {
        id: Date.now().toString(),
        type: 'image',
        content: result.assets[0].uri,
        duration: 3,
      };
      setSlides(prev => [...prev, newSlide]);
    }
  };

  const addVideoSlide = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      aspect: [9, 16],
      quality: 0.8,
    });

    if (!result.canceled) {
      const newSlide: IdeaPinSlide = {
        id: Date.now().toString(),
        type: 'video',
        content: result.assets[0].uri,
        duration: 5,
      };
      setSlides(prev => [...prev, newSlide]);
    }
  };

  const addTextSlide = () => {
    const newSlide: IdeaPinSlide = {
      id: Date.now().toString(),
      type: 'text',
      content: '',
      text: 'Escribe tu texto aquí...',
      duration: 3,
    };
    setSlides(prev => [...prev, newSlide]);
  };

  const updateSlide = (slideId: string, updates: Partial<IdeaPinSlide>) => {
    setSlides(prev =>
      prev.map(slide =>
        slide.id === slideId ? { ...slide, ...updates } : slide
      )
    );
  };

  const removeSlide = (slideId: string) => {
    setSlides(prev => prev.filter(slide => slide.id !== slideId));
  };

  const publishIdeaPin = () => {
    if (slides.length === 0) {
      Alert.alert('Error', 'Agrega al menos una diapositiva');
      return;
    }

    if (!title.trim()) {
      Alert.alert('Error', 'Agrega un título');
      return;
    }

    const ideaPin = {
      id: Date.now().toString(),
      title,
      description,
      slides,
      author: 'Usuario Actual',
      likes: 0,
      isLiked: false,
      isSaved: false,
      type: 'idea_pin',
      createdAt: new Date().toISOString(),
    };

    onPublish(ideaPin);
    onClose();
    setSlides([]);
    setTitle('');
    setDescription('');
  };

  const renderSlide = (slide: IdeaPinSlide, index: number) => (
    <View key={slide.id} style={styles.slideContainer}>
      <View style={styles.slideHeader}>
        <Text style={styles.slideNumber}>Diapositiva {index + 1}</Text>
        <TouchableOpacity onPress={() => removeSlide(slide.id)}>
          <Text style={styles.removeButton}>✕</Text>
        </TouchableOpacity>
      </View>

      {slide.type === 'image' && (
        <Image source={{ uri: slide.content }} style={styles.slidePreview} />
      )}

      {slide.type === 'video' && (
        <View style={styles.videoPreview}>
          <Text style={styles.videoIcon}>🎥</Text>
          <Text style={styles.videoText}>Video</Text>
        </View>
      )}

      {slide.type === 'text' && (
        <View style={styles.textSlideContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Escribe tu texto aquí..."
            value={slide.text}
            onChangeText={(text) => updateSlide(slide.id, { text })}
            multiline
          />
        </View>
      )}

      <View style={styles.slideControls}>
        <Text style={styles.durationLabel}>Duración: {slide.duration}s</Text>
        <View style={styles.durationButtons}>
          <TouchableOpacity
            style={styles.durationButton}
            onPress={() => updateSlide(slide.id, { duration: Math.max(1, slide.duration! - 1) })}
          >
            <Text style={styles.durationButtonText}>-</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.durationButton}
            onPress={() => updateSlide(slide.id, { duration: slide.duration! + 1 })}
          >
            <Text style={styles.durationButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.cancelButton}>Cancelar</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Idea Pin</Text>
          <AnimatedButton onPress={publishIdeaPin} style={styles.publishButton}>
            <Text style={styles.publishButtonText}>Publicar</Text>
          </AnimatedButton>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.titleInput}
              placeholder="Título del Idea Pin"
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              style={styles.descriptionInput}
              placeholder="Descripción (opcional)"
              value={description}
              onChangeText={setDescription}
              multiline
            />
          </View>

          <View style={styles.addSlideContainer}>
            <Text style={styles.addSlideTitle}>Agregar Diapositiva</Text>
            <View style={styles.addSlideButtons}>
              <AnimatedButton onPress={addImageSlide} style={styles.addButton}>
                <LinearGradient
                  colors={[Colors.surface, Colors.background]}
                  style={styles.addButtonGradient}
                >
                  <Text style={styles.addButtonIcon}>📷</Text>
                  <Text style={styles.addButtonText}>Imagen</Text>
                </LinearGradient>
              </AnimatedButton>

              <AnimatedButton onPress={addVideoSlide} style={styles.addButton}>
                <LinearGradient
                  colors={[Colors.surface, Colors.background]}
                  style={styles.addButtonGradient}
                >
                  <Text style={styles.addButtonIcon}>🎥</Text>
                  <Text style={styles.addButtonText}>Video</Text>
                </LinearGradient>
              </AnimatedButton>

              <AnimatedButton onPress={addTextSlide} style={styles.addButton}>
                <LinearGradient
                  colors={[Colors.surface, Colors.background]}
                  style={styles.addButtonGradient}
                >
                  <Text style={styles.addButtonIcon}>📝</Text>
                  <Text style={styles.addButtonText}>Texto</Text>
                </LinearGradient>
              </AnimatedButton>
            </View>
          </View>

          {slides.map((slide, index) => renderSlide(slide, index))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.9)',
    zIndex: 1000,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  cancelButton: {
    color: Colors.text,
    fontSize: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  publishButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  publishButtonText: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  titleInput: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.text,
    marginBottom: 10,
  },
  descriptionInput: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 14,
    color: Colors.text,
    minHeight: 80,
  },
  addSlideContainer: {
    marginBottom: 20,
  },
  addSlideTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 15,
  },
  addSlideButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  addButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  addButtonGradient: {
    alignItems: 'center',
    paddingVertical: 15,
  },
  addButtonIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  addButtonText: {
    color: Colors.text,
    fontSize: 12,
    fontWeight: '500',
  },
  slideContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  slideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  slideNumber: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: 'bold',
  },
  removeButton: {
    color: Colors.error,
    fontSize: 18,
  },
  slidePreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  videoPreview: {
    width: '100%',
    height: 200,
    backgroundColor: Colors.background,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  videoIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  videoText: {
    color: Colors.text,
    fontSize: 16,
  },
  textSlideContainer: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  textInput: {
    color: Colors.text,
    fontSize: 16,
    minHeight: 100,
  },
  slideControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  durationLabel: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
  durationButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  durationButton: {
    backgroundColor: Colors.primary,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  durationButtonText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
