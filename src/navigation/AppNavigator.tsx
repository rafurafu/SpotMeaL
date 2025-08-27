// src/navigation/AppNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet } from 'react-native';

import { HomeScreen } from '../screens/HomeScreen';
import { StoreDetailScreen } from '../screens/StoreDetailScreen';
import { ReservationScreen } from '../screens/ReservationScreen';
import { QRScanScreen } from '../screens/QRScanScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { EarningsScreen } from '../screens/EarningsScreen';

import { colors } from '../utils/constants';

// 型定義
export type RootStackParamList = {
  MainTabs: undefined;
  StoreDetail: { store: Store };
  Reservation: { store: Store };
  QRScan: { reservationId: string };
};

export type TabParamList = {
  Home: undefined;
  Search: undefined;
  QRScan: undefined;
  Earnings: undefined;
  Profile: undefined;
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

// 検索画面のプレースホルダー
const SearchScreen = () => (
  <View style={styles.placeholderScreen}>
    <Ionicons name="search" size={64} color={colors.textSecondary} />
    <Text style={styles.placeholderTitle}>検索機能</Text>
    <Text style={styles.placeholderText}>実装予定</Text>
  </View>
);

// タブナビゲーター
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Search':
              iconName = focused ? 'search' : 'search-outline';
              break;
            case 'QRScan':
              iconName = focused ? 'qr-code' : 'qr-code-outline';
              break;
            case 'Earnings':
              iconName = focused ? 'wallet' : 'wallet-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'ellipse';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ tabBarLabel: 'ホーム' }} 
      />
      <Tab.Screen 
        name="Search" 
        component={SearchScreen} 
        options={{ tabBarLabel: '検索' }} 
      />
      <Tab.Screen 
        name="QRScan" 
        component={QRScanScreen} 
        options={{ tabBarLabel: 'QRスキャン' }} 
      />
      <Tab.Screen 
        name="Earnings" 
        component={EarningsScreen} 
        options={{ tabBarLabel: '収益' }} 
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ tabBarLabel: 'プロフィール' }} 
      />
    </Tab.Navigator>
  );
};

// メインナビゲーター
export const AppNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.surface,
          shadowColor: colors.border,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: '600',
        },
      }}
    >
      <Stack.Screen 
        name="MainTabs" 
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="StoreDetail" 
        component={StoreDetailScreen}
        options={{ title: '店舗詳細' }}
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
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingBottom: 4,
    paddingTop: 8,
    height: 64,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  placeholderScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  placeholderTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 16,
    marginBottom: 8,
  },
  placeholderText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
});