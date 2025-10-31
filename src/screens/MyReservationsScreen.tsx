// src/screens/MyReservationsScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { colors, fontSizes, spacing } from '../utils/constants';
import { useAppSelector } from '../hooks/redux';
import { getUserReservations, cancelReservation, FirestoreReservation } from '../services/reservationService';

type RootStackParamList = {
  MyReservations: undefined;
};

type MyReservationsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MyReservations'>;

export const MyReservationsScreen: React.FC = () => {
  const navigation = useNavigation<MyReservationsScreenNavigationProp>();
  const { user } = useAppSelector((state) => state.auth);

  const [reservations, setReservations] = useState<FirestoreReservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const loadReservations = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const userReservations = await getUserReservations(user.id);
      setReservations(userReservations);
    } catch (error) {
      console.error('予約一覧の取得エラー:', error);
      Alert.alert('エラー', '予約一覧の取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadReservations();
    setRefreshing(false);
  };

  useEffect(() => {
    loadReservations();
  }, [user]);

  const handleCancelReservation = async (reservation: FirestoreReservation) => {
    // 予約時間の2時間前かどうかチェック
    const reservationDateTime = new Date(`${reservation.reservationDate}T${reservation.reservationTime}`);
    const now = new Date();
    const twoHoursBefore = new Date(reservationDateTime.getTime() - 2 * 60 * 60 * 1000);

    const isCancellationFeeApplicable = now >= twoHoursBefore;
    const cancellationFee = isCancellationFeeApplicable ? 30 : 0;

    const message = isCancellationFeeApplicable
      ? `予約をキャンセルしますか？\n\n予約時間の2時間前を過ぎているため、キャンセル料30円が発生します。`
      : `予約をキャンセルしますか？`;

    Alert.alert(
      '予約キャンセル',
      message,
      [
        {
          text: 'いいえ',
          style: 'cancel',
        },
        {
          text: 'はい',
          style: 'destructive',
          onPress: async () => {
            try {
              setCancellingId(reservation.id);
              await cancelReservation(reservation.id, cancellationFee);

              Alert.alert(
                'キャンセル完了',
                isCancellationFeeApplicable
                  ? `予約をキャンセルしました。\nキャンセル料30円が請求されます。`
                  : '予約をキャンセルしました。'
              );

              // 予約一覧を再取得
              await loadReservations();
            } catch (error) {
              console.error('予約キャンセルエラー:', error);
              Alert.alert('エラー', '予約のキャンセルに失敗しました');
            } finally {
              setCancellingId(null);
            }
          },
        },
      ]
    );
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return '予約中';
      case 'confirmed':
        return '確定';
      case 'completed':
        return '来店済み';
      case 'cancelled':
        return 'キャンセル済み';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return colors.warning[500];
      case 'confirmed':
        return colors.success[500];
      case 'completed':
        return colors.gray[500];
      case 'cancelled':
        return colors.error[500];
      default:
        return colors.gray[500];
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.gray[900]} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>予約一覧</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary[500]} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.gray[900]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>予約一覧</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {reservations.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={64} color={colors.gray[300]} />
            <Text style={styles.emptyText}>予約がありません</Text>
            <Text style={styles.emptySubText}>
              お店を探して予約してみましょう
            </Text>
          </View>
        ) : (
          reservations.map((reservation) => (
            <Card key={reservation.id} style={styles.reservationCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.restaurantName}>
                  店舗ID: {reservation.restaurantId}
                </Text>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(reservation.status) },
                  ]}
                >
                  <Text style={styles.statusText}>
                    {getStatusText(reservation.status)}
                  </Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="calendar" size={16} color={colors.gray[500]} />
                <Text style={styles.infoText}>
                  {reservation.reservationDate}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="time" size={16} color={colors.gray[500]} />
                <Text style={styles.infoText}>
                  {reservation.reservationTime}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="people" size={16} color={colors.gray[500]} />
                <Text style={styles.infoText}>{reservation.guests}名</Text>
              </View>

              {reservation.specialRequests && (
                <View style={styles.infoRow}>
                  <Ionicons name="chatbubble" size={16} color={colors.gray[500]} />
                  <Text style={styles.infoText} numberOfLines={2}>
                    {reservation.specialRequests}
                  </Text>
                </View>
              )}

              <View style={styles.rewardRow}>
                <Ionicons name="gift" size={16} color={colors.primary[500]} />
                <Text style={styles.rewardText}>¥{reservation.reward}</Text>
              </View>

              {(reservation.status === 'pending' || reservation.status === 'confirmed') && (
                <View style={styles.buttonContainer}>
                  <Button
                    title={cancellingId === reservation.id ? 'キャンセル中...' : '予約をキャンセル'}
                    onPress={() => handleCancelReservation(reservation)}
                    variant="outline"
                    size="medium"
                    disabled={cancellingId === reservation.id}
                    style={styles.cancelButton}
                  />
                </View>
              )}
            </Card>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: fontSizes.lg,
    fontWeight: '600',
    color: colors.gray[600],
    marginTop: 16,
  },
  emptySubText: {
    fontSize: fontSizes.base,
    color: colors.gray[500],
    marginTop: 8,
  },
  reservationCard: {
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  restaurantName: {
    fontSize: fontSizes.lg,
    fontWeight: '600',
    color: colors.gray[900],
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: fontSizes.sm,
    fontWeight: '600',
    color: colors.white,
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
  rewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  rewardText: {
    fontSize: fontSizes.lg,
    fontWeight: '700',
    color: colors.primary[500],
    marginLeft: 6,
  },
  buttonContainer: {
    marginTop: 8,
  },
  cancelButton: {
    width: '100%',
  },
});
