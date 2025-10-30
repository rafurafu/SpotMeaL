import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Firestoreに保存する店舗情報の型
 */
export interface FirestoreRestaurant {
  id: string;
  name: string;
  category: string;
  imageUrl: string;                    // Firebase Storage URL
  description: string;
  address: string;
  rating: number;
  distance: number;
  currentReward: number;
  isAvailable: boolean;
  freePostsRemaining: number;
  // 追加情報
  ownerId?: string;                    // 店舗オーナーのユーザーID
  phone?: string;
  email?: string;
  latitude?: number;
  longitude?: number;
  createdAt: Timestamp | ReturnType<typeof serverTimestamp>;
  updatedAt: Timestamp | ReturnType<typeof serverTimestamp>;
}

/**
 * 全店舗を取得
 */
export const getAllRestaurants = async (): Promise<FirestoreRestaurant[]> => {
  try {
    const restaurantsRef = collection(db, 'restaurants');
    const q = query(restaurantsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    const restaurants: FirestoreRestaurant[] = [];
    snapshot.forEach((doc) => {
      restaurants.push(doc.data() as FirestoreRestaurant);
    });

    console.log(`Loaded ${restaurants.length} restaurants from Firestore`);
    return restaurants;
  } catch (error) {
    console.error('Error getting all restaurants:', error);
    throw new Error('店舗情報の取得に失敗しました');
  }
};

/**
 * カテゴリ別に店舗を取得
 */
export const getRestaurantsByCategory = async (category: string): Promise<FirestoreRestaurant[]> => {
  try {
    const restaurantsRef = collection(db, 'restaurants');
    const q = query(
      restaurantsRef,
      where('category', '==', category),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);

    const restaurants: FirestoreRestaurant[] = [];
    snapshot.forEach((doc) => {
      restaurants.push(doc.data() as FirestoreRestaurant);
    });

    return restaurants;
  } catch (error) {
    console.error('Error getting restaurants by category:', error);
    throw new Error('店舗情報の取得に失敗しました');
  }
};

/**
 * 店舗IDで単一の店舗を取得
 */
export const getRestaurantById = async (id: string): Promise<FirestoreRestaurant | null> => {
  try {
    const restaurantRef = doc(db, 'restaurants', id);
    const restaurantSnap = await getDoc(restaurantRef);

    if (restaurantSnap.exists()) {
      return restaurantSnap.data() as FirestoreRestaurant;
    } else {
      console.log('No restaurant found with id:', id);
      return null;
    }
  } catch (error) {
    console.error('Error getting restaurant by id:', error);
    throw new Error('店舗情報の取得に失敗しました');
  }
};

/**
 * 新規店舗を追加
 */
export const createRestaurant = async (
  restaurantData: Omit<FirestoreRestaurant, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  try {
    // ドキュメントIDを自動生成
    const restaurantsRef = collection(db, 'restaurants');
    const newRestaurantRef = doc(restaurantsRef);

    const restaurant: FirestoreRestaurant = {
      ...restaurantData,
      id: newRestaurantRef.id,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(newRestaurantRef, restaurant);
    console.log('Restaurant created successfully with id:', newRestaurantRef.id);
    return newRestaurantRef.id;
  } catch (error) {
    console.error('Error creating restaurant:', error);
    throw new Error('店舗の登録に失敗しました');
  }
};

/**
 * 店舗情報を更新
 */
export const updateRestaurant = async (
  id: string,
  data: Partial<Omit<FirestoreRestaurant, 'id' | 'createdAt'>>
): Promise<void> => {
  try {
    const restaurantRef = doc(db, 'restaurants', id);

    await updateDoc(restaurantRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });

    console.log('Restaurant updated successfully');
  } catch (error) {
    console.error('Error updating restaurant:', error);
    throw new Error('店舗情報の更新に失敗しました');
  }
};

/**
 * 店舗を削除
 */
export const deleteRestaurant = async (id: string): Promise<void> => {
  try {
    const restaurantRef = doc(db, 'restaurants', id);
    await deleteDoc(restaurantRef);
    console.log('Restaurant deleted successfully');
  } catch (error) {
    console.error('Error deleting restaurant:', error);
    throw new Error('店舗の削除に失敗しました');
  }
};

/**
 * 現在の時間帯に基づく報酬を計算
 */
export const getCurrentReward = (): { amount: number; timeSlot: string } => {
  const now = new Date();
  const hour = now.getHours() + now.getMinutes() / 60;

  if (hour >= 14 && hour < 17) {
    return { amount: 150, timeSlot: 'アイドルタイム (14:00-17:00)' };
  } else if (hour >= 17 && hour < 19) {
    return { amount: 120, timeSlot: '平日夜早め (17:00-19:00)' };
  } else if (hour >= 12 && hour < 13.5) {
    return { amount: 80, timeSlot: 'ピーク時 (12:00-13:30)' };
  } else {
    return { amount: 100, timeSlot: '通常時間' };
  }
};

/**
 * 店舗の報酬を更新（時間帯に基づいて）
 */
export const updateRestaurantReward = async (id: string): Promise<void> => {
  try {
    const currentReward = getCurrentReward();
    await updateRestaurant(id, { currentReward: currentReward.amount });
  } catch (error) {
    console.error('Error updating restaurant reward:', error);
    throw new Error('報酬の更新に失敗しました');
  }
};

/**
 * 無料掲載残数を減らす
 */
export const decrementFreePostsRemaining = async (id: string): Promise<void> => {
  try {
    const restaurant = await getRestaurantById(id);
    if (!restaurant) throw new Error('Restaurant not found');

    const newRemaining = Math.max(0, (restaurant.freePostsRemaining || 0) - 1);
    await updateRestaurant(id, { freePostsRemaining: newRemaining });
  } catch (error) {
    console.error('Error decrementing free posts:', error);
    throw new Error('無料掲載残数の更新に失敗しました');
  }
};
