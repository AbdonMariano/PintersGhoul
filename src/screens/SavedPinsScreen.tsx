import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ImageCard from '../components/ImageCard';
import BackButton from '../components/BackButton';
import RefreshButton from '../components/RefreshButton';
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

export default function SavedPinsScreen({ onBack }: { onBack: () => void }) {
  const [savedPins, setSavedPins] = useState<Pin[]>(SamplePins.filter(pin => pin.isSaved));
  const [selectedBoard, setSelectedBoard] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const boards = [
    { id: 'all', name: 'Todos los guardados', count: savedPins.length },
    { id: 'kaneki', name: 'Kaneki Collection', count: 12 },
    { id: 'art', name: 'Arte Tokyo Ghoul', count: 8 },
    { id: 'cosplay', name: 'Cosplay', count: 5 },
    { id: 'manga', name: 'Manga Panels', count: 7 },
  ];

  const handleLike = (id: string) => {
    setSavedPins(prevPins =>
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
    setSavedPins(prevPins => prevPins.filter(pin => pin.id !== id));
    Alert.alert('Eliminado', 'Pin eliminado de guardados');
  };

  const handleShowOptions = (pin: Pin) => {
    Alert.alert('Opciones', `Opciones para ${pin.title}`);
  };

  const handleCreateBoard = () => {
    Alert.alert('Crear Tablero', 'Funcionalidad de crear tablero');
  };

  const handleBoardSelect = (boardId: string) => {
    setSelectedBoard(boardId);
    // Filter pins by board
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setSavedPins(SamplePins.filter(pin => pin.isSaved));
      setIsRefreshing(false);
    }, 1500);
  };

  const handleImagePress = (pin: Pin) => {
    Alert.alert('Pin guardado', pin.title || 'Ver detalles');
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

  const renderBoard = (board: any) => (
    <TouchableOpacity
      key={board.id}
      style={[
        styles.boardItem,
        selectedBoard === board.id && styles.selectedBoard,
      ]}
      onPress={() => handleBoardSelect(board.id)}
    >
      <Text style={[
        styles.boardName,
        selectedBoard === board.id && styles.selectedBoardName,
      ]}>
        {board.name}
      </Text>
      <Text style={[
        styles.boardCount,
        selectedBoard === board.id && styles.selectedBoardCount,
      ]}>
        {board.count}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.gradientStart, Colors.gradientEnd]}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <BackButton onPress={onBack} title="Guardados" showTitle />
          <RefreshButton onRefresh={handleRefresh} isRefreshing={isRefreshing} />
        </View>

        <View style={styles.boardsContainer}>
          <FlatList
            data={boards}
            renderItem={({ item }) => renderBoard(item)}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.boardsList}
          />
        </View>

        <View style={styles.pinsHeader}>
          <Text style={styles.pinsCount}>
            {savedPins.length} pins guardados
          </Text>
          <TouchableOpacity style={styles.sortButton}>
            <Text style={styles.sortButtonText}>Ordenar</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={savedPins}
          renderItem={renderPin}
          keyExtractor={item => item.id}
          numColumns={2}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={Colors.primary}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📌</Text>
              <Text style={styles.emptyTitle}>No hay pins guardados</Text>
              <Text style={styles.emptySubtitle}>
                Guarda pins que te gusten para verlos aquí
              </Text>
            </View>
          }
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
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primary,
    textShadowColor: Colors.ghoulRed,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  createButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  createButtonText: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: 'bold',
  },
  boardsContainer: {
    paddingBottom: 20,
  },
  boardsList: {
    paddingHorizontal: 20,
  },
  boardItem: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginRight: 10,
    backgroundColor: Colors.surface,
    borderRadius: 25,
    alignItems: 'center',
    minWidth: 120,
  },
  selectedBoard: {
    backgroundColor: Colors.primary,
  },
  boardName: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
    marginBottom: 2,
  },
  selectedBoardName: {
    color: Colors.text,
    fontWeight: 'bold',
  },
  boardCount: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  selectedBoardCount: {
    color: Colors.text,
  },
  pinsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  pinsCount: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '500',
  },
  sortButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: Colors.surface,
    borderRadius: 20,
  },
  sortButtonText: {
    color: Colors.text,
    fontSize: 14,
  },
  list: {
    paddingHorizontal: 10,
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    color: Colors.text,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});
