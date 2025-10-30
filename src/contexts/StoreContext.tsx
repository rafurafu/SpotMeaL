// src/contexts/StoreContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  getAllRestaurants,
  createRestaurant,
  updateRestaurant as updateRestaurantFirestore,
  deleteRestaurant,
  getCurrentReward as getReward,
  FirestoreRestaurant,
} from '../services/restaurantService';
import { migrateInitialStores, shouldMigrate } from '../scripts/migrateStores';

interface Store {
  id: string;
  name: string;
  category: string;
  image: any;
  description: string;
  address: string;
  rating: number;
  distance: number;
  currentReward: number;
  isAvailable: boolean;
  freePostsRemaining: number;
}

interface StoreContextType {
  stores: Store[];
  loading: boolean;
  addStore: (store: Omit<Store, 'id'>) => Promise<void>;
  updateStore: (id: string, store: Partial<Store>) => Promise<void>;
  deleteStore: (id: string) => Promise<void>;
  refreshStores: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const useStoreContext = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStoreContext must be used within a StoreProvider');
  }
  return context;
};

interface StoreProviderProps {
  children: ReactNode;
}

/**
 * FirestoreRestaurantをStore型に変換
 * 画像URLからimageオブジェクトに変換（プレースホルダー）
 */
const convertFirestoreToStore = (restaurant: FirestoreRestaurant): Store => {
  return {
    id: restaurant.id,
    name: restaurant.name,
    category: restaurant.category,
    image: { uri: restaurant.imageUrl }, // URLをimageオブジェクトに変換
    description: restaurant.description,
    address: restaurant.address,
    rating: restaurant.rating,
    distance: restaurant.distance,
    currentReward: restaurant.currentReward,
    isAvailable: restaurant.isAvailable,
    freePostsRemaining: restaurant.freePostsRemaining,
  };
};

export const StoreProvider: React.FC<StoreProviderProps> = ({ children }) => {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  /**
   * Firestoreから店舗データを取得
   */
  const loadStoresFromFirestore = async () => {
    try {
      setLoading(true);
      const restaurants = await getAllRestaurants();
      const convertedStores = restaurants.map(convertFirestoreToStore);
      setStores(convertedStores);
      console.log(`Loaded ${convertedStores.length} stores from Firestore`);
    } catch (error) {
      console.error('Failed to load stores from Firestore:', error);
      // エラー時は空配列を設定
      setStores([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 初回ロード時に実行
   * - Firestoreにデータがない場合は自動移行
   * - データがある場合は取得のみ
   */
  useEffect(() => {
    const initializeStores = async () => {
      try {
        const needsMigration = await shouldMigrate();
        if (needsMigration) {
          console.log('No stores in Firestore. Running migration...');
          await migrateInitialStores();
        }
        await loadStoresFromFirestore();
      } catch (error) {
        console.error('Failed to initialize stores:', error);
        setLoading(false);
      }
    };

    initializeStores();
  }, []);

  /**
   * 店舗を追加（Firestoreに保存）
   */
  const addStore = async (storeData: Omit<Store, 'id'>): Promise<void> => {
    try {
      const reward = getReward();

      // 画像をURL形式に変換（ローカル画像の場合はプレースホルダー）
      let imageUrl = 'https://via.placeholder.com/400x300/FF6B35/FFFFFF?text=店舗画像';
      if (typeof storeData.image === 'string') {
        imageUrl = storeData.image;
      } else if (storeData.image?.uri) {
        imageUrl = storeData.image.uri;
      }

      const firestoreData = {
        name: storeData.name,
        category: storeData.category,
        imageUrl,
        description: storeData.description,
        address: storeData.address,
        rating: storeData.rating || 4.0,
        distance: storeData.distance || Math.round((Math.random() * 2 + 0.1) * 10) / 10,
        currentReward: reward.amount,
        isAvailable: storeData.isAvailable ?? true,
        freePostsRemaining: storeData.freePostsRemaining ?? Math.floor(Math.random() * 4),
      };

      await createRestaurant(firestoreData);
      await loadStoresFromFirestore(); // リロード
      console.log('Store added successfully');
    } catch (error) {
      console.error('Failed to add store:', error);
      throw error;
    }
  };

  /**
   * 店舗を更新（Firestoreに保存）
   */
  const updateStore = async (id: string, storeData: Partial<Store>): Promise<void> => {
    try {
      // image以外のフィールドのみ更新
      const { image, ...updateData } = storeData;

      // imageが更新される場合はURL形式に変換
      let imageUrl: string | undefined;
      if (image) {
        if (typeof image === 'string') {
          imageUrl = image;
        } else if (image?.uri) {
          imageUrl = image.uri;
        }
      }

      await updateRestaurantFirestore(id, {
        ...updateData,
        ...(imageUrl && { imageUrl }),
      });

      await loadStoresFromFirestore(); // リロード
      console.log('Store updated successfully');
    } catch (error) {
      console.error('Failed to update store:', error);
      throw error;
    }
  };

  /**
   * 店舗を削除（Firestoreから削除）
   */
  const deleteStore = async (id: string): Promise<void> => {
    try {
      await deleteRestaurant(id);
      await loadStoresFromFirestore(); // リロード
      console.log('Store deleted successfully');
    } catch (error) {
      console.error('Failed to delete store:', error);
      throw error;
    }
  };

  /**
   * 店舗リストを再読み込み
   */
  const refreshStores = async (): Promise<void> => {
    await loadStoresFromFirestore();
  };

  return (
    <StoreContext.Provider
      value={{
        stores,
        loading,
        addStore,
        updateStore,
        deleteStore,
        refreshStores,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export type { Store };