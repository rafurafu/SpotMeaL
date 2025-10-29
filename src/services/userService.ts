import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Firestoreに保存するユーザー情報の型
 */
export interface FirestoreUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  phone?: string;
  birthday?: string;
  bio?: string;
  provider: 'email' | 'google';
  createdAt: Timestamp | ReturnType<typeof serverTimestamp>;
  updatedAt: Timestamp | ReturnType<typeof serverTimestamp>;
  favorites?: string[];
  // 統計情報
  totalVisits?: number;        // 総来店回数
  totalRewards?: number;       // 総獲得報酬（円）
  thisMonthVisits?: number;    // 今月の来店回数
}

/**
 * 新規ユーザー情報をFirestoreに保存
 */
export const createUserDocument = async (
  uid: string,
  email: string,
  displayName: string,
  provider: 'email' | 'google',
  photoURL?: string
): Promise<void> => {
  try {
    const userRef = doc(db, 'users', uid);

    const userData: FirestoreUser = {
      uid,
      email,
      displayName,
      photoURL: photoURL || '',
      provider,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      favorites: [],
      totalVisits: 0,
      totalRewards: 0,
      thisMonthVisits: 0,
    };

    await setDoc(userRef, userData);
    console.log('User document created successfully');
  } catch (error) {
    console.error('Error creating user document:', error);
    throw new Error('ユーザー情報の保存に失敗しました');
  }
};

/**
 * Firestoreからユーザー情報を取得
 */
export const getUserDocument = async (uid: string): Promise<FirestoreUser | null> => {
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data() as FirestoreUser;
    } else {
      console.log('No user document found');
      return null;
    }
  } catch (error) {
    console.error('Error getting user document:', error);
    throw new Error('ユーザー情報の取得に失敗しました');
  }
};

/**
 * ユーザー情報を更新
 */
export const updateUserDocument = async (
  uid: string,
  data: Partial<Omit<FirestoreUser, 'uid' | 'createdAt'>>
): Promise<void> => {
  try {
    const userRef = doc(db, 'users', uid);

    await updateDoc(userRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });

    console.log('User document updated successfully');
  } catch (error) {
    console.error('Error updating user document:', error);
    throw new Error('ユーザー情報の更新に失敗しました');
  }
};

/**
 * お気に入りに追加
 */
export const addFavorite = async (uid: string, restaurantId: string): Promise<void> => {
  try {
    const user = await getUserDocument(uid);
    if (!user) throw new Error('User not found');

    const favorites = user.favorites || [];
    if (!favorites.includes(restaurantId)) {
      favorites.push(restaurantId);
      await updateUserDocument(uid, { favorites });
    }
  } catch (error) {
    console.error('Error adding favorite:', error);
    throw new Error('お気に入りの追加に失敗しました');
  }
};

/**
 * お気に入りから削除
 */
export const removeFavorite = async (uid: string, restaurantId: string): Promise<void> => {
  try {
    const user = await getUserDocument(uid);
    if (!user) throw new Error('User not found');

    const favorites = user.favorites || [];
    const updatedFavorites = favorites.filter(id => id !== restaurantId);
    await updateUserDocument(uid, { favorites: updatedFavorites });
  } catch (error) {
    console.error('Error removing favorite:', error);
    throw new Error('お気に入りの削除に失敗しました');
  }
};

/**
 * 来店回数を増加（総来店回数と今月の来店回数）
 */
export const incrementVisitCount = async (uid: string): Promise<void> => {
  try {
    const user = await getUserDocument(uid);
    if (!user) throw new Error('User not found');

    const totalVisits = (user.totalVisits || 0) + 1;
    const thisMonthVisits = (user.thisMonthVisits || 0) + 1;

    await updateUserDocument(uid, { totalVisits, thisMonthVisits });
    console.log('Visit count incremented successfully');
  } catch (error) {
    console.error('Error incrementing visit count:', error);
    throw new Error('来店回数の更新に失敗しました');
  }
};

/**
 * 報酬を追加
 */
export const addReward = async (uid: string, amount: number): Promise<void> => {
  try {
    const user = await getUserDocument(uid);
    if (!user) throw new Error('User not found');

    const totalRewards = (user.totalRewards || 0) + amount;

    await updateUserDocument(uid, { totalRewards });
    console.log('Reward added successfully');
  } catch (error) {
    console.error('Error adding reward:', error);
    throw new Error('報酬の追加に失敗しました');
  }
};

/**
 * 今月の来店回数をリセット（月初に呼び出す想定）
 */
export const resetMonthlyVisits = async (uid: string): Promise<void> => {
  try {
    await updateUserDocument(uid, { thisMonthVisits: 0 });
    console.log('Monthly visits reset successfully');
  } catch (error) {
    console.error('Error resetting monthly visits:', error);
    throw new Error('今月の来店回数のリセットに失敗しました');
  }
};
