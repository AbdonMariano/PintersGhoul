import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList, TextInput, Alert } from 'react-native';
import { Colors } from '../constants/Colors';
import { BoardService, Board } from '../services/BoardService';

interface BoardPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onBoardSelected: (board: Board) => void;
}

export default function BoardPickerModal({ visible, onClose, onBoardSelected }: BoardPickerModalProps) {
  const boards = BoardService.getAllBoards();

  const handleCreateBoard = () => {
    Alert.prompt(
      'Crear Tablero',
      'Nombre del tablero:',
      (name) => {
        if (!name || !name.trim()) return;
        const newBoard = BoardService.createBoard({
          name: name.trim(),
          description: 'Nuevo tablero',
          coverImage: 'https://i.pinimg.com/564x/7b/3c/9d/7b3c9d2e4f6a8c1b9d7e5f3a2c4b6d8e.jpg',
          isPrivate: false,
          collaborators: [],
          category: 'general',
        });
        onBoardSelected(newBoard);
        onClose();
      }
    );
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>Guardar en tablero</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={boards}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.item} onPress={() => { onBoardSelected(item); onClose(); }}>
                <Text style={styles.itemText}>{item.name}</Text>
                <Text style={styles.itemSub}>{item.pinCount} pins</Text>
              </TouchableOpacity>
            )}
            ListFooterComponent={
              <TouchableOpacity style={[styles.item, styles.createItem]} onPress={handleCreateBoard}>
                <Text style={[styles.itemText, { color: Colors.primary }]}>+ Crear tablero</Text>
              </TouchableOpacity>
            }
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
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
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontSize: 18,
    color: Colors.text,
    fontWeight: 'bold',
  },
  item: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  createItem: {
    backgroundColor: Colors.background,
  },
  itemText: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '600',
  },
  itemSub: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },
});
