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
import { Colors } from '../constants/Colors';
import { SamplePins } from '../constants/Images';

interface Pin {
  id: string;
  imageUri: string;
  title: string;
  description: string;
  author: string;
  likes: number;
  isLiked: boolean;
  isSaved: boolean;
}

export default function ProfileScreen({ onTabPress }: { onTabPress: (tab: string) => void }) {
  const [activeTab, setActiveTab] = useState('pins');
  const [userPins, setUserPins] = useState<Pin[]>(SamplePins.slice(0, 3));
  const [savedPins, setSavedPins] = useState<Pin[]>(SamplePins.filter(pin => pin.isSaved));

  const userStats = {
    followers: 1250,
    following: 89,
    pins: userPins.length,
    boards: 12,
  };

  const boards = [
    { id: '1', name: 'Kaneki Collection', pinCount: 45, coverImage: SamplePins[0].imageUri },
    { id: '2', name: 'Tokyo Ghoul Art', pinCount: 32, coverImage: SamplePins[1].imageUri },
    { id: '3', name: 'Ghoul Cosplay', pinCount: 28, coverImage: SamplePins[2].imageUri },
    { id: '4', name: 'Manga Panels', pinCount: 67, coverImage: SamplePins[3].imageUri },
  ];

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
    Alert.alert('Editar Perfil', 'Funcionalidad de edición de perfil');
  };

  const handleSettings = () => {
    onTabPress('settings');
  };

  const handleBoards = () => {
    onTabPress('boards');
  };

  const handleCreateBoard = () => {
    Alert.alert('Crear Tablero', 'Funcionalidad de crear tablero');
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
          <Text style={styles.title}>Perfil</Text>
          <View style={styles.headerButtons}>
            <TouchableOpacity style={styles.headerButton} onPress={handleBoards}>
              <Text style={styles.headerButtonIcon}>📌</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton} onPress={handleSettings}>
              <Text style={styles.headerButtonIcon}>⚙️</Text>
            </TouchableOpacity>
          </View>
        </View>

          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop' }}
                style={styles.avatar}
              />
              <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
                <Text style={styles.editButtonText}>Editar</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.username}>GhoulUser</Text>
            <Text style={styles.bio}>Fanático de Tokyo Ghoul | Arte Digital | Cosplay</Text>

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
            <TouchableOpacity
              style={[styles.tab, activeTab === 'pins' && styles.activeTab]}
              onPress={() => setActiveTab('pins')}
            >
              <Text style={[styles.tabText, activeTab === 'pins' && styles.activeTabText]}>
                Pins
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'boards' && styles.activeTab]}
              onPress={() => setActiveTab('boards')}
            >
              <Text style={[styles.tabText, activeTab === 'boards' && styles.activeTabText]}>
                Tableros
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'saved' && styles.activeTab]}
              onPress={() => setActiveTab('saved')}
            >
              <Text style={[styles.tabText, activeTab === 'saved' && styles.activeTabText]}>
                Guardados
              </Text>
            </TouchableOpacity>
          </View>

          {renderTabContent()}

          {activeTab === 'boards' && (
            <TouchableOpacity style={styles.createBoardButton} onPress={handleCreateBoard}>
              <LinearGradient
                colors={[Colors.redGradientStart, Colors.redGradientEnd]}
                style={styles.createBoardGradient}
              >
                <Text style={styles.createBoardText}>+ Crear Tablero</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>
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
