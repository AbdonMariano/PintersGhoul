import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ImageCard from '../components/ImageCard';
import OptionsModal from '../components/OptionsModal';
import BottomNavigation from '../components/BottomNavigation';
import ImageDetailScreen from './ImageDetailScreen';
import FloatingActionButton from '../components/FloatingActionButton';
import IdeaPinCreator from '../components/IdeaPinCreator';
import UploadScreen from '../components/UploadScreen';
import BoardPickerModal from '../components/BoardPickerModal';
import { Colors } from '../constants/Colors';
import { SamplePins, LocalPins } from '../constants/Images';
import { DownloadService } from '../services/DownloadService';
import { BoardService } from '../services/BoardService';

interface Pin {
  id: string;
  imageUri: string | number; // string (remota) o number (require local)
  title: string;
  description: string;
  author: string;
  likes: number;
  isLiked: boolean;
  isSaved: boolean;
}

interface HomeScreenProps {
  pins?: Pin[];
  onUpload?: () => void;
  onTabPress?: (tab: string) => void;
}

export default function HomeScreen({ pins = [], onUpload = () => {}, onTabPress = () => {} }: HomeScreenProps) {
  // Estados mínimos necesarios
  const [localPins, setLocalPins] = useState<Pin[]>(pins && pins.length > 0 ? pins : [...LocalPins, ...SamplePins]);
  const [showOptions, setShowOptions] = useState(false);
  const [selectedPin, setSelectedPin] = useState<Pin | null>(null);
  const [showImageDetail, setShowImageDetail] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [showIdeaPinCreator, setShowIdeaPinCreator] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showBoardPicker, setShowBoardPicker] = useState(false);
  const [pinToSave, setPinToSave] = useState<Pin | null>(null);

  // Handlers para Like y Save
  const handleLike = (pinId?: string) => {
    if (!pinId) return;
    setLocalPins(prev => prev.map(pin => 
      pin.id === pinId 
        ? { ...pin, isLiked: !pin.isLiked, likes: pin.isLiked ? pin.likes - 1 : pin.likes + 1 }
        : pin
    ));
  };
  
  const handleSave = (pinId?: string) => {
    if (!pinId) return;
    setLocalPins(prev => prev.map(pin => 
      pin.id === pinId 
        ? { ...pin, isSaved: !pin.isSaved }
        : pin
    ));
  };
  
  const handleShowOptions = (pin?: Pin) => {
    setSelectedPin(pin || null);
    setShowOptions(true);
  };
  const handleCloseOptions = () => {
    setShowOptions(false);
    setSelectedPin(null);
  };
  const handleImagePress = (pin?: Pin) => {
    setSelectedPin(pin || null);
    setShowImageDetail(true);
  };
  const handleCloseImageDetail = () => {
    setShowImageDetail(false);
    setSelectedPin(null);
  };
  const handleQuickSearch = () => {};
  const handleQuickProfile = () => {};
  const handleQuickSettings = () => {};
  const handleCreateIdeaPin = () => setShowIdeaPinCreator(true);
  const handlePublishIdeaPin = () => setShowIdeaPinCreator(false);

  // Upload handling: abrir modal y agregar pin nuevo a la lista
  const handleOpenUpload = () => setShowUpload(true);
  const handleCancelUpload = () => setShowUpload(false);
  const handleUpload = (imageUri: string, title: string, description: string) => {
    const newPin: Pin = {
      id: Date.now().toString(),
      imageUri,
      title,
      description,
      author: 'Usuario',
      likes: 0,
      isLiked: false,
      isSaved: false,
    };
    setLocalPins(prev => [newPin, ...prev]);
    setShowUpload(false);
  };

  // Nueva función para manejar descargas
  const handleDownload = async (pin: Pin) => {
    try {
      // Mostrar un indicador de carga (opcional)
      // Iniciar la descarga usando el servicio de descarga
       if (typeof pin.imageUri !== 'string') {
         Alert.alert('Disponible pronto', 'La descarga de imágenes locales aún no está disponible. Comparte o sube imágenes remotas para descargarlas.');
         return;
       }
       await DownloadService.downloadToGallery(pin.imageUri, pin.title);
      // Aquí puedes manejar el éxito de la descarga, como mostrar un mensaje al usuario
    } catch (error) {
      // Manejar errores de descarga
       console.error('[HomeScreen] Error al descargar:', error);
    }
  };

  const handleAddToBoard = (pin: Pin) => {
    setPinToSave(pin);
    setShowBoardPicker(true);
  };

  const handleBoardSelected = (board: any) => {
    if (pinToSave) {
      BoardService.addPinToBoard(board.id, pinToSave.id);
      Alert.alert('¡Guardado!', `Pin guardado en "${board.name}"`);
    }
    setShowBoardPicker(false);
    setPinToSave(null);
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={[Colors.gradientStart, Colors.gradientEnd]} style={styles.gradient}>
        <View style={styles.header}>
          <Text style={styles.title}>Para ti</Text>
          <View style={styles.profileRow}>
            <Text style={styles.profileName}>TheAlex ProYt</Text>
            <TouchableOpacity style={styles.profileIcon}>
              <Text style={{ fontSize: 22 }}>⚙️</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Lista de Pines */}
        <FlatList
          data={localPins}
          renderItem={({ item }) => (
            <ImageCard
              pin={item}
              onLike={() => handleLike(item.id)}
              onSave={() => handleSave(item.id)}
              onShowOptions={() => handleShowOptions(item)}
              onImagePress={() => handleImagePress(item)}
            />
          )}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true}
          maxToRenderPerBatch={6}
          windowSize={5}
          initialNumToRender={4}
        />

        {/* Modal de opciones */}
        {showOptions && selectedPin ? (
          <OptionsModal
            visible={showOptions}
            pin={selectedPin}
            onClose={handleCloseOptions}
            onFollow={() => {}}
            onShare={() => {}}
            onCopyLink={() => {}}
            onDownload={() => handleDownload(selectedPin)} // Modificación aquí
            onHide={() => {}}
            onReport={() => {}}
            onAddToBoard={() => handleAddToBoard(selectedPin)}
          />
        ) : null}

        {/* Detalle de imagen */}
        {showImageDetail && selectedPin ? (
          <ImageDetailScreen
            pin={selectedPin}
            visible={showImageDetail}
            onBack={handleCloseImageDetail}
            onLike={() => handleLike(selectedPin.id)}
            onSave={() => handleSave(selectedPin.id)}
            onShare={() => {}}
          />
        ) : null}

        {/* Botón flotante y navegación inferior */}
        <FloatingActionButton
          onUpload={handleOpenUpload}
          onSearch={handleQuickSearch}
          onProfile={handleQuickProfile}
          onSettings={handleQuickSettings}
          onIdeaPin={handleCreateIdeaPin}
          onLinks={() => {}}
          onMessages={() => {}}
        />

        <BottomNavigation
          activeTab={activeTab}
          onTabPress={(tab) => {
            setActiveTab(tab);
            onTabPress(tab);
          }}
        />

        <IdeaPinCreator
          visible={showIdeaPinCreator}
          onClose={() => setShowIdeaPinCreator(false)}
          onPublish={handlePublishIdeaPin}
        />
        {/* Upload screen modal */}
        {showUpload && (
          <UploadScreen
            onUpload={handleUpload}
            onCancel={handleCancelUpload}
          />
        )}

        <BoardPickerModal
          visible={showBoardPicker}
          onClose={() => { setShowBoardPicker(false); setPinToSave(null); }}
          onBoardSelected={handleBoardSelected}
        />
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginRight: 10,
  },
  profileIcon: {
    backgroundColor: '#eee',
    borderRadius: 20,
    padding: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
    fontFamily: 'sans-serif-medium',
    letterSpacing: 0.5,
  },
  uploadButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
  },
  uploadButtonText: {
    color: Colors.text,
    fontSize: 24,
    fontWeight: 'bold',
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 120, // Más espacio para navegación inferior
    paddingTop: 8,
    minHeight: '100%',
    gap: 12,
  },
});
