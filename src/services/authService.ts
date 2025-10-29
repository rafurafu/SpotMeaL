import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  User,
  UserCredential,
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { getUserDocument } from './userService';
import { AuthUser } from '../types/auth';

/**
 * メールアドレスとパスワードで新規ユーザーを登録
 */
export const registerWithEmail = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential;
  } catch (error: any) {
    console.error('Email registration error:', error);
    throw handleAuthError(error);
  }
};

/**
 * メールアドレスとパスワードでログイン
 */
export const loginWithEmail = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential;
  } catch (error: any) {
    console.error('Email login error:', error);
    throw handleAuthError(error);
  }
};

/**
 * Googleアカウントでログイン
 */
export const loginWithGoogle = async (): Promise<UserCredential> => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    return userCredential;
  } catch (error: any) {
    console.error('Google login error:', error);
    throw handleAuthError(error);
  }
};

/**
 * ログアウト
 */
export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error: any) {
    console.error('Logout error:', error);
    throw handleAuthError(error);
  }
};

/**
 * 現在のユーザーを取得
 */
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

/**
 * FirebaseユーザーとFirestoreデータからAuthUserを作成
 */
export const loadUserProfile = async (firebaseUser: User): Promise<AuthUser | null> => {
  try {
    const userDoc = await getUserDocument(firebaseUser.uid);

    if (!userDoc) {
      // Firestoreにドキュメントがない場合は基本情報のみ
      return {
        id: firebaseUser.uid,
        name: firebaseUser.displayName || 'ユーザー',
        email: firebaseUser.email || '',
        profileImage: firebaseUser.photoURL || '',
        provider: 'email',
        favorites: [],
      };
    }

    // Firestoreのデータをマージ
    return {
      id: userDoc.uid,
      name: userDoc.displayName,
      email: userDoc.email,
      profileImage: userDoc.photoURL,
      phone: userDoc.phone,
      birthday: userDoc.birthday,
      bio: userDoc.bio,
      provider: userDoc.provider,
      favorites: userDoc.favorites || [],
    };
  } catch (error) {
    console.error('Error loading user profile:', error);
    return null;
  }
};

/**
 * Firebaseエラーをユーザーフレンドリーなメッセージに変換
 */
const handleAuthError = (error: any): Error => {
  let message = 'エラーが発生しました';

  switch (error.code) {
    case 'auth/email-already-in-use':
      message = 'このメールアドレスは既に使用されています';
      break;
    case 'auth/invalid-email':
      message = '無効なメールアドレスです';
      break;
    case 'auth/operation-not-allowed':
      message = 'この操作は許可されていません';
      break;
    case 'auth/weak-password':
      message = 'パスワードが弱すぎます';
      break;
    case 'auth/user-disabled':
      message = 'このアカウントは無効化されています';
      break;
    case 'auth/user-not-found':
      message = 'ユーザーが見つかりません';
      break;
    case 'auth/wrong-password':
      message = 'パスワードが正しくありません';
      break;
    case 'auth/too-many-requests':
      message = 'リクエストが多すぎます。しばらく待ってからお試しください';
      break;
    case 'auth/network-request-failed':
      message = 'ネットワークエラーが発生しました';
      break;
    case 'auth/popup-closed-by-user':
      message = 'ログインがキャンセルされました';
      break;
    default:
      message = error.message || 'エラーが発生しました';
  }

  return new Error(message);
};
