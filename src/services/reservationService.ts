import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Firestoreに保存する予約情報の型
 */
export interface FirestoreReservation {
  id: string;
  restaurantId: string;
  userId: string;
  userName: string;
  userEmail: string;
  reservationTime: string; // '12:00', '12:30'など
  reservationDate: string; // YYYY-MM-DD形式
  reward: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: Timestamp | ReturnType<typeof serverTimestamp>;
  updatedAt: Timestamp | ReturnType<typeof serverTimestamp>;
}

/**
 * 新規予約を作成
 */
export const createReservation = async (
  reservationData: Omit<FirestoreReservation, 'id' | 'createdAt' | 'updatedAt' | 'status'>
): Promise<string> => {
  try {
    const reservationsRef = collection(db, 'reservations');
    const newReservationRef = doc(reservationsRef);

    const reservation: FirestoreReservation = {
      ...reservationData,
      id: newReservationRef.id,
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(newReservationRef, reservation);
    console.log('Reservation created successfully with id:', newReservationRef.id);
    return newReservationRef.id;
  } catch (error) {
    console.error('Error creating reservation:', error);
    throw new Error('予約の作成に失敗しました');
  }
};

/**
 * 特定のレストランの予約を取得
 * 1投稿につき1人しか予約できないため、レストランIDのみでチェック
 */
export const getReservationByRestaurant = async (
  restaurantId: string
): Promise<FirestoreReservation | null> => {
  try {
    const reservationsRef = collection(db, 'reservations');
    const q = query(
      reservationsRef,
      where('restaurantId', '==', restaurantId),
      where('status', 'in', ['pending', 'confirmed'])
    );

    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      return doc.data() as FirestoreReservation;
    }

    return null;
  } catch (error) {
    console.error('Error getting reservation:', error);
    throw new Error('予約情報の取得に失敗しました');
  }
};

/**
 * ユーザーの全予約を取得
 */
export const getUserReservations = async (userId: string): Promise<FirestoreReservation[]> => {
  try {
    const reservationsRef = collection(db, 'reservations');
    const q = query(
      reservationsRef,
      where('userId', '==', userId),
      orderBy('reservationDate', 'desc'),
      orderBy('reservationTime', 'desc')
    );

    const snapshot = await getDocs(q);
    const reservations: FirestoreReservation[] = [];

    snapshot.forEach((doc) => {
      reservations.push(doc.data() as FirestoreReservation);
    });

    return reservations;
  } catch (error) {
    console.error('Error getting user reservations:', error);
    throw new Error('予約情報の取得に失敗しました');
  }
};

/**
 * レストランの全予約を取得
 */
export const getRestaurantReservations = async (restaurantId: string): Promise<FirestoreReservation[]> => {
  try {
    const reservationsRef = collection(db, 'reservations');
    const q = query(
      reservationsRef,
      where('restaurantId', '==', restaurantId),
      orderBy('reservationDate', 'desc'),
      orderBy('reservationTime', 'desc')
    );

    const snapshot = await getDocs(q);
    const reservations: FirestoreReservation[] = [];

    snapshot.forEach((doc) => {
      reservations.push(doc.data() as FirestoreReservation);
    });

    return reservations;
  } catch (error) {
    console.error('Error getting restaurant reservations:', error);
    throw new Error('予約情報の取得に失敗しました');
  }
};

/**
 * 予約をキャンセル
 */
export const cancelReservation = async (reservationId: string): Promise<void> => {
  try {
    const reservationRef = doc(db, 'reservations', reservationId);
    await setDoc(
      reservationRef,
      {
        status: 'cancelled',
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    console.log('Reservation cancelled successfully');
  } catch (error) {
    console.error('Error cancelling reservation:', error);
    throw new Error('予約のキャンセルに失敗しました');
  }
};

/**
 * 予約を確定
 */
export const confirmReservation = async (reservationId: string): Promise<void> => {
  try {
    const reservationRef = doc(db, 'reservations', reservationId);
    await setDoc(
      reservationRef,
      {
        status: 'confirmed',
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    console.log('Reservation confirmed successfully');
  } catch (error) {
    console.error('Error confirming reservation:', error);
    throw new Error('予約の確定に失敗しました');
  }
};

/**
 * 予約を完了（来店完了）
 */
export const completeReservation = async (reservationId: string): Promise<void> => {
  try {
    const reservationRef = doc(db, 'reservations', reservationId);
    await setDoc(
      reservationRef,
      {
        status: 'completed',
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    console.log('Reservation completed successfully');
  } catch (error) {
    console.error('Error completing reservation:', error);
    throw new Error('予約の完了に失敗しました');
  }
};
