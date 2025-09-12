// src/navigation/AppNavigator.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

import { HomeScreen } from '../screens/HomeScreen';
import { StoreDetailScreen } from '../screens/StoreDetailScreen';
import { StoreRegistrationScreen } from '../screens/StoreRegistrationScreen';
import { ProfileEditScreen } from '../screens/ProfileEditScreen';
import { ReservationScreen } from '../screens/ReservationScreen';
import { QRScanScreen } from '../screens/QRScanScreen';
import { EarningsScreen } from '../screens/EarningsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import { AuthNavigator } from './AuthNavigator';
import { AuthGuard } from '../components/auth/AuthGuard';
import { useAppSelector } from '../hooks/redux';

import { colors, fontSizes } from '../utils/constants';

// 型定義
export type RootStackParamList = {
  Auth: undefined;
  Login: undefined;
  SignUp: undefined;
  Home: undefined;
  StoreDetail: { store: Store };
  StoreRegistration: undefined;
  ProfileEdit: undefined;
  Reservation: { store: Store };
  QRScan: { reservationId: string };
  Profile: undefined;
  Favorites: undefined;
};

interface Store {
  id: string;
  name: string;
  category: string;
  image: string;
  description: string;
  address: string;
  rating: number;
  distance: number;
  currentReward: number;
  isAvailable: boolean;
  freePostsRemaining: number;
}

const Stack = createStackNavigator<RootStackParamList>();

// メインナビゲーター
export const AppNavigator = () => {
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);

  const handleAuthSuccess = () => {
    // Navigation will be handled automatically by Redux state change
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.white,
          shadowColor: colors.gray[200],
        },
        headerTintColor: colors.gray[900],
        headerTitleStyle: {
          fontSize: fontSizes.lg,
          fontWeight: '600',
        },
      }}
    >
      {!isAuthenticated ? (
        <Stack.Screen 
          name="Auth" 
          options={{ headerShown: false }}
        >
          {() => <AuthNavigator onAuthSuccess={handleAuthSuccess} />}
        </Stack.Screen>
      ) : (
        <>
          <Stack.Screen 
            name="Home" 
            component={HomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="StoreDetail" 
            component={StoreDetailScreen}
            options={{ 
              headerShown: false,
            }}
          />
          <Stack.Screen 
            name="StoreRegistration" 
            component={StoreRegistrationScreen}
            options={{ 
              headerShown: false,
            }}
          />
          <Stack.Screen 
            name="Profile" 
            component={ProfileScreen}
            options={{ 
              headerShown: false,
            }}
          />
          <Stack.Screen 
            name="ProfileEdit" 
            component={ProfileEditScreen}
            options={{ 
              headerShown: false,
            }}
          />
          <Stack.Screen 
            name="Favorites" 
            component={FavoritesScreen}
            options={{ 
              headerShown: false,
            }}
          />
          <Stack.Screen 
            name="Reservation" 
            component={ReservationScreen}
            options={{ title: '予約' }}
          />
          <Stack.Screen 
            name="QRScan" 
            component={QRScanScreen}
            options={{ title: 'QRスキャン' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});