import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/Colors';

interface SettingsMenuModalProps {
  visible: boolean;
  onClose: () => void;
  onLogout: () => void;
  onSwitchAccount: () => void;
  onSupport: () => void;
  userName?: string;
}

export default function SettingsMenuModal({
  visible,
  onClose,
  onLogout,
  onSwitchAccount,
  onSupport,
  userName = 'Usuario',
}: SettingsMenuModalProps) {
  const handleLogout = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar sesión',
          style: 'destructive',
          onPress: () => {
            onClose();
            onLogout();
          },
        },
      ]
    );
  };

  const handleSwitchAccount = () => {
    Alert.alert(
      'Cambiar de cuenta',
      '¿Deseas cambiar a otra cuenta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cambiar',
          onPress: () => {
            onClose();
            onSwitchAccount();
          },
        },
      ]
    );
  };

  const handleSupport = () => {
    onClose();
    onSupport();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.container}>
          <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
            <LinearGradient
              colors={[Colors.surface, Colors.background]}
              style={styles.menu}
            >
              {/* Header */}
              <View style={styles.header}>
                <View style={styles.userInfo}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>👤</Text>
                  </View>
                  <View>
                    <Text style={styles.userName}>{userName}</Text>
                    <Text style={styles.userEmail}>Configuración</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>

              {/* Divider */}
              <View style={styles.divider} />

              {/* Menu Options */}
              <View style={styles.menuOptions}>
                {/* Cambiar de cuenta */}
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={handleSwitchAccount}
                >
                  <View style={styles.menuItemIcon}>
                    <Text style={styles.iconText}>🔄</Text>
                  </View>
                  <View style={styles.menuItemContent}>
                    <Text style={styles.menuItemTitle}>Cambiar de cuenta</Text>
                    <Text style={styles.menuItemDescription}>
                      Inicia sesión con otra cuenta
                    </Text>
                  </View>
                  <Text style={styles.menuItemArrow}>›</Text>
                </TouchableOpacity>

                {/* Soporte */}
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={handleSupport}
                >
                  <View style={styles.menuItemIcon}>
                    <Text style={styles.iconText}>💬</Text>
                  </View>
                  <View style={styles.menuItemContent}>
                    <Text style={styles.menuItemTitle}>Soporte</Text>
                    <Text style={styles.menuItemDescription}>
                      Ayuda y contacto
                    </Text>
                  </View>
                  <Text style={styles.menuItemArrow}>›</Text>
                </TouchableOpacity>

                {/* Divider */}
                <View style={styles.divider} />

                {/* Cerrar sesión */}
                <TouchableOpacity
                  style={[styles.menuItem, styles.logoutItem]}
                  onPress={handleLogout}
                >
                  <View style={styles.menuItemIcon}>
                    <Text style={styles.iconText}>🚪</Text>
                  </View>
                  <View style={styles.menuItemContent}>
                    <Text style={[styles.menuItemTitle, styles.logoutText]}>
                      Cerrar sesión
                    </Text>
                    <Text style={styles.menuItemDescription}>
                      Salir de tu cuenta
                    </Text>
                  </View>
                  <Text style={styles.menuItemArrow}>›</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '85%',
    maxWidth: 400,
  },
  menu: {
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 24,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: Colors.text,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 15,
  },
  menuOptions: {
    gap: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  logoutItem: {
    marginTop: 5,
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 20,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  menuItemDescription: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  menuItemArrow: {
    fontSize: 24,
    color: Colors.textSecondary,
    marginLeft: 8,
  },
  logoutText: {
    color: Colors.ghoulRed,
  },
});
