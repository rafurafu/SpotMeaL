// src/contexts/FavoritesContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Store } from './StoreContext';

const FAVORITES_STORAGE_KEY = '@spotmeal_favorites';

interface FavoritesContextType {
  favorites: string[]; // Store IDs
  loading: boolean;
  isFavorite: (storeId: string) => boolean;
  addFavorite: (storeId: string) => Promise<void>;
  removeFavorite: (storeId: string) => Promise<void>;
  toggleFavorite: (storeId: string) => Promise<void>;
  getFavoriteStores: (allStores: Store[]) => Store[];
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // AsyncStorageからお気に入りを読み込み
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const stored = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
        if (stored) {
          const parsedFavorites = JSON.parse(stored);
          setFavorites(parsedFavorites);
        }
      } catch (error) {
        console.error('Failed to load favorites:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, []);

  // お気に入りをAsyncStorageに保存
  const saveFavorites = async (newFavorites: string[]) => {
    try {
      await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(newFavorites));
      setFavorites(newFavorites);
    } catch (error) {
      console.error('Failed to save favorites:', error);
      throw error;
    }
  };

  // 店舗がお気に入りかチェック
  const isFavorite = (storeId: string): boolean => {
    return favorites.includes(storeId);
  };

  // お気に入りに追加
  const addFavorite = async (storeId: string): Promise<void> => {
    if (!favorites.includes(storeId)) {
      const newFavorites = [...favorites, storeId];
      await saveFavorites(newFavorites);
    }
  };

  // お気に入りから削除
  const removeFavorite = async (storeId: string): Promise<void> => {
    const newFavorites = favorites.filter(id => id !== storeId);
    await saveFavorites(newFavorites);
  };

  // お気に入りのトグル
  const toggleFavorite = async (storeId: string): Promise<void> => {
    if (isFavorite(storeId)) {
      await removeFavorite(storeId);
    } else {
      await addFavorite(storeId);
    }
  };

  // お気に入り店舗のリストを取得
  const getFavoriteStores = (allStores: Store[]): Store[] => {
    return allStores.filter(store => favorites.includes(store.id));
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        loading,
        isFavorite,
        addFavorite,
        removeFavorite,
        toggleFavorite,
        getFavoriteStores,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};
