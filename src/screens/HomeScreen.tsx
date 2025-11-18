import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ImageCard from '../components/ImageCard';
import MasonryLayout from '../components/MasonryLayout';
import OptionsModal from '../components/OptionsModal';
import BottomNavigation from '../components/BottomNavigation';
import ImageDetailScreen from './ImageDetailScreen';
import FloatingActionButton from '../components/FloatingActionButton';
import IdeaPinCreator from '../components/IdeaPinCreator';
import UploadScreen from '../components/UploadScreen';
import BoardPickerModal from '../components/BoardPickerModal';
import SettingsMenuModal from '../components/SettingsMenuModal';
import { Colors } from '../constants/Colors';
import { SamplePins, LocalPins } from '../constants/Images';
import { DownloadService } from '../services/DownloadService';
import { BoardService } from '../services/BoardService';
import { StorageService } from '../services/StorageService';
import { enrichPinsWithDimensions } from '../utils/imageOptimization';
import { getDeviceType } from '../utils/responsive';

interface Pin {
  id: string;
  imageUri: string | number; // string (remota) o number (require local)
  title: string;
  description: string;
  author: string;
  likes: number;
  isLiked: boolean;
  isSaved: boolean;
  width?: number; // Ancho original de la imagen (opcional)
  height?: number; // Alto original de la imagen (opcional)
}

interface HomeScreenProps {
  onUpload?: () => void;
  onTabPress?: (tab: string) => void;
}

export default function HomeScreen({ onUpload = () => {}, onTabPress = () => {} }: HomeScreenProps) {
  // Configuración de paginación para scroll infinito
  const ITEMS_PER_PAGE = 15;
  
  // Limitar imágenes iniciales para evitar problemas de memoria
  // Enriquecer pines con dimensiones para mampostería óptima
  const initialPinsRaw = [...LocalPins.slice(0, ITEMS_PER_PAGE), ...SamplePins];
  const initialPins = enrichPinsWithDimensions(initialPinsRaw) as Pin[];
  
  // Estados
  const [localPins, setLocalPins] = useState<Pin[]>(initialPins);
  const [uploadedPins, setUploadedPins] = useState<Pin[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const currentPageRef = useRef(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const isLoadingMoreRef = useRef(false);
  const [hasMoreItems, setHasMoreItems] = useState(LocalPins.length > ITEMS_PER_PAGE);
  const [showOptions, setShowOptions] = useState(false);
  const [selectedPin, setSelectedPin] = useState<Pin | null>(null);
  const [showImageDetail, setShowImageDetail] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [showIdeaPinCreator, setShowIdeaPinCreator] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showBoardPicker, setShowBoardPicker] = useState(false);
  const [pinToSave, setPinToSave] = useState<Pin | null>(null);
  const scrollRef = useRef<any>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUserName, setCurrentUserName] = useState<string>('Usuario');
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  
  // Detectar si es web para tema claro
  const isWeb = Platform.OS === 'web';
  const deviceType = getDeviceType();
  
  const [isDarkMode, setIsDarkMode] = useState(!isWeb); // Oscuro en móvil, claro en web por defecto

  // Colores dinámicos basados en el tema
  const themeColors = {
    background: isDarkMode ? Colors.background : Colors.pinterestBackground,
    surface: isDarkMode ? Colors.surface : Colors.pinterestSurface,
    text: isDarkMode ? Colors.text : Colors.pinterestText,
    textSecondary: isDarkMode ? Colors.textSecondary : Colors.pinterestTextSecondary,
    border: isDarkMode ? '#333' : Colors.pinterestBorder,
    gradientStart: isDarkMode ? Colors.gradientStart : '#F0F0F0',
    gradientEnd: isDarkMode ? Colors.gradientEnd : '#FFFFFF',
  };

  // Cargar pines guardados al iniciar
  useEffect(() => {
    loadCurrentUserAndPins();
  }, []);

  // Función para cargar el usuario actual y sus pines
  const loadCurrentUserAndPins = async () => {
    try {
      const session = await StorageService.getUserSession();
      if (session && session.userId) {
        setCurrentUserId(session.userId);
        setCurrentUserName(session.displayName || session.username || 'Usuario');
        console.log('[HomeScreen] Usuario actual:', session.userId, session.displayName);
        await loadUploadedPins(session.userId);
      } else {
        console.log('[HomeScreen] No hay sesión activa, usando almacenamiento global');
        await loadUploadedPins();
      }
    } catch (error) {
      console.error('[HomeScreen] Error cargando usuario y pines:', error);
    }
  };

  // Función para cargar pines guardados desde AsyncStorage
  const loadUploadedPins = async (userId?: string) => {
    try {
      let saved;
      if (userId) {
        saved = await StorageService.getUserPinsByUserId(userId);
      } else {
        saved = await StorageService.getUserPins();
      }
      console.log('[HomeScreen] Pines cargados desde storage:', saved?.length || 0);
      if (saved && Array.isArray(saved)) {
        setUploadedPins(saved);
      }
    } catch (error) {
      console.error('[HomeScreen] Error cargando pines guardados:', error);
    }
  };

  // Función para guardar pines en AsyncStorage
  const saveUploadedPins = async (pins: Pin[]) => {
    try {
      if (currentUserId) {
        await StorageService.saveUserPinsByUserId(currentUserId, pins);
        console.log('[HomeScreen] Pines guardados para usuario:', currentUserId, pins.length);
      } else {
        await StorageService.saveUserPins(pins);
        console.log('[HomeScreen] Pines guardados en almacenamiento global:', pins.length);
      }
    } catch (error) {
      console.error('[HomeScreen] Error guardando pines:', error);
    }
  };

  // Combinar pines subidos con pines locales (los subidos van primero) sin duplicados
  const allPins = useMemo(() => {
    const seen = new Set<string>();
    const combined = [...uploadedPins, ...localPins];
    const unique: Pin[] = [];
    for (const p of combined) {
      if (!seen.has(p.id)) {
        seen.add(p.id);
        unique.push(p);
      }
    }
    console.log('[HomeScreen] Total de pines mostrados:', unique.length, '(Subidos:', uploadedPins.length, 'Locales:', localPins.length, ')');
    return unique;
  }, [uploadedPins, localPins]);

  // Cargar más imágenes al hacer scroll (sin retardo)
  const loadMorePins = () => {
    if (isLoadingMoreRef.current || !hasMoreItems) return;
    isLoadingMoreRef.current = true;
    setIsLoadingMore(true);
    
    const startIndex = currentPageRef.current * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const nextBatch = LocalPins.slice(startIndex, endIndex);
    
    if (nextBatch.length > 0) {
      // Enriquecer nuevos pines con dimensiones
      const enrichedBatch = enrichPinsWithDimensions(nextBatch) as Pin[];
      setLocalPins(prev => [...prev, ...enrichedBatch]);
      setCurrentPage(prev => prev + 1);
      currentPageRef.current = currentPageRef.current + 1;
      setHasMoreItems(endIndex < LocalPins.length);
    } else {
      setHasMoreItems(false);
    }
    
    setIsLoadingMore(false);
    isLoadingMoreRef.current = false;
  };

  // Handlers para Like y Save
  const handleLike = async (pinId?: string) => {
    if (!pinId) return;
    
    // Actualizar en pines locales
    setLocalPins(prev => prev.map(pin => 
      pin.id === pinId 
        ? { ...pin, isLiked: !pin.isLiked, likes: pin.isLiked ? pin.likes - 1 : pin.likes + 1 }
        : pin
    ));
    
    // Actualizar en pines subidos si corresponde
    const updatedUploadedPins = uploadedPins.map(pin => 
      pin.id === pinId 
        ? { ...pin, isLiked: !pin.isLiked, likes: pin.isLiked ? pin.likes - 1 : pin.likes + 1 }
        : pin
    );
    
    if (uploadedPins.some(pin => pin.id === pinId)) {
      setUploadedPins(updatedUploadedPins);
      await saveUploadedPins(updatedUploadedPins);
    }
  };
  
  const handleSave = async (pinId?: string) => {
    if (!pinId) return;
    
    // Actualizar en pines locales
    setLocalPins(prev => prev.map(pin => 
      pin.id === pinId 
        ? { ...pin, isSaved: !pin.isSaved }
        : pin
    ));
    
    // Actualizar en pines subidos si corresponde
    const updatedUploadedPins = uploadedPins.map(pin => 
      pin.id === pinId 
        ? { ...pin, isSaved: !pin.isSaved }
        : pin
    );
    
    if (uploadedPins.some(pin => pin.id === pinId)) {
      setUploadedPins(updatedUploadedPins);
      await saveUploadedPins(updatedUploadedPins);
    }
  };
  
  const handleShowOptions = (pin?: Pin) => {
    setSelectedPin(pin || null);
    setShowOptions(true);
  };
  const handleCloseOptions = () => {
    setShowOptions(false);
    // Limpiar el pin después de un pequeño delay para suavizar la animación
    setTimeout(() => setSelectedPin(null), 100);
  };
  const handleImagePress = (pin?: Pin) => {
    setSelectedPin(pin || null);
    setShowImageDetail(true);
  };
  const handleCloseImageDetail = () => {
    setShowImageDetail(false);
    // Limpiar el pin después para mejorar rendimiento
    setTimeout(() => setSelectedPin(null), 100);
  };
  const handleQuickSearch = () => {};
  const handleQuickProfile = () => {};
  const handleQuickSettings = () => {};
  const handleCreateIdeaPin = () => setShowIdeaPinCreator(true);
  const handlePublishIdeaPin = () => setShowIdeaPinCreator(false);

  // Upload handling: abrir modal y agregar pin nuevo a la lista
  const handleOpenUpload = () => {
    console.log('[HomeScreen] Abriendo modal de subida');
    setShowUpload(true);
  };
  const handleCancelUpload = () => {
    console.log('[HomeScreen] Cancelando subida');
    setShowUpload(false);
  };
  const handleUpload = async (imageUri: string, title: string, description: string) => {
    console.log('[HomeScreen] ⬆️ SUBIENDO NUEVO PIN');
    console.log('[HomeScreen] Subiendo nuevo pin. Pines actuales - Subidos:', uploadedPins.length, 'Locales:', localPins.length);
    
    const newPin: Pin = {
      id: `uploaded_${Date.now()}`,
      imageUri,
      title,
      description,
      author: currentUserName,
      likes: 0,
      isLiked: false,
      isSaved: false,
    };
    
    console.log('[HomeScreen] Nuevo pin creado:', newPin.id, newPin.title);
    
    // Agregar el nuevo pin al principio de los pines subidos
    const updatedPins = [newPin, ...uploadedPins];
    console.log('[HomeScreen] Actualizando pines subidos. Total después de subir:', updatedPins.length);
    setUploadedPins(updatedPins);
    
    // Guardar en AsyncStorage
    await saveUploadedPins(updatedPins);
    console.log('[HomeScreen] Pin guardado en AsyncStorage');
    
    setShowUpload(false);
    
    // Hacer scroll al inicio para que el usuario vea su nuevo pin
    setTimeout(() => {
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    }, 100);
    
    Alert.alert('¡Pin Creado!', 'Tu pin se ha guardado correctamente y aparece al inicio del feed');
  };

  // Nueva función para manejar descargas
  const handleDownload = async (pin: Pin) => {
    try {
      console.log('[HomeScreen] Descargando pin:', pin.id, typeof pin.imageUri);
      await DownloadService.downloadToGallery(pin.imageUri, pin.title);
    } catch (error) {
      console.error('[HomeScreen] Error al descargar:', error);
      Alert.alert('Error', 'No se pudo descargar la imagen. Intenta de nuevo.');
    }
  };

  // Función para compartir imágenes
  const handleShare = async (pin: Pin) => {
    try {
      console.log('[HomeScreen] Compartiendo pin:', pin.id);
      await DownloadService.shareImage(pin.imageUri, pin.title);
    } catch (error) {
      console.error('[HomeScreen] Error al compartir:', error);
      Alert.alert('Error', 'No se pudo compartir la imagen. Intenta de nuevo.');
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

  // Funciones para el menú de configuración
  const handleOpenSettings = () => {
    setShowSettingsMenu(true);
  };

  const handleCloseSettings = () => {
    setShowSettingsMenu(false);
  };

  // Toggle para cambiar entre modo claro y oscuro
  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const handleLogout = async () => {
    try {
      const { AuthService } = require('../services/AuthService');
      await AuthService.logout();
      Alert.alert('Sesión cerrada', 'Has cerrado sesión correctamente', [
        {
          text: 'OK',
          onPress: () => {
            // Recargar la app navegando al login
            onTabPress('logout'); // Esto debería manejarse en App.tsx
          },
        },
      ]);
    } catch (error) {
      console.error('[HomeScreen] Error al cerrar sesión:', error);
      Alert.alert('Error', 'No se pudo cerrar sesión. Intenta de nuevo.');
    }
  };

  const handleSwitchAccount = async () => {
    try {
      const { AuthService } = require('../services/AuthService');
      await AuthService.logout();
      Alert.alert('Cambiar de cuenta', 'Redirigiendo al login...', [
        {
          text: 'OK',
          onPress: () => {
            onTabPress('logout');
          },
        },
      ]);
    } catch (error) {
      console.error('[HomeScreen] Error al cambiar de cuenta:', error);
      Alert.alert('Error', 'No se pudo cambiar de cuenta. Intenta de nuevo.');
    }
  };

  const handleSupport = () => {
    Alert.alert(
      'Soporte y Ayuda',
      'Opciones de soporte:\n\n' +
      '📧 Email: alex18abdon@gmail.com\n' +
      '💬 Chat en vivo: Próximamente\n' +
      '📚 Centro de ayuda: Próximamente\n\n' +
      '¿Cómo podemos ayudarte?',
      [
        {
          text: 'Enviar Email',
          onPress: () => {
            Alert.alert('Email', 'Abre tu cliente de correo y escribe a:\nalex18abdon@gmail.com');
          },
        },
        { text: 'Cerrar', style: 'cancel' },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <LinearGradient
        colors={[themeColors.gradientStart, themeColors.gradientEnd]}
        style={styles.gradient}
      >
        <View style={[styles.header, { backgroundColor: isDarkMode ? 'transparent' : themeColors.surface, borderBottomColor: themeColors.border }]}>
          <View style={styles.profileRow}>
            <Text style={[styles.profileName, { color: themeColors.text }]}>{currentUserName}</Text>
            <TouchableOpacity 
              style={[styles.profileIcon, { backgroundColor: themeColors.surface }]}
              onPress={handleOpenSettings}
            >
              <Text style={{ fontSize: 16 }}>⚙️</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={[styles.title, { color: themeColors.text }]}>Para ti</Text>
          
          {/* Botón de toggle de tema */}
          <TouchableOpacity
            onPress={toggleTheme}
            style={[styles.themeButton, { backgroundColor: themeColors.surface }]}
          >
            <Text style={styles.themeIcon}>{isDarkMode ? '☀️' : '🌙'}</Text>
          </TouchableOpacity>
        </View>

        {/* Lista de Pines con Masonry Layout e Infinite Scroll */}
        <MasonryLayout
          ref={scrollRef}
          data={allPins}
          renderItem={(item) => (
            <ImageCard
              pin={item}
              onLike={() => handleLike(item.id)}
              onSave={() => handleSave(item.id)}
              onShowOptions={() => handleShowOptions(item)}
              onImagePress={() => handleImagePress(item)}
              isDarkMode={isDarkMode}
            />
          )}
          numColumns={isWeb ? undefined : 2}
          onEndReached={loadMorePins}
          onEndReachedThreshold={0.5}
          isLoadingMore={isLoadingMore}
        />

          {/* Modal de opciones */}
          {showOptions && selectedPin ? (
            <OptionsModal
              visible={showOptions}
              pin={selectedPin}
              onClose={handleCloseOptions}
              onFollow={() => {}}
              onShare={() => handleShare(selectedPin)}
              onCopyLink={() => {}}
              onDownload={() => handleDownload(selectedPin)}
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
              onShare={() => handleShare(selectedPin)}
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
              if (tab === 'upload') {
                handleOpenUpload();
              } else {
                setActiveTab(tab);
                onTabPress(tab);
              }
            }}
          />

          <IdeaPinCreator
            visible={showIdeaPinCreator}
            onClose={() => setShowIdeaPinCreator(false)}
            onPublish={handlePublishIdeaPin}
          />
          
          {showUpload && (
            <View style={styles.uploadModal}>
              <UploadScreen
                onUpload={handleUpload}
                onCancel={handleCancelUpload}
              />
            </View>
          )}

          <BoardPickerModal
            visible={showBoardPicker}
            onClose={() => { setShowBoardPicker(false); setPinToSave(null); }}
            onBoardSelected={handleBoardSelected}
          />

          <SettingsMenuModal
            visible={showSettingsMenu}
            onClose={handleCloseSettings}
            onLogout={handleLogout}
            onSwitchAccount={handleSwitchAccount}
            onSupport={handleSupport}
            userName={currentUserName}
          />
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webContainer: {
    backgroundColor: Colors.pinterestBackground,
  },
  gradient: {
    flex: 1,
  },
  webGradient: {
    flex: 1,
    backgroundColor: Colors.pinterestBackground,
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
    borderBottomWidth: 1,
  },
  webHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: Colors.pinterestBackground,
    borderBottomWidth: 1,
    borderBottomColor: Colors.pinterestBorder,
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
  webProfileName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.pinterestText,
    marginRight: 12,
  },
  profileIcon: {
    backgroundColor: '#eee',
    borderRadius: 20,
    padding: 6,
  },
  webProfileIcon: {
    backgroundColor: Colors.pinterestHover,
    borderRadius: 24,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    ...(Platform.OS === 'web' ? {
      cursor: 'pointer',
      transition: 'background-color 0.2s ease',
    } : {}),
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
    fontFamily: 'sans-serif-medium',
    letterSpacing: 0.5,
  },
  themeButton: {
    backgroundColor: '#eee',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    ...(Platform.OS === 'web' ? {
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    } : {}),
  },
  themeIcon: {
    fontSize: 20,
  },
  webTitle: {
    fontSize: 28,
    fontWeight: '600',
    color: Colors.pinterestText,
    letterSpacing: -0.5,
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
  uploadModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
});
