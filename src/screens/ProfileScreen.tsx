import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ImageCard from '../components/ImageCard';
import BackButton from '../components/BackButton';
import AnimatedButton from '../components/AnimatedButton';
import EditProfileModal from '../components/EditProfileModal';
import BoardPickerModal from '../components/BoardPickerModal';
import { Colors } from '../constants/Colors';
import { SamplePins } from '../constants/Images';
import { Pin } from '../types/Pin';
import { BoardService } from '../services/BoardService';
import { AuthService } from '../services/AuthService';

export default function ProfileScreen({ onTabPress, onBack }: { onTabPress: (tab: string) => void; onBack?: () => void }) {
  const [activeTab, setActiveTab] = useState('pins');
  const [userPins, setUserPins] = useState<Pin[]>(SamplePins.slice(0, 3));
  const [savedPins, setSavedPins] = useState<Pin[]>(SamplePins.filter(pin => pin.isSaved));
  const [boards, setBoards] = useState(BoardService.getAllBoards());
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [username, setUsername] = useState('GhoulUser');
  const [bio, setBio] = useState('Fanático de Tokyo Ghoul | Arte Digital | Cosplay');

  const userStats = {
    followers: 1250,
    following: 89,
    pins: userPins.length,
    boards: boards.length,
  };


  const handleLike = (id: string) => {
    setUserPins(prevPins =>
      prevPins.map(pin =>
        pin.id === id
          ? {
              ...pin,
              isLiked: !pin.isLiked,
              likes: pin.isLiked ? pin.likes - 1 : pin.likes + 1,
            }
          : pin
      )
    );
  };

  const handleSave = (id: string) => {
    setUserPins(prevPins =>
      prevPins.map(pin =>
        pin.id === id ? { ...pin, isSaved: !pin.isSaved } : pin
      )
    );
  };

  const handleShowOptions = (pin: Pin) => {
    Alert.alert('Opciones', `Opciones para ${pin.title}`);
  };

  const handleEditProfile = () => {
    setShowEditProfile(true);
  };

  const handleSaveProfile = async (newUsername: string, newBio: string) => {
    setUsername(newUsername);
    setBio(newBio);
    // Actualizar en AuthService
    const result = await AuthService.updateProfile({ 
      displayName: newUsername, 
      bio: newBio 
    });
    if (result.success) {
      Alert.alert('¡Perfil actualizado!', 'Tus cambios se han guardado correctamente.');
    } else {
      Alert.alert('Error', result.error || 'No se pudo actualizar el perfil.');
    }
  };

  const handleSettings = () => {
    onTabPress('settings');
  };

  const handleBoards = () => {
    onTabPress('boards');
  };

  const handleCreateBoard = () => {
    Alert.prompt(
      'Crear Tablero',
      'Nombre del tablero:',
      (name) => {
        if (name && name.trim()) {
          const newBoard = BoardService.createBoard({
            name: name.trim(),
            description: 'Tablero de Tokyo Ghoul',
            coverImage: 'https://i.pinimg.com/564x/8a/4b/2a/8a4b2a1c3f5e7d9b8c6a4e2f1d3c5b7a.jpg',
            isPrivate: false,
            collaborators: [],
            category: 'general'
          });
          setBoards(BoardService.getAllBoards());
          Alert.alert('¡Éxito!', 'Tablero creado correctamente');
        }
      }
    );
  };

  const handleImagePress = (pin: Pin) => {
    Alert.alert('Pin', pin.title || 'Ver detalles del pin');
  };

  const renderPin = ({ item }: { item: Pin }) => (
    <ImageCard
      pin={item}
      onLike={handleLike}
      onSave={handleSave}
      onShowOptions={handleShowOptions}
      onImagePress={handleImagePress}
    />
  );

  const renderBoard = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.boardItem}>
      <Image source={{ uri: item.coverImage }} style={styles.boardImage} />
      <View style={styles.boardOverlay}>
        <Text style={styles.boardName}>{item.name}</Text>
        <Text style={styles.boardCount}>{item.pinCount} pins</Text>
      </View>
    </TouchableOpacity>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'pins':
        return (
          <FlatList
            data={userPins}
            renderItem={renderPin}
            keyExtractor={item => item.id}
            numColumns={2}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
        );
      case 'boards':
        return (
          <FlatList
            data={boards}
            renderItem={renderBoard}
            keyExtractor={item => item.id}
            numColumns={2}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
        );
      case 'saved':
        return (
          <FlatList
            data={savedPins}
            renderItem={renderPin}
            keyExtractor={item => item.id}
            numColumns={2}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.gradientStart, Colors.gradientEnd]}
        style={styles.gradient}
      >
        <View style={styles.content}>
        <View style={styles.header}>
          {onBack && <BackButton onPress={onBack} />}
          <Text style={styles.title}>Perfil</Text>
          <View style={styles.headerButtons}>
            <AnimatedButton style={styles.headerButton} onPress={handleBoards}>
              <Text style={styles.headerButtonIcon}>📌</Text>
            </AnimatedButton>
            <AnimatedButton style={styles.headerButton} onPress={handleSettings}>
              <Text style={styles.headerButtonIcon}>⚙️</Text>
            </AnimatedButton>
          </View>
        </View>

          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop' }}
                style={styles.avatar}
              />
              <AnimatedButton style={styles.editButton} onPress={handleEditProfile}>
                <Text style={styles.editButtonText}>Editar</Text>
              </AnimatedButton>
            </View>

            <Text style={styles.username}>GhoulUser</Text>
            <Text style={styles.bio}>{bio}</Text>

            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{userStats.pins}</Text>
                <Text style={styles.statLabel}>Pins</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{userStats.boards}</Text>
                <Text style={styles.statLabel}>Tableros</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{userStats.followers}</Text>
                <Text style={styles.statLabel}>Seguidores</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{userStats.following}</Text>
                <Text style={styles.statLabel}>Siguiendo</Text>
              </View>
            </View>
          </View>

          <View style={styles.tabsContainer}>
            <View style={[styles.tab, activeTab === 'pins' && styles.activeTab]}>
              <AnimatedButton onPress={() => setActiveTab('pins')}>
                <Text style={[styles.tabText, activeTab === 'pins' && styles.activeTabText]}>
                  Pins
                </Text>
              </AnimatedButton>
            </View>
            <View style={[styles.tab, activeTab === 'boards' && styles.activeTab]}>
              <AnimatedButton onPress={() => setActiveTab('boards')}>
                <Text style={[styles.tabText, activeTab === 'boards' && styles.activeTabText]}>
                  Tableros
                </Text>
              </AnimatedButton>
            </View>
            <View style={[styles.tab, activeTab === 'saved' && styles.activeTab]}>
              <AnimatedButton onPress={() => setActiveTab('saved')}>
                <Text style={[styles.tabText, activeTab === 'saved' && styles.activeTabText]}>
                  Guardados
                </Text>
              </AnimatedButton>
            </View>
          </View>

          {renderTabContent()}

          {activeTab === 'boards' && (
            <AnimatedButton style={styles.createBoardButton} onPress={handleCreateBoard}>
              <LinearGradient
                colors={[Colors.redGradientStart, Colors.redGradientEnd]}
                style={styles.createBoardGradient}
              >
                <Text style={styles.createBoardText}>+ Crear Tablero</Text>
              </LinearGradient>
            </AnimatedButton>
          )}
        </View>

        <EditProfileModal
          visible={showEditProfile}
          onClose={() => setShowEditProfile(false)}
          currentUsername={username}
          currentBio={bio}
          onSave={handleSaveProfile}
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
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primary,
    textShadowColor: Colors.ghoulRed,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  headerButton: {
    padding: 10,
  },
  headerButtonIcon: {
    fontSize: 24,
    color: Colors.text,
  },
  profileSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.primary,
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  editButtonText: {
    color: Colors.text,
    fontSize: 12,
    fontWeight: 'bold',
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 5,
  },
  bio: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  activeTabText: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  list: {
    paddingHorizontal: 10,
    paddingBottom: 100,
  },
  boardItem: {
    flex: 1,
    margin: 8,
    borderRadius: 12,
    overflow: 'hidden',
    height: 150,
  },
  boardImage: {
    width: '100%',
    height: '100%',
  },
  boardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 10,
  },
  boardName: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: 'bold',
  },
  boardCount: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
  createBoardButton: {
    margin: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  createBoardGradient: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  createBoardText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
