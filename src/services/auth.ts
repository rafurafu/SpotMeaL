import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthUser, LoginCredentials, SignUpCredentials, AuthResponse } from '../types/auth';

const API_BASE_URL = 'https://api.spotmeal.com';
const TOKEN_KEY = 'auth_token';

export class AuthService {
  private static token: string | null = null;

  static async getToken(): Promise<string | null> {
    if (!this.token) {
      this.token = await AsyncStorage.getItem(TOKEN_KEY);
    }
    return this.token;
  }

  static async setToken(token: string): Promise<void> {
    this.token = token;
    await AsyncStorage.setItem(TOKEN_KEY, token);
  }

  static async removeToken(): Promise<void> {
    this.token = null;
    await AsyncStorage.removeItem(TOKEN_KEY);
  }

  static async signUp(credentials: SignUpCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'サインアップに失敗しました');
      }

      const data: AuthResponse = await response.json();
      await this.setToken(data.token);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('サインアップに失敗しました');
    }
  }

  static async signIn(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'ログインに失敗しました');
      }

      const data: AuthResponse = await response.json();
      await this.setToken(data.token);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('ログインに失敗しました');
    }
  }

  static async signOut(): Promise<void> {
    try {
      const token = await this.getToken();
      if (token) {
        await fetch(`${API_BASE_URL}/auth/signout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      await this.removeToken();
    }
  }

  static async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const token = await this.getToken();
      if (!token) return null;

      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        await this.removeToken();
        return null;
      }

      const user: AuthUser = await response.json();
      return user;
    } catch (error) {
      console.error('Get current user error:', error);
      await this.removeToken();
      return null;
    }
  }

  static async signInWithGoogle(): Promise<AuthResponse> {
    try {
      const { GoogleAuthService } = await import('./googleAuth');
      const user = await GoogleAuthService.signInWithGoogle();
      
      const response = await fetch(`${API_BASE_URL}/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          googleUser: user,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Googleログインに失敗しました');
      }

      const data: AuthResponse = await response.json();
      await this.setToken(data.token);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Googleログインに失敗しました');
    }
  }
}