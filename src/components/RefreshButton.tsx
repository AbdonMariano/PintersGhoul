import React, { useRef } from 'react';
import { Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/Colors';
import AnimatedButton from './AnimatedButton';

interface RefreshButtonProps {
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export default function RefreshButton({ onRefresh, isRefreshing = false }: RefreshButtonProps) {
  const rotateValue = useRef(new Animated.Value(0)).current;

  const handleRefresh = () => {
    if (!isRefreshing) {
      // Start rotation animation
      Animated.loop(
        Animated.timing(rotateValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        { iterations: -1 }
      ).start();

      onRefresh();

      // Stop rotation after 2 seconds
      setTimeout(() => {
        Animated.timing(rotateValue, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start();
      }, 2000);
    }
  };

  const rotation = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <AnimatedButton
      onPress={handleRefresh}
      disabled={isRefreshing}
      style={styles.container}
    >
      <LinearGradient
        colors={[Colors.surface, Colors.background]}
        style={styles.gradient}
      >
        <Animated.Text
          style={[
            styles.icon,
            { transform: [{ rotate: rotation }] }
          ]}
        >
          {isRefreshing ? '⟳' : '↻'}
        </Animated.Text>
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
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 18,
    color: Colors.text,
    fontWeight: 'bold',
  },
});
