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
import { EarningsScreen } from '../screens/EarningsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import FavoritesScreen from '../screens/FavoritesScreen';

import { colors, fontSizes } from '../utils/constants';

// 型定義
export type RootStackParamList = {
  MainTabs: undefined;
  StoreDetail: { store: Store };
  Reservation: { store: Store };
  QRScan: { reservationId: string };
};

export type TabParamList = {
  Discover: undefined;
  Map: undefined;
  QRScan: undefined;
  Store: undefined;
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

// QRスキャン画面のプレースホルダー（実際の画面ができるまで）
const QRScanPlaceholder = () => (
  <PlaceholderScreen
    title="QRスキャン"
    description="来店確認用QRスキャン機能を実装予定"
  />
);

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
            case 'Store':
              iconName = focused ? 'storefront' : 'storefront-outline';
              break;
            case 'MyPage':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'ellipse';
          }

          return <Ionicons name={iconName} size={24} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
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
        component={FavoritesScreen} 
        options={{ tabBarLabel: 'マップ' }} 
      />
      <Tab.Screen 
        name="QRScan" 
        component={QRScanPlaceholder} 
        options={{ tabBarLabel: 'QR' }} 
      />
      <Tab.Screen 
        name="Store" 
        component={EarningsScreen} 
        options={{ tabBarLabel: '店舗' }} 
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
      <Stack.Screen 
        name="MainTabs" 
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="StoreDetail" 
        component={StoreDetailScreen}
        options={{ 
          headerShown: false, // カスタムヘッダーを使用するため非表示
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
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
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