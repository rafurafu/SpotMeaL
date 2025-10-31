// src/screens/ReservationScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { colors, fontSizes, spacing, borderRadius, shadows } from '../utils/constants';
import { createReservation } from '../services/reservationService';
import { useAppSelector } from '../hooks/redux';

type RootStackParamList = {
  Home: undefined;
  StoreDetail: { store: Store };
  Reservation: { store: Store; selectedTime: string; selectedDate: string; reward: number };
};

type ReservationScreenRouteProp = RouteProp<RootStackParamList, 'Reservation'>;
type ReservationScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Reservation'>;

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
  const navigation = useNavigation<ReservationScreenNavigationProp>();
  const route = useRoute<ReservationScreenRouteProp>();
  const { store, selectedTime, selectedDate, reward } = route.params;
  const { user } = useAppSelector((state) => state.auth);

  const [guests, setGuests] = useState(2);
  const [specialRequests, setSpecialRequests] = useState('');
  const [loading, setLoading] = useState(false);

  const guestOptions = [1, 2, 3, 4, 5, 6, 7, 8];

  const handleReservation = async () => {
    if (!user) {
      Alert.alert('エラー', 'ログインが必要です');
      return;
    }

    try {
      setLoading(true);

      await createReservation({
        restaurantId: store.id,
        userId: user.id,
        userName: user.name || user.email,
        userEmail: user.email,
        reservationTime: selectedTime,
        reservationDate: selectedDate,
        reward: reward,
        guests: guests,
        specialRequests: specialRequests,
      });

      Alert.alert(
        '予約完了',
        `${store.name}の予約が完了しました。\n予約時間: ${selectedDate} ${selectedTime}\n人数: ${guests}名`,
        [
          {
            text: 'OK',
            onPress: () => {
              navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }],
              });
            },
          },
        ]
      );
    } catch (error) {
      console.error('予約エラー:', error);
      Alert.alert('エラー', '予約の作成に失敗しました。もう一度お試しください。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* ヘッダー */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.gray[900]} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>予約詳細</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.content}>
          {/* 店舗情報 */}
          <Card style={styles.card}>
            <Text style={styles.storeName}>{store.name}</Text>
            <View style={styles.infoRow}>
              <Ionicons name="location" size={16} color={colors.gray[500]} />
              <Text style={styles.infoText}>{store.address}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="time" size={16} color={colors.gray[500]} />
              <Text style={styles.infoText}>
                {selectedDate} {selectedTime}
              </Text>
            </View>
            <View style={styles.rewardBadge}>
              <Ionicons name="gift" size={16} color={colors.white} />
              <Text style={styles.rewardText}>¥{reward}</Text>
            </View>
          </Card>

          {/* 人数選択 */}
          <Card style={styles.card}>
            <Text style={styles.sectionTitle}>人数</Text>
            <View style={styles.guestSelector}>
              {guestOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.guestOption,
                    guests === option && styles.guestOptionSelected,
                  ]}
                  onPress={() => setGuests(option)}
                >
                  <Text
                    style={[
                      styles.guestOptionText,
                      guests === option && styles.guestOptionTextSelected,
                    ]}
                  >
                    {option}名
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Card>

          {/* ご要望 */}
          <Card style={styles.card}>
            <Text style={styles.sectionTitle}>ご要望</Text>
            <Text style={styles.sectionDescription}>
              アレルギー対応、席の希望など、お気軽にお知らせください
            </Text>
            <TextInput
              style={styles.textInput}
              placeholder="例: 窓際の席を希望します"
              placeholderTextColor={colors.gray[400]}
              multiline
              numberOfLines={4}
              value={specialRequests}
              onChangeText={setSpecialRequests}
              textAlignVertical="top"
            />
          </Card>

          {/* キャンセルポリシー */}
          <Card style={styles.card}>
            <Text style={styles.sectionTitle}>キャンセルポリシー</Text>
            <View style={styles.policyRow}>
              <Ionicons name="information-circle" size={20} color={colors.warning[500]} />
              <Text style={styles.policyText}>
                予約2時間前のキャンセルには、キャンセル料30円が発生します
              </Text>
            </View>
          </Card>

          {/* 予約ボタン */}
          <View style={styles.buttonContainer}>
            <Button
              title={loading ? '予約中...' : '予約する'}
              onPress={handleReservation}
              variant="primary"
              size="large"
              disabled={loading}
              style={styles.reserveButton}
            />
          </View>
        </View>
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: fontSizes.lg,
    fontWeight: '600',
    color: colors.gray[900],
  },
  placeholder: {
    width: 40,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  card: {
    marginBottom: 16,
  },
  storeName: {
    fontSize: fontSizes.xl,
    fontWeight: '700',
    color: colors.gray[900],
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: fontSizes.base,
    color: colors.gray[600],
    marginLeft: 8,
    flex: 1,
  },
  rewardBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary[500],
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  rewardText: {
    fontSize: fontSizes.base,
    fontWeight: '700',
    color: colors.white,
    marginLeft: 6,
  },
  sectionTitle: {
    fontSize: fontSizes.lg,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: 12,
  },
  sectionDescription: {
    fontSize: fontSizes.sm,
    color: colors.gray[500],
    marginBottom: 12,
    lineHeight: 20,
  },
  guestSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  guestOption: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray[300],
    backgroundColor: colors.white,
  },
  guestOptionSelected: {
    backgroundColor: colors.primary[500],
    borderColor: colors.primary[500],
  },
  guestOptionText: {
    fontSize: fontSizes.base,
    color: colors.gray[700],
    fontWeight: '500',
  },
  guestOptionTextSelected: {
    color: colors.white,
    fontWeight: '600',
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 8,
    padding: 12,
    fontSize: fontSizes.base,
    color: colors.gray[900],
    backgroundColor: colors.white,
    minHeight: 100,
  },
  policyRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  policyText: {
    fontSize: fontSizes.base,
    color: colors.gray[700],
    flex: 1,
    lineHeight: 22,
  },
  buttonContainer: {
    marginTop: 8,
    marginBottom: 32,
  },
  reserveButton: {
    width: '100%',
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