import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthService } from './src/services/AuthService';
import LoginScreen from './src/components/LoginScreen';
import RegisterScreen from './src/components/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import TodayScreen from './src/screens/TodayScreen';
import FollowingScreen from './src/screens/FollowingScreen';
import SearchScreen from './src/screens/SearchScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SavedPinsScreen from './src/screens/SavedPinsScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import BoardsScreen from './src/screens/BoardsScreen';
import LinksScreen from './src/screens/LinksScreen';
import MessagesScreen from './src/screens/MessagesScreen';
import AdvancedNotificationsScreen from './src/screens/AdvancedNotificationsScreen';
import UploadScreen from './src/components/UploadScreen';

type Screen = 'login' | 'register' | 'home' | 'today' | 'following' | 'search' | 'profile' | 'saved' | 'notifications' | 'settings' | 'boards' | 'links' | 'messages' | 'advanced-notifications' | 'upload';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  // Verificar si hay sesión activa al iniciar
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { isAuthenticated } = await AuthService.checkSession();
        if (isAuthenticated) {
          setCurrentScreen('home');
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setIsCheckingSession(false);
      }
    };

    checkSession();
  }, []);

  const handleLogin = () => {
    setCurrentScreen('home');
  };

  const handleRegister = (userData: any) => {
    // In a real app, you would save user data here
    console.log('User registered:', userData);
    setCurrentScreen('home');
  };

  const handleShowRegister = () => {
    setCurrentScreen('register');
  };

  const handleBackToLogin = () => {
    setCurrentScreen('login');
  };

  const handleUpload = () => {
    setCurrentScreen('upload');
  };

  const handleUploadComplete = (imageUri: string, title: string, description: string) => {
    // El pin se guarda directamente en HomeScreen a través de su propio estado
    // No necesitamos manejar esto aquí
    setCurrentScreen('home');
  };

  const handleCancelUpload = () => {
    setCurrentScreen('home');
  };

  const handleTabPress = (tab: string) => {
    switch (tab) {
      case 'home':
        setCurrentScreen('home');
        break;
      case 'today':
        setCurrentScreen('today');
        break;
      case 'following':
        setCurrentScreen('following');
        break;
      case 'search':
        setCurrentScreen('search');
        break;
      case 'upload':
        setCurrentScreen('upload');
        break;
      case 'saved':
        setCurrentScreen('saved');
        break;
      case 'notifications':
        setCurrentScreen('notifications');
        break;
      case 'profile':
        setCurrentScreen('profile');
        break;
      case 'logout':
        // Manejar cierre de sesión
        setCurrentScreen('login');
        break;
      default:
        break;
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'login':
        return <LoginScreen onLogin={handleLogin} onRegister={handleShowRegister} />;
      case 'register':
        return <RegisterScreen onRegister={handleRegister} onBackToLogin={handleBackToLogin} />;
      case 'home':
        return <HomeScreen onUpload={handleUpload} onTabPress={handleTabPress} />;
      case 'today':
        return <TodayScreen onBack={() => setCurrentScreen('home')} />;
      case 'following':
        return <FollowingScreen onBack={() => setCurrentScreen('home')} />;
      case 'search':
        return <SearchScreen onBack={() => setCurrentScreen('home')} />;
      case 'profile':
        return <ProfileScreen onTabPress={handleTabPress} />;
      case 'saved':
        return <SavedPinsScreen onBack={() => setCurrentScreen('home')} />;
      case 'notifications':
        return <NotificationsScreen onBack={() => setCurrentScreen('home')} onTabPress={handleTabPress} />;
      case 'settings':
        return <SettingsScreen onBack={() => setCurrentScreen('profile')} />;
      case 'boards':
        return <BoardsScreen onBack={() => setCurrentScreen('profile')} />;
      case 'links':
        return <LinksScreen onBack={() => setCurrentScreen('home')} />;
      case 'messages':
        return <MessagesScreen onBack={() => setCurrentScreen('home')} />;
      case 'advanced-notifications':
        return <AdvancedNotificationsScreen onBack={() => setCurrentScreen('notifications')} />;
      case 'upload':
        return (
          <UploadScreen
            onUpload={handleUploadComplete}
            onCancel={handleCancelUpload}
          />
        );
      default:
        return <LoginScreen onLogin={handleLogin} />;
    }
  };

  return (
    <SafeAreaProvider>
      <StatusBar style="light" backgroundColor="#1A202C" />
      {isCheckingSession ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E53E3E" />
        </View>
      ) : (
        renderScreen()
      )}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A202C',
  },
});
