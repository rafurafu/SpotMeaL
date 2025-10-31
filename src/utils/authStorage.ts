import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthUser } from '../types/auth';

const AUTH_USER_KEY = '@spotmeal:auth_user';

/**
 * AsyncStorageにユーザー情報を保存
 */
export const saveAuthUser = async (user: AuthUser): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(user);
    await AsyncStorage.setItem(AUTH_USER_KEY, jsonValue);
  } catch (error) {
    console.error('Error saving auth user:', error);
    throw error;
  }
};

/**
 * AsyncStorageからユーザー情報を取得
 */
export const loadAuthUser = async (): Promise<AuthUser | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(AUTH_USER_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error loading auth user:', error);
    return null;
  }
};

/**
 * AsyncStorageからユーザー情報を削除
 */
export const removeAuthUser = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(AUTH_USER_KEY);
  } catch (error) {
    console.error('Error removing auth user:', error);
    throw error;
  }
};
