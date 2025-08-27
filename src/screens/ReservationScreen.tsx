// src/screens/ReservationScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { colors, fontSizes, DIMENSIONS } from '../utils/constants';

type RootStackParamList = {
  StoreDetail: { store: Store };
  Reservation: { store: Store };
};

type ReservationScreenRouteProp = RouteProp<RootStackParamList, 'Reservation'>;

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

export const ReservationScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<ReservationScreenRouteProp>();
  const { store } = route.params;
  
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [guests, setGuests] = useState(2);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Ionicons name="calendar" size={64} color={colors.primary[300]} />
        <Text style={styles.title}>予約機能</Text>
        <Text style={styles.subtitle}>{store.name} の予約</Text>
        <Text style={styles.description}>
          日時選択、人数設定、予約確認などの機能を実装予定です
        </Text>
        <Button
          title="実装予定"
          onPress={() => navigation.goBack()}
          variant="primary"
        />
      </View>
    </SafeAreaView>
  );
};

// src/screens/QRScanScreen.tsx
export const QRScanScreen: React.FC = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Ionicons name="qr-code" size={64} color={colors.primary[300]} />
        <Text style={styles.title}>QRスキャン機能</Text>
        <Text style={styles.description}>
          来店確認用のQRコードスキャン機能を実装予定です。
          expo-cameraとexpo-barcode-scannerを使用します。
        </Text>
        <Button
          title="実装予定"
          onPress={() => navigation.goBack()}
          variant="primary"
        />
      </View>
    </SafeAreaView>
  );
};

// src/screens/ProfileScreen.tsx
export const ProfileScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Ionicons name="person" size={64} color={colors.primary[300]} />
        <Text style={styles.title}>プロフィール</Text>
        <Text style={styles.description}>
          ユーザー情報、設定、収益履歴などを表示する画面です
        </Text>
      </View>
    </SafeAreaView>
  );
};

// src/screens/EarningsScreen.tsx
export const EarningsScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Ionicons name="wallet" size={64} color={colors.primary[300]} />
        <Text style={styles.title}>収益管理</Text>
        <Text style={styles.description}>
          来店報酬の履歴、累計収益、出金申請などの機能を実装予定です
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  title: {
    fontSize: fontSizes.xl,
    fontWeight: '600',
    color: colors.gray[700],
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: fontSizes.lg,
    fontWeight: '500',
    color: colors.primary[600],
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: fontSizes.base,
    color: colors.gray[500],
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
});