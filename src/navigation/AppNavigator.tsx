// src/navigation/AppNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

import { HomeScreen } from '../screens/HomeScreen';
import { StoreDetailScreen } from '../screens/StoreDetailScreen';
import { StoreRegistrationScreen } from '../screens/StoreRegistrationScreen';
import { ProfileEditScreen } from '../screens/ProfileEditScreen';
import { ReservationScreen } from '../screens/ReservationScreen';
import { QRScanScreen } from '../screens/QRScanScreen';
import { EarningsScreen } from '../screens/EarningsScreen';
import { MapScreen } from '../screens/MapScreen';
import ProfileScreen from '../screens/ProfileScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { AuthGuard } from '../components/auth/AuthGuard';
import { useAppSelector } from '../hooks/redux';

import { colors, fontSizes } from '../utils/constants';

// 型定義
export type RootStackParamList = {
  Auth: undefined;
  MainTabs: undefined;
  StoreDetail: { store: Store };
  StoreRegistration: undefined;
  ProfileEdit: undefined;
  Reservation: { store: Store };
  QRScan: { reservationId: string };
};

export type TabParamList = {
  Discover: undefined;
  Map: undefined;
  QRScan: undefined;
  StoreRegistration: undefined;
  MyPage: undefined;
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
const Tab = createBottomTabNavigator<TabParamList>();

// プレースホルダー画面コンポーネント
const PlaceholderScreen = ({ title, description }: { title: string; description: string }) => (
  <View style={styles.placeholderScreen}>
    <Ionicons name="construct" size={64} color={colors.gray[300]} />
    <Text style={styles.placeholderTitle}>{title}</Text>
    <Text style={styles.placeholderText}>{description}</Text>
  </View>
);

// QRスキャン画面
const QRScanTab = () => <QRScanScreen />;

// タブナビゲーター
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'Discover':
              iconName = focused ? 'search' : 'search-outline';
              break;
            case 'Map':
              iconName = focused ? 'map' : 'map-outline';
              break;
            case 'QRScan':
              iconName = focused ? 'qr-code' : 'qr-code-outline';
              break;
            case 'StoreRegistration':
              iconName = focused ? 'add-circle' : 'add-circle-outline';
              break;
            case 'MyPage':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'ellipse';
          }

          return <Ionicons name={iconName} size={24} color={color} />;
        },
        tabBarActiveTintColor: colors.primary[500],
        tabBarInactiveTintColor: colors.gray[400],
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Discover" 
        component={HomeScreen} 
        options={{ tabBarLabel: '発見' }} 
      />
      <Tab.Screen 
        name="Map" 
        component={MapScreen} 
        options={{ tabBarLabel: 'マップ' }} 
      />
      <Tab.Screen 
        name="QRScan" 
        component={QRScanTab} 
        options={{ tabBarLabel: 'QR' }} 
      />
      <Tab.Screen 
        name="StoreRegistration" 
        component={StoreRegistrationScreen} 
        options={{ tabBarLabel: '店舗掲載' }} 
      />
      <Tab.Screen 
        name="MyPage" 
        component={ProfileScreen} 
        options={{ tabBarLabel: 'マイページ' }} 
      />
    </Tab.Navigator>
  );
};

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
          {() => <LoginScreen onAuthSuccess={handleAuthSuccess} />}
        </Stack.Screen>
      ) : (
        <>
          <Stack.Screen 
            name="MainTabs" 
            component={TabNavigator}
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
            name="ProfileEdit" 
            component={ProfileEditScreen}
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
  tabBar: {
    backgroundColor: colors.white,
    borderTopWidth: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 16,
    paddingBottom: 8,
    paddingTop: 12,
    height: 80,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  tabBarLabel: {
    fontSize: fontSizes.xs,
    fontWeight: '600',
    marginTop: 2,
  },
  placeholderScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.gray[50],
    paddingHorizontal: 32,
  },
  placeholderTitle: {
    fontSize: fontSizes.xl,
    fontWeight: '600',
    color: colors.gray[600],
    marginTop: 16,
    marginBottom: 8,
  },
  placeholderText: {
    fontSize: fontSizes.base,
    color: colors.gray[500],
    textAlign: 'center',
    lineHeight: 24,
  },
});