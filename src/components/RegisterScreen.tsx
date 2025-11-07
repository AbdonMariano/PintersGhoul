import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/Colors';
import AnimatedButton from './AnimatedButton';
import { AuthService, User } from '../services/AuthService';

interface RegisterScreenProps {
  onRegister: (user: User) => void;
  onBackToLogin: () => void;
}

interface UserData {
  username: string;
  email?: string;
  password: string;
  displayName: string;
  bio?: string;
  avatar?: string;
}

export default function RegisterScreen({ onRegister, onBackToLogin }: RegisterScreenProps) {
  const [formData, setFormData] = useState<UserData>({
    username: '',
    email: '',
    password: '',
    displayName: '',
    bio: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showEmailField, setShowEmailField] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleInputChange = (field: keyof UserData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.username.trim()) {
      Alert.alert('Error', 'El nombre de usuario es obligatorio');
      return false;
    }

    if (formData.username.length < 3) {
      Alert.alert('Error', 'El nombre de usuario debe tener al menos 3 caracteres');
      return false;
    }

    if (!formData.displayName.trim()) {
      Alert.alert('Error', 'El nombre completo es obligatorio');
      return false;
    }

    if (!formData.password.trim()) {
      Alert.alert('Error', 'La contraseña es obligatoria');
      return false;
    }

    if (formData.password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return false;
    }

    if (formData.password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return false;
    }

    if (showEmailField && formData.email && !isValidEmail(formData.email)) {
      Alert.alert('Error', 'Por favor ingresa un email válido');
      return false;
    }

    if (!agreedToTerms) {
      Alert.alert('Error', 'Debes aceptar los términos y condiciones');
      return false;
    }

    return true;
  };

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const result = await AuthService.register({
        username: formData.username,
        email: showEmailField && formData.email ? formData.email : undefined,
        password: formData.password,
        displayName: formData.displayName,
        bio: formData.bio,
      });

      if (result.success && result.user) {
        onRegister(result.user);
        Alert.alert('¡Éxito!', 'Cuenta creada correctamente. ¡Bienvenido a PinteresGhoul!');
      } else {
        Alert.alert('Error', result.error || 'No se pudo crear la cuenta');
      }
    } catch (error) {
      Alert.alert('Error', 'Error de conexión. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleEmail = () => {
    setShowEmailField(!showEmailField);
    if (!showEmailField) {
      setFormData(prev => ({ ...prev, email: '' }));
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={[Colors.gradientStart, Colors.gradientEnd]}
        style={styles.gradient}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>PinteresGhoul</Text>
            <Text style={styles.subtitle}>Únete a la comunidad Tokyo Ghoul</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nombre de usuario *</Text>
              <TextInput
                style={styles.input}
                placeholder="ghoul_user"
                placeholderTextColor={Colors.textMuted}
                value={formData.username}
                onChangeText={(value) => handleInputChange('username', value)}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nombre completo *</Text>
              <TextInput
                style={styles.input}
                placeholder="Tu nombre completo"
                placeholderTextColor={Colors.textMuted}
                value={formData.displayName}
                onChangeText={(value) => handleInputChange('displayName', value)}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Contraseña *</Text>
              <TextInput
                style={styles.input}
                placeholder="Mínimo 6 caracteres"
                placeholderTextColor={Colors.textMuted}
                value={formData.password}
                onChangeText={(value) => handleInputChange('password', value)}
                secureTextEntry
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirmar contraseña *</Text>
              <TextInput
                style={styles.input}
                placeholder="Repite tu contraseña"
                placeholderTextColor={Colors.textMuted}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </View>

            {showEmailField && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email (opcional)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="tu@email.com"
                  placeholderTextColor={Colors.textMuted}
                  value={formData.email}
                  onChangeText={(value) => handleInputChange('email', value)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Biografía (opcional)</Text>
              <TextInput
                style={[styles.input, styles.bioInput]}
                placeholder="Cuéntanos sobre ti..."
                placeholderTextColor={Colors.textMuted}
                value={formData.bio}
                onChangeText={(value) => handleInputChange('bio', value)}
                multiline
                numberOfLines={3}
              />
            </View>

            <TouchableOpacity 
              style={styles.emailToggle}
              onPress={handleToggleEmail}
            >
              <Text style={styles.emailToggleText}>
                {showEmailField ? '❌ Ocultar email' : '📧 Agregar email (opcional)'}
              </Text>
            </TouchableOpacity>

            <View style={styles.termsContainer}>
              <TouchableOpacity 
                style={styles.checkboxContainer}
                onPress={() => setAgreedToTerms(!agreedToTerms)}
              >
                <Text style={styles.checkbox}>
                  {agreedToTerms ? '☑️' : '☐'}
                </Text>
                <Text style={styles.termsText}>
                  Acepto los{' '}
                  <Text style={styles.termsLink}>términos y condiciones</Text>
                  {' '}y la{' '}
                  <Text style={styles.termsLink}>política de privacidad</Text>
                </Text>
              </TouchableOpacity>
            </View>

            <AnimatedButton
              onPress={handleRegister}
              disabled={isLoading}
              style={isLoading ? { ...styles.registerButton, ...styles.disabledButton } : styles.registerButton}
            >
              <LinearGradient
                colors={[Colors.redGradientStart, Colors.redGradientEnd]}
                style={styles.registerButtonGradient}
              >
                <Text style={styles.registerButtonText}>
                  {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
                </Text>
              </LinearGradient>
            </AnimatedButton>

            <TouchableOpacity 
              style={styles.loginLink}
              onPress={onBackToLogin}
            >
              <Text style={styles.loginLinkText}>
                ¿Ya tienes cuenta? <Text style={styles.loginLinkBold}>Inicia sesión</Text>
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Al registrarte, te unes a la comunidad más grande de fans de Tokyo Ghoul
            </Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: Colors.primary,
    textShadowColor: Colors.ghoulRed,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: 'rgba(45, 55, 72, 0.8)',
    borderRadius: 20,
    padding: 25,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  bioInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  emailToggle: {
    alignItems: 'center',
    marginBottom: 20,
  },
  emailToggleText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  termsContainer: {
    marginBottom: 25,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    fontSize: 18,
    marginRight: 10,
    marginTop: 2,
  },
  termsText: {
    flex: 1,
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  termsLink: {
    color: Colors.primary,
    textDecorationLine: 'underline',
  },
  registerButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
  },
  registerButtonGradient: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  registerButtonText: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: Colors.ghoulRed,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 5,
  },
  disabledButton: {
    opacity: 0.6,
  },
  loginLink: {
    alignItems: 'center',
  },
  loginLinkText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  loginLinkBold: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});
