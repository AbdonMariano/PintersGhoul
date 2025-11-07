import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/Colors';
import AnimatedButton from './AnimatedButton';

interface FloatingActionButtonProps {
  onUpload: () => void;
  onSearch: () => void;
  onProfile: () => void;
  onSettings: () => void;
  onIdeaPin?: () => void;
  onLinks?: () => void;
  onMessages?: () => void;
}

const { width } = Dimensions.get('window');

export default function FloatingActionButton({
  onUpload,
  onSearch,
  onProfile,
  onSettings,
  onIdeaPin,
  onLinks,
  onMessages,
}: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    { id: 'upload', icon: '📷', label: 'Subir Pin', onPress: onUpload },
    { id: 'idea', icon: '💡', label: 'Idea Pin', onPress: onIdeaPin },
    { id: 'search', icon: '🔍', label: 'Buscar', onPress: onSearch },
    { id: 'links', icon: '🔗', label: 'Enlaces', onPress: onLinks },
    { id: 'messages', icon: '💬', label: 'Mensajes', onPress: onMessages },
    { id: 'profile', icon: '👤', label: 'Perfil', onPress: onProfile },
    { id: 'settings', icon: '⚙️', label: 'Configuración', onPress: onSettings },
  ];

  const handleActionPress = (action: any) => {
    action.onPress();
    setIsOpen(false);
  };

  return (
    <>
      <View style={styles.container}>
        {isOpen && (
          <View style={styles.actionsContainer}>
            {actions.map((action, index) => (
              <AnimatedButton
                key={action.id}
                onPress={() => handleActionPress(action)}
                style={{ ...styles.actionButton, bottom: 80 + index * 60 }}
              >
                <LinearGradient
                  colors={[Colors.primary, Colors.ghoulRed]}
                  style={styles.actionGradient}
                >
                  <Text style={styles.actionIcon}>{action.icon}</Text>
                </LinearGradient>
                <Text style={styles.actionLabel}>{action.label}</Text>
              </AnimatedButton>
            ))}
          </View>
        )}

        <AnimatedButton
          onPress={() => setIsOpen(!isOpen)}
          style={styles.mainButton}
        >
          <LinearGradient
            colors={[Colors.redGradientStart, Colors.redGradientEnd]}
            style={styles.mainGradient}
          >
            <Text style={styles.mainIcon}>{isOpen ? '✕' : '+'}</Text>
          </LinearGradient>
        </AnimatedButton>
      </View>

      {isOpen && (
        <TouchableOpacity
          style={styles.overlay}
          onPress={() => setIsOpen(false)}
          activeOpacity={1}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    zIndex: 1000,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 999,
  },
  actionsContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  actionButton: {
    position: 'absolute',
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    minWidth: 120,
    shadowColor: Colors.ghoulBlack,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  actionGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  actionIcon: {
    fontSize: 18,
    color: Colors.text,
  },
  actionLabel: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
  },
  mainButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: Colors.ghoulBlack,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  mainGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainIcon: {
    fontSize: 24,
    color: Colors.text,
    fontWeight: 'bold',
  },
});
