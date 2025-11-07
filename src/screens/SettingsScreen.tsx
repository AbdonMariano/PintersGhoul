import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/Colors';

export default function SettingsScreen({ onBack }: { onBack: () => void }) {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [dataSaver, setDataSaver] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Cerrar Sesión', style: 'destructive', onPress: () => {} },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Eliminar Cuenta',
      'Esta acción no se puede deshacer. ¿Estás seguro?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => {} },
      ]
    );
  };

  const SettingItem = ({ 
    title, 
    subtitle, 
    onPress, 
    rightComponent, 
    icon 
  }: {
    title: string;
    subtitle?: string;
    onPress?: () => void;
    rightComponent?: React.ReactNode;
    icon: string;
  }) => (
    <TouchableOpacity 
      style={styles.settingItem} 
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingLeft}>
        <Text style={styles.settingIcon}>{icon}</Text>
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {rightComponent || (onPress && <Text style={styles.arrow}>›</Text>)}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.gradientStart, Colors.gradientEnd]}
        style={styles.gradient}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Configuración</Text>
          <View style={styles.placeholder} />
        </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cuenta</Text>
            <SettingItem
              title="Editar Perfil"
              subtitle="Cambiar información personal"
              icon="👤"
              onPress={() => Alert.alert('Editar Perfil', 'Funcionalidad en desarrollo')}
            />
            <SettingItem
              title="Privacidad"
              subtitle="Controlar quién puede ver tu contenido"
              icon="🔒"
              onPress={() => Alert.alert('Privacidad', 'Funcionalidad en desarrollo')}
            />
            <SettingItem
              title="Seguridad"
              subtitle="Contraseña y autenticación"
              icon="🛡️"
              onPress={() => Alert.alert('Seguridad', 'Funcionalidad en desarrollo')}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notificaciones</Text>
            <SettingItem
              title="Notificaciones Push"
              subtitle="Recibir notificaciones de la app"
              icon="🔔"
              rightComponent={
                <Switch
                  value={notifications}
                  onValueChange={setNotifications}
                  trackColor={{ false: Colors.border, true: Colors.primary }}
                  thumbColor={notifications ? Colors.text : Colors.textSecondary}
                />
              }
            />
            <SettingItem
              title="Likes y Comentarios"
              subtitle="Notificaciones de interacciones"
              icon="❤️"
              onPress={() => Alert.alert('Likes y Comentarios', 'Funcionalidad en desarrollo')}
            />
            <SettingItem
              title="Nuevos Seguidores"
              subtitle="Notificaciones de seguidores"
              icon="👥"
              onPress={() => Alert.alert('Nuevos Seguidores', 'Funcionalidad en desarrollo')}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Apariencia</Text>
            <SettingItem
              title="Modo Oscuro"
              subtitle="Tema oscuro de Tokyo Ghoul"
              icon="🌙"
              rightComponent={
                <Switch
                  value={darkMode}
                  onValueChange={setDarkMode}
                  trackColor={{ false: Colors.border, true: Colors.primary }}
                  thumbColor={darkMode ? Colors.text : Colors.textSecondary}
                />
              }
            />
            <SettingItem
              title="Idioma"
              subtitle="Español"
              icon="🌍"
              onPress={() => Alert.alert('Idioma', 'Funcionalidad en desarrollo')}
            />
            <SettingItem
              title="Tamaño de Texto"
              subtitle="Mediano"
              icon="🔤"
              onPress={() => Alert.alert('Tamaño de Texto', 'Funcionalidad en desarrollo')}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Almacenamiento</Text>
            <SettingItem
              title="Guardado Automático"
              subtitle="Guardar pins automáticamente"
              icon="💾"
              rightComponent={
                <Switch
                  value={autoSave}
                  onValueChange={setAutoSave}
                  trackColor={{ false: Colors.border, true: Colors.primary }}
                  thumbColor={autoSave ? Colors.text : Colors.textSecondary}
                />
              }
            />
            <SettingItem
              title="Ahorro de Datos"
              subtitle="Reducir uso de datos móviles"
              icon="📱"
              rightComponent={
                <Switch
                  value={dataSaver}
                  onValueChange={setDataSaver}
                  trackColor={{ false: Colors.border, true: Colors.primary }}
                  thumbColor={dataSaver ? Colors.text : Colors.textSecondary}
                />
              }
            />
            <SettingItem
              title="Limpiar Caché"
              subtitle="Liberar espacio de almacenamiento"
              icon="🗑️"
              onPress={() => Alert.alert('Caché Limpiado', 'Se ha liberado espacio de almacenamiento')}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Soporte</Text>
            <SettingItem
              title="Ayuda y Soporte"
              subtitle="Obtener ayuda"
              icon="❓"
              onPress={() => Alert.alert('Ayuda', 'Funcionalidad en desarrollo')}
            />
            <SettingItem
              title="Reportar Problema"
              subtitle="Enviar reporte de error"
              icon="🐛"
              onPress={() => Alert.alert('Reportar Problema', 'Funcionalidad en desarrollo')}
            />
            <SettingItem
              title="Acerca de"
              subtitle="PinteresGhoul v1.0.0"
              icon="ℹ️"
              onPress={() => Alert.alert('Acerca de', 'PinteresGhoul v1.0.0\nInspirado en Tokyo Ghoul')}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Peligro</Text>
            <SettingItem
              title="Cerrar Sesión"
              subtitle="Salir de tu cuenta"
              icon="🚪"
              onPress={handleLogout}
            />
            <SettingItem
              title="Eliminar Cuenta"
              subtitle="Eliminar permanentemente tu cuenta"
              icon="🗑️"
              onPress={handleDeleteAccount}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              PinteresGhoul - Inspirado en Tokyo Ghoul
            </Text>
            <Text style={styles.footerVersion}>
              Versión 1.0.0
            </Text>
          </View>
        </ScrollView>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    padding: 10,
  },
  backIcon: {
    fontSize: 24,
    color: Colors.text,
  },
  placeholder: {
    width: 44,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primary,
    textShadowColor: Colors.ghoulRed,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: Colors.surface,
    marginHorizontal: 20,
    marginBottom: 1,
    borderRadius: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    fontSize: 20,
    marginRight: 15,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '500',
  },
  settingSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  arrow: {
    fontSize: 20,
    color: Colors.textSecondary,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 5,
  },
  footerVersion: {
    fontSize: 12,
    color: Colors.textMuted,
  },
});
