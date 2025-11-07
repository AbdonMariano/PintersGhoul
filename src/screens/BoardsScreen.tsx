import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import BackButton from '../components/BackButton';
import RefreshButton from '../components/RefreshButton';
import AnimatedButton from '../components/AnimatedButton';
import { Colors } from '../constants/Colors';
import { BoardService, Board } from '../services/BoardService';

export default function BoardsScreen({ onBack }: { onBack: () => void }) {
  const [boards, setBoards] = useState<Board[]>(BoardService.getAllBoards());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showCreateBoard, setShowCreateBoard] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setBoards(BoardService.getAllBoards());
      setIsRefreshing(false);
    }, 1500);
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
          setBoards(prev => [newBoard, ...prev]);
          Alert.alert('¡Éxito!', 'Tablero creado correctamente');
        }
      }
    );
  };

  const handleEditBoard = (board: Board) => {
    Alert.alert('Editar Tablero', `Funcionalidad de edición para: ${board.name}`);
  };

  const handleDeleteBoard = (board: Board) => {
    Alert.alert(
      'Eliminar Tablero',
      `¿Estás seguro de eliminar "${board.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            BoardService.deleteBoard(board.id);
            setBoards(prev => prev.filter(b => b.id !== board.id));
            Alert.alert('Tablero eliminado');
          }
        }
      ]
    );
  };

  const handleAddCollaborator = (board: Board) => {
    Alert.prompt(
      'Agregar Colaborador',
      'ID del usuario:',
      (userId) => {
        if (userId && userId.trim()) {
          BoardService.addCollaborator(board.id, userId.trim());
          setBoards(BoardService.getAllBoards());
          Alert.alert('Colaborador agregado');
        }
      }
    );
  };

  const renderBoard = ({ item }: { item: Board }) => (
    <View style={styles.boardCard}>
      <Image source={{ uri: item.coverImage }} style={styles.boardCover} />
      <View style={styles.boardInfo}>
        <Text style={styles.boardName}>{item.name}</Text>
        <Text style={styles.boardDescription}>{item.description}</Text>
        <View style={styles.boardStats}>
          <Text style={styles.boardStat}>{item.pinCount} pins</Text>
          <Text style={styles.boardStat}>
            {item.collaborators.length} colaboradores
          </Text>
        </View>
        <View style={styles.boardActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleEditBoard(item)}
          >
            <Text style={styles.actionIcon}>✏️</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleAddCollaborator(item)}
          >
            <Text style={styles.actionIcon}>👥</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleDeleteBoard(item)}
          >
            <Text style={styles.actionIcon}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.gradientStart, Colors.gradientEnd]}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <BackButton onPress={onBack} title="Tableros" showTitle />
          <RefreshButton onRefresh={handleRefresh} isRefreshing={isRefreshing} />
        </View>

        <View style={styles.createButtonContainer}>
          <AnimatedButton
            onPress={handleCreateBoard}
            gradient
            gradientColors={[Colors.redGradientStart, Colors.redGradientEnd]}
            style={styles.createButton}
          >
            <Text style={styles.createButtonText}>+ Crear Tablero</Text>
          </AnimatedButton>
        </View>

        <FlatList
          data={boards}
          renderItem={renderBoard}
          keyExtractor={item => item.id}
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
              <Text style={styles.emptyTitle}>No hay tableros</Text>
              <Text style={styles.emptySubtitle}>
                Crea tu primer tablero para organizar tus pins
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
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  createButtonContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  createButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  createButtonText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 12,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  boardCard: {
    backgroundColor: Colors.surface,
    borderRadius: 15,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  boardCover: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  boardInfo: {
    padding: 15,
  },
  boardName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 5,
  },
  boardDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 10,
  },
  boardStats: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  boardStat: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginRight: 15,
  },
  boardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  actionButton: {
    backgroundColor: Colors.background,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 15,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 5,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
