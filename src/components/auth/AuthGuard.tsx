import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { setUser, setLoading } from '../../store/slices/authSlice';
import { auth } from '../../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getUserDocument } from '../../services/userService';
import { colors } from '../../utils/constants';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  fallback
}) => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Firebase認証状態の監視
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      dispatch(setLoading(true));

      if (firebaseUser) {
        try {
          // Firestoreからユーザー情報を取得
          const userDoc = await getUserDocument(firebaseUser.uid);

          const user = {
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            name: userDoc?.displayName || firebaseUser.displayName || 'ユーザー',
            profileImage: userDoc?.photoURL || '',
            phone: userDoc?.phone,
            birthday: userDoc?.birthday,
            bio: userDoc?.bio,
            provider: (userDoc?.provider || 'email') as 'email' | 'google',
            favorites: userDoc?.favorites || [],
          };

          console.log('AuthGuard: User loaded with profile:', user);
          dispatch(setUser(user));
        } catch (error) {
          console.error('AuthGuard: Error loading user:', error);
          dispatch(setUser(null));
        }
      } else {
        dispatch(setUser(null));
      }

      dispatch(setLoading(false));
    });

    return () => unsubscribe();
  }, [dispatch]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
      </View>
    );
  }

  if (!isAuthenticated) {
    return fallback ? <>{fallback}</> : null;
  }

  return <>{children}</>;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});