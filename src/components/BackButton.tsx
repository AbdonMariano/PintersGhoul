import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/Colors';
import AnimatedButton from './AnimatedButton';

interface BackButtonProps {
  onPress: () => void;
  title?: string;
  showTitle?: boolean;
}

export default function BackButton({ onPress, title = 'Atrás', showTitle = false }: BackButtonProps) {
  return (
    <AnimatedButton
      onPress={onPress}
      style={styles.container}
    >
      <LinearGradient
        colors={[Colors.surface, Colors.background]}
        style={styles.gradient}
      >
        <Text style={styles.backIcon}>←</Text>
        {showTitle && <Text style={styles.title}>{title}</Text>}
      </LinearGradient>
    </AnimatedButton>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    minWidth: 50,
  },
  backIcon: {
    fontSize: 18,
    color: Colors.text,
    fontWeight: 'bold',
    marginRight: 5,
  },
  title: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '500',
  },
});
