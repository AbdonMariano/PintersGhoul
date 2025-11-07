
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function TodayScreen({ onBack }: { onBack?: () => void }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backText}>← Volver</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Ideas destacadas de hoy</Text>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tendencias</Text>
        <Text style={styles.sectionItem}>• Kaneki Ken: Arte y fanarts</Text>
        <Text style={styles.sectionItem}>• Uñas Tokyo Ghoul: Inspiración oscura</Text>
        <Text style={styles.sectionItem}>• Wallpapers rojos y negros</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Inspiración diaria</Text>
        <Text style={styles.sectionItem}>• Frase: "Incluso en la oscuridad, hay belleza"</Text>
        <Text style={styles.sectionItem}>• Imagen destacada: Kaneki en la lluvia</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#18181b',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: '#b71c1c',
    borderRadius: 20,
    padding: 8,
    zIndex: 10,
  },
  backText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  title: {
    color: '#b71c1c',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 60,
  },
  section: {
    marginTop: 24,
    backgroundColor: '#232326',
    borderRadius: 16,
    padding: 16,
    width: '80%',
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#b71c1c',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
  },
  sectionItem: {
    color: '#fff',
    fontSize: 15,
    marginBottom: 4,
  },
});

