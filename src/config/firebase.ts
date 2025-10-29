import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase設定
// プロジェクト名: SpotMeaL
// プロジェクトID: spotmeal-fe4a2
const firebaseConfig = {
  apiKey: "AIzaSyD0aUv8mBBgjc18lZZGY4GNjW3WwbkO-Pc",
  authDomain: "spotmeal-fe4a2.firebaseapp.com",
  projectId: "spotmeal-fe4a2",
  storageBucket: "spotmeal-fe4a2.firebasestorage.app",
  messagingSenderId: "912211392523",
  appId: "1:912211392523:web:46f777b5c0333f561f6f0e"
};

// Firebaseアプリの初期化
const app = initializeApp(firebaseConfig);

// Firebase Authentication
export const auth = getAuth(app);

// Firestore Database
export const db = getFirestore(app);

export default app;
