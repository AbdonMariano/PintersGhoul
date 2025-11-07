// Authentication Service for PinteresGhoul app with persistence
import { StorageService, UserSession } from './StorageService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  id: string;
  username: string;
  email?: string;
  displayName: string;
  bio?: string;
  avatar: string;
  createdAt: string;
  isVerified: boolean;
  followers: number;
  following: number;
  pins: number;
  boards: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  username: string;
  email?: string;
  password: string;
  displayName: string;
  bio?: string;
}

export class AuthService {
  private static currentUser: User | null = null;
  private static readonly USERS_STORAGE_KEY = '@PinteresGhoul:registeredUsers';
  
  // Usuarios demo (para desarrollo)
  private static demoUsers: User[] = [
    {
      id: 'user1',
      username: 'ghoul_master',
      email: 'alex18abdon@gmail.com',
      displayName: 'Alex Ghoul Master',
      bio: 'Fanático de Tokyo Ghoul desde el primer día',
      avatar: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop',
      createdAt: new Date().toISOString(),
      isVerified: true,
      followers: 1234,
      following: 567,
      pins: 89,
      boards: 12,
    }
  ];

  // Cargar usuarios registrados desde AsyncStorage
  private static async loadRegisteredUsers(): Promise<User[]> {
    try {
      const usersData = await AsyncStorage.getItem(this.USERS_STORAGE_KEY);
      if (usersData) {
        return JSON.parse(usersData);
      }
      return [...this.demoUsers];
    } catch (error) {
      console.error('Error loading users:', error);
      return [...this.demoUsers];
    }
  }

  // Guardar usuarios registrados
  private static async saveRegisteredUsers(users: User[]): Promise<void> {
    try {
      await AsyncStorage.setItem(this.USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (error) {
      console.error('Error saving users:', error);
    }
  }

  // Verificar si hay sesión activa
  static async checkSession(): Promise<{ isAuthenticated: boolean; user?: User }> {
    try {
      const session = await StorageService.getUserSession();
      if (session) {
        const users = await this.loadRegisteredUsers();
        const user = users.find(u => u.id === session.userId);
        if (user) {
          this.currentUser = user;
          return { isAuthenticated: true, user };
        }
      }
      return { isAuthenticated: false };
    } catch (error) {
      console.error('Error checking session:', error);
      return { isAuthenticated: false };
    }
  }

  static async login(credentials: LoginCredentials): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 800));

      const users = await this.loadRegisteredUsers();
      const user = users.find(u => 
        (u.email && u.email.toLowerCase() === credentials.email.toLowerCase()) || 
        u.username.toLowerCase() === credentials.email.toLowerCase()
      );

      if (!user) {
        return { success: false, error: 'Usuario no encontrado. Verifica tus credenciales.' };
      }

      // En producción, aquí verificarías el hash de la contraseña
      if (credentials.password.length < 6) {
        return { success: false, error: 'Contraseña incorrecta' };
      }

      this.currentUser = user;

      // Guardar sesión
      const session: UserSession = {
        userId: user.id,
        username: user.username,
        email: user.email,
        displayName: user.displayName,
        avatar: user.avatar,
        lastLogin: new Date().toISOString(),
      };
      await StorageService.saveUserSession(session);

      // Guardar email si "recordarme" está activado
      if (credentials.rememberMe) {
        await StorageService.saveCredentials(credentials.email, true);
      }

      return { success: true, user };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Error de conexión. Inténtalo de nuevo.' };
    }
  }

  static async register(userData: RegisterData): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 1000));

      const users = await this.loadRegisteredUsers();

      // Verificar si el usuario ya existe
      const existingUser = users.find(u => 
        u.username.toLowerCase() === userData.username.toLowerCase() ||
        (userData.email && u.email && u.email.toLowerCase() === userData.email.toLowerCase())
      );

      if (existingUser) {
        return { 
          success: false, 
          error: existingUser.username.toLowerCase() === userData.username.toLowerCase() 
            ? 'Este nombre de usuario ya está en uso' 
            : 'Este email ya está registrado'
        };
      }

      // Crear nuevo usuario
      const newUser: User = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        username: userData.username,
        email: userData.email,
        displayName: userData.displayName,
        bio: userData.bio || '',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.displayName)}&size=200&background=E53E3E&color=fff`,
        createdAt: new Date().toISOString(),
        isVerified: false,
        followers: 0,
        following: 0,
        pins: 0,
        boards: 0,
      };

      // Guardar nuevo usuario
      users.push(newUser);
      await this.saveRegisteredUsers(users);

      this.currentUser = newUser;

      // Crear sesión automáticamente
      const session: UserSession = {
        userId: newUser.id,
        username: newUser.username,
        email: newUser.email,
        displayName: newUser.displayName,
        avatar: newUser.avatar,
        lastLogin: new Date().toISOString(),
      };
      await StorageService.saveUserSession(session);

      return { success: true, user: newUser };
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, error: 'Error al crear la cuenta. Inténtalo de nuevo.' };
    }
  }

  static async logout(): Promise<void> {
    this.currentUser = null;
    await StorageService.clearSession();
  }

  static getCurrentUser(): User | null {
    return this.currentUser;
  }

  static isLoggedIn(): boolean {
    return this.currentUser !== null;
  }

  static async updateProfile(updates: Partial<User> | User): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      if (!this.currentUser) {
        return { success: false, error: 'Usuario no autenticado' };
      }

      const users = await this.loadRegisteredUsers();
      const userIndex = users.findIndex(u => u.id === this.currentUser!.id);

      if (userIndex === -1) {
        return { success: false, error: 'Usuario no encontrado' };
      }

      // Actualizar usuario
      const updatedUser = { ...users[userIndex], ...updates };
      users[userIndex] = updatedUser;
      
      await this.saveRegisteredUsers(users);
      this.currentUser = updatedUser;

      // Actualizar sesión
      const session = await StorageService.getUserSession();
      if (session) {
        await StorageService.saveUserSession({
          ...session,
          username: updatedUser.username,
          email: updatedUser.email,
          displayName: updatedUser.displayName,
          bio: updatedUser.bio,
          avatar: updatedUser.avatar,
        });
      }

      return { success: true, user: updatedUser };
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, error: 'Error al actualizar perfil' };
    }
  }

  static async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
    try {
      if (!this.currentUser) {
        return { success: false, error: 'Usuario no autenticado' };
      }

      // Simular verificación de contraseña
      await new Promise(resolve => setTimeout(resolve, 800));

      if (currentPassword.length < 6) {
        return { success: false, error: 'Contraseña actual incorrecta' };
      }

      if (newPassword.length < 6) {
        return { success: false, error: 'La nueva contraseña debe tener al menos 6 caracteres' };
      }

      // En producción, aquí hashearías y guardarías la nueva contraseña
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Error al cambiar la contraseña' };
    }
  }

  static async deleteAccount(): Promise<{ success: boolean; error?: string }> {
    try {
      if (!this.currentUser) {
        return { success: false, error: 'Usuario no autenticado' };
      }

      const users = await this.loadRegisteredUsers();
      const filteredUsers = users.filter(u => u.id !== this.currentUser!.id);
      
      await this.saveRegisteredUsers(filteredUsers);
      await StorageService.clearAllData();
      
      this.currentUser = null;

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Error al eliminar la cuenta' };
    }
  }

  static async forgotPassword(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const users = await this.loadRegisteredUsers();
      const user = users.find(u => u.email === email);
      if (!user) {
        return { success: false, error: 'Email no encontrado' };
      }

      // En producción, enviarías un email de recuperación
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Error al enviar el email de recuperación' };
    }
  }

  static async verifyEmail(token: string): Promise<{ success: boolean; error?: string }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (!this.currentUser) {
        return { success: false, error: 'Usuario no autenticado' };
      }

      if (token.length < 10) {
        return { success: false, error: 'Token inválido' };
      }

      const users = await this.loadRegisteredUsers();
      const userIndex = users.findIndex(u => u.id === this.currentUser!.id);
      
      if (userIndex !== -1) {
        const updatedUser = { ...users[userIndex], isVerified: true };
        users[userIndex] = updatedUser;
        await this.saveRegisteredUsers(users);
        this.currentUser = updatedUser;
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Error al verificar el email' };
    }
  }

  static async searchUsers(query: string): Promise<User[]> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const users = await this.loadRegisteredUsers();
      const normalizedQuery = query.toLowerCase();
      return users.filter(user =>
        user.username.toLowerCase().includes(normalizedQuery) ||
        user.displayName.toLowerCase().includes(normalizedQuery) ||
        (user.bio && user.bio.toLowerCase().includes(normalizedQuery))
      );
    } catch (error) {
      return [];
    }
  }

  static async getUserById(userId: string): Promise<User | null> {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      const users = await this.loadRegisteredUsers();
      return users.find(u => u.id === userId) || null;
    } catch (error) {
      return null;
    }
  }

  static async getAuthStats(): Promise<{
    totalUsers: number;
    verifiedUsers: number;
    newUsersToday: number;
  }> {
    const users = await this.loadRegisteredUsers();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const newUsersToday = users.filter(user => {
      const userDate = new Date(user.createdAt);
      userDate.setHours(0, 0, 0, 0);
      return userDate.getTime() === today.getTime();
    }).length;

    return {
      totalUsers: users.length,
      verifiedUsers: users.filter(u => u.isVerified).length,
      newUsersToday,
    };
  }
}
