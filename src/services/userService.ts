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
