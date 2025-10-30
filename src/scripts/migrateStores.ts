/**
 * 既存の店舗データをFirestoreに移行するスクリプト
 *
 * 使用方法:
 * アプリの初回起動時や、開発画面から手動で実行
 */

import { createRestaurant, FirestoreRestaurant } from '../services/restaurantService';

/**
 * 初期店舗データ（StoreContextからの移行用）
 * 注意: 画像はFirebase Storageにアップロード後、URLを設定する必要があります
 */
const initialRestaurantsData = [
  {
    name: '和食処 さくら',
    category: '和食',
    imageUrl: 'https://via.placeholder.com/400x300/FF6B35/FFFFFF?text=和食処+さくら',
    description: 'こだわりの食材を使った季節の和食をお楽しみください。落ち着いた雰囲気の店内でゆっくりとお食事をどうぞ。',
    address: '東京都渋谷区神宮前1-2-3',
    rating: 4.5,
    distance: 0.3,
    currentReward: 100,
    isAvailable: true,
    freePostsRemaining: 2,
    latitude: 35.6705,
    longitude: 139.7026,
  },
  {
    name: 'ラーメン横丁',
    category: 'ラーメン',
    imageUrl: 'https://via.placeholder.com/400x300/FF6B35/FFFFFF?text=ラーメン横丁',
    description: '濃厚豚骨スープが自慢のラーメン店。深夜まで営業しているので、遅い時間でもお楽しみいただけます。',
    address: '東京都新宿区歌舞伎町2-1-5',
    rating: 4.2,
    distance: 0.8,
    currentReward: 100,
    isAvailable: true,
    freePostsRemaining: 1,
    latitude: 35.6945,
    longitude: 139.7038,
  },
  {
    name: '寿司 一心',
    category: '寿司',
    imageUrl: 'https://via.placeholder.com/400x300/FF6B35/FFFFFF?text=寿司+一心',
    description: '新鮮な魚介を使った本格江戸前寿司。職人の技が光る逸品をカウンターでお楽しみください。',
    address: '東京都中央区銀座4-5-6',
    rating: 4.8,
    distance: 1.2,
    currentReward: 100,
    isAvailable: true,
    freePostsRemaining: 3,
    latitude: 35.6719,
    longitude: 139.7648,
  },
  {
    name: 'カフェ・ド・パリ',
    category: 'カフェ',
    imageUrl: 'https://via.placeholder.com/400x300/FF6B35/FFFFFF?text=カフェ・ド・パリ',
    description: 'パリの街角にあるような雰囲気のカフェ。こだわりのコーヒーと手作りスイーツをご提供。',
    address: '東京都港区表参道3-4-7',
    rating: 4.3,
    distance: 0.5,
    currentReward: 100,
    isAvailable: true,
    freePostsRemaining: 0,
    latitude: 35.6654,
    longitude: 139.7127,
  },
];

/**
 * 初期店舗データをFirestoreに移行
 */
export const migrateInitialStores = async (): Promise<void> => {
  try {
    console.log('Starting migration of initial stores to Firestore...');

    const results = await Promise.allSettled(
      initialRestaurantsData.map(async (storeData) => {
        try {
          const id = await createRestaurant(storeData);
          console.log(`Migrated: ${storeData.name} (ID: ${id})`);
          return { success: true, name: storeData.name, id };
        } catch (error) {
          console.error(`Failed to migrate: ${storeData.name}`, error);
          return { success: false, name: storeData.name, error };
        }
      })
    );

    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    console.log(`Migration completed: ${successful} successful, ${failed} failed`);
  } catch (error) {
    console.error('Migration error:', error);
    throw new Error('店舗データの移行に失敗しました');
  }
};

/**
 * 移行が必要かチェック（Firestoreに店舗が存在するかチェック）
 */
export const shouldMigrate = async (): Promise<boolean> => {
  try {
    const { getAllRestaurants } = await import('../services/restaurantService');
    const restaurants = await getAllRestaurants();
    return restaurants.length === 0;
  } catch (error) {
    console.error('Error checking if migration needed:', error);
    return false;
  }
};
