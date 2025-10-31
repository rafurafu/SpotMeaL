// src/screens/StoreDetailScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { colors, fontSizes, DIMENSIONS } from '../utils/constants';
import { Store } from '../contexts/StoreContext';
import { auth } from '../config/firebase';
import { addFavorite, removeFavorite, getUserDocument } from '../services/userService';
import { getReservationByRestaurant } from '../services/reservationService';

// Navigation types
type RootStackParamList = {
  Home: undefined;
  StoreDetail: { store: Store };
  Reservation: { store: Store; selectedTime: string; selectedDate: string; reward: number };
  Map: { store: Store };
};

type StoreDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'StoreDetail'>;
type StoreDetailScreenRouteProp = RouteProp<RootStackParamList, 'StoreDetail'>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// 現在の時間帯情報を取得
const getCurrentTimeSlot = () => {
  const now = new Date();
  const hour = now.getHours() + now.getMinutes() / 60;

  if (hour >= 14 && hour < 17) {
    return {
      name: 'アイドルタイム',
      startTime: '14:00',
      endTime: '17:00',
      reward: 150,
    };
  } else if (hour >= 17 && hour < 19) {
    return {
      name: '平日夜早め',
      startTime: '17:00',
      endTime: '19:00',
      reward: 120,
    };
  } else if (hour >= 12 && hour < 13.5) {
    return {
      name: 'ピーク時',
      startTime: '12:00',
      endTime: '13:30',
      reward: 80,
    };
  } else {
    return {
      name: '通常時間',
      startTime: '09:00',
      endTime: '22:00',
      reward: 100,
    };
  }
};

// 選択した時間に基づいて報酬を計算
const getRewardForTime = (timeString: string): number => {
  // '12:00' -> 12.0, '12:30' -> 12.5 に変換
  const [hours, minutes] = timeString.split(':').map(Number);
  const timeValue = hours + minutes / 60;

  if (timeValue >= 14 && timeValue < 17) {
    return 150; // アイドルタイム
  } else if (timeValue >= 17 && timeValue < 19) {
    return 120; // 平日夜早め
  } else if (timeValue >= 12 && timeValue < 13.5) {
    return 80; // ピーク時
  } else {
    return 100; // 通常時間
  }
};

export const StoreDetailScreen: React.FC = () => {
  const navigation = useNavigation<StoreDetailScreenNavigationProp>();
  const route = useRoute<StoreDetailScreenRouteProp>();
  const { store } = route.params;

  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [loading, setLoading] = useState(false);
  const [isReserved, setIsReserved] = useState(false);
  const [existingReservation, setExistingReservation] = useState<any>(null);
  const [imageLoading, setImageLoading] = useState(true);

  const currentTimeSlot = getCurrentTimeSlot();

  const timeSlots = [
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
    '18:00', '18:30', '19:00', '19:30', '20:00', '20:30'
  ];

  // ユーザーのお気に入り状態をロード
  useEffect(() => {
    const loadFavoriteStatus = async () => {
      const user = auth.currentUser;
      if (user) {
        const userData = await getUserDocument(user.uid);
        if (userData?.favorites) {
          setIsFavorite(userData.favorites.includes(store.id));
        }
      }
    };
    loadFavoriteStatus();
  }, [store.id]);

  // 予約済み状態をロード（1投稿につき1人まで）
  useEffect(() => {
    const loadReservationStatus = async () => {
      const reservation = await getReservationByRestaurant(store.id);
      if (reservation) {
        setIsReserved(true);
        setExistingReservation(reservation);
      } else {
        setIsReserved(false);
        setExistingReservation(null);
      }
    };
    loadReservationStatus();
  }, [store.id]);

  const handleFavoriteToggle = async () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert('エラー', 'お気に入りに追加するにはログインが必要です');
      return;
    }

    try {
      if (isFavorite) {
        await removeFavorite(user.uid, store.id);
        setIsFavorite(false);
      } else {
        await addFavorite(user.uid, store.id);
        setIsFavorite(true);
      }
    } catch (error) {
      Alert.alert('エラー', 'お気に入りの更新に失敗しました');
    }
  };

  const handleTimeSelect = (time: string) => {
    if (isReserved) {
      Alert.alert('予約不可', 'この投稿は既に予約されています');
      return;
    }
    setSelectedTime(time);
  };

  const handleReservation = async () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert('エラー', '予約するにはログインが必要です');
      return;
    }

    if (!selectedTime) {
      Alert.alert('エラー', '予約時間を選択してください');
      return;
    }

    // 既に予約されているかチェック（1投稿につき1人まで）
    setLoading(true);
    try {
      const reservation = await getReservationByRestaurant(store.id);

      if (reservation) {
        Alert.alert('予約不可', 'この投稿は既に予約されています');
        return;
      }

      // 選択した時間に応じた報酬を計算
      const selectedTimeReward = getRewardForTime(selectedTime);

      // 予約詳細画面に遷移
      navigation.navigate('Reservation', {
        store,
        selectedTime,
        selectedDate,
        reward: selectedTimeReward,
      });
    } catch (error) {
      Alert.alert('エラー', '予約情報の確認に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.gray[900]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>店舗詳細</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={() => navigation.navigate('Map', { store })} style={styles.headerButton}>
            <Ionicons name="map-outline" size={24} color={colors.gray[900]} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleFavoriteToggle} style={styles.favoriteButton}>
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={24}
              color={isFavorite ? colors.error[500] : colors.gray[900]}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Store Image */}
        <View style={styles.imageContainer}>
          {imageLoading && (
            <View style={styles.imageLoadingContainer}>
              <ActivityIndicator size="large" color={colors.primary[500]} />
            </View>
          )}
          <Image
            source={typeof store.image === 'string' ? { uri: store.image } : store.image}
            style={styles.storeImage}
            resizeMode="cover"
            onLoadStart={() => setImageLoading(true)}
            onLoadEnd={() => setImageLoading(false)}
            onError={() => setImageLoading(false)}
          />
          <View style={styles.rewardBadge}>
            <Ionicons name="diamond" size={20} color={colors.warning[500]} />
            <Text style={styles.rewardText}>¥{store.currentReward}</Text>
          </View>
          <View style={[
            styles.availableBadge,
            (isReserved || !store.isAvailable) && styles.unavailableBadge
          ]}>
            <Text style={styles.availableText}>
              {isReserved ? '受付終了' : store.isAvailable ? '受付中' : '受付終了'}
            </Text>
          </View>
        </View>

        <View style={styles.contentContainer}>
          {/* Store Info */}
          <View style={styles.storeInfoSection}>
            <View style={styles.titleRow}>
              <Text style={styles.storeName}>{store.name}</Text>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={20} color={colors.warning[500]} />
                <Text style={styles.ratingText}>{store.rating}</Text>
              </View>
            </View>
            
            <View style={styles.metaRow}>
              <View style={styles.distanceContainer}>
                <Ionicons name="location-outline" size={18} color={colors.gray[500]} />
                <Text style={styles.distanceText}>{store.distance}km</Text>
              </View>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{store.category}</Text>
              </View>
            </View>
            
            <Text style={styles.description}>{store.description}</Text>
            <Text style={styles.address}>{store.address}</Text>
          </View>

          {/* Current Reward Info */}
          <Card style={styles.rewardInfoCard}>
            <Text style={styles.rewardInfoTitle}>現在の来店報酬</Text>
            <View style={styles.rewardInfoContent}>
              <View style={styles.rewardAmountContainer}>
                <Ionicons name="diamond" size={24} color={colors.warning[500]} />
                <Text style={styles.rewardAmountText}>¥{currentTimeSlot.reward}</Text>
              </View>
              <View style={styles.timeSlotInfo}>
                <Text style={styles.timeSlotName}>{currentTimeSlot.name}</Text>
                <View style={styles.timeSlotDuration}>
                  <Ionicons name="time-outline" size={16} color={colors.gray[500]} />
                  <Text style={styles.timeSlotText}>
                    {currentTimeSlot.startTime}-{currentTimeSlot.endTime}
                  </Text>
                </View>
              </View>
            </View>
          </Card>

          {/* Time Slots */}
          <View style={styles.timeSlotsSection}>
            <Text style={styles.sectionTitle}>予約可能時間</Text>
            {isReserved && existingReservation && (
              <Card style={styles.reservedInfoCard}>
                <View style={styles.reservedInfoContent}>
                  <Ionicons name="checkmark-circle" size={24} color={colors.success[500]} />
                  <View style={styles.reservedInfoText}>
                    <Text style={styles.reservedInfoTitle}>予約済み</Text>
                    <Text style={styles.reservedInfoSubtitle}>
                      {existingReservation.reservationDate} {existingReservation.reservationTime}
                    </Text>
                  </View>
                </View>
              </Card>
            )}
            <View style={styles.timeSlotsGrid}>
              {timeSlots.map((time) => {
                const isSelected = selectedTime === time;
                return (
                  <TouchableOpacity
                    key={time}
                    style={[
                      styles.timeSlotButton,
                      isSelected && styles.timeSlotButtonSelected,
                      isReserved && styles.timeSlotButtonReserved,
                    ]}
                    onPress={() => handleTimeSelect(time)}
                    disabled={isReserved}
                  >
                    <Text
                      style={[
                        styles.timeSlotButtonText,
                        isSelected && styles.timeSlotButtonTextSelected,
                        isReserved && styles.timeSlotButtonTextReserved,
                      ]}
                    >
                      {time}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Reservation Info */}
          <Card style={styles.infoCard}>
            <Text style={styles.sectionTitle}>予約について</Text>
            <View style={styles.infoList}>
              <View style={styles.infoItem}>
                <Ionicons name="calendar-outline" size={20} color={colors.gray[500]} />
                <Text style={styles.infoText}>予約は当日のみ可能です</Text>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="time-outline" size={20} color={colors.gray[500]} />
                <Text style={styles.infoText}>予約した時間帯の報酬のみ獲得できます</Text>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="qr-code-outline" size={20} color={colors.gray[500]} />
                <Text style={styles.infoText}>来店時にQRコードを読み取ってください</Text>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="cash-outline" size={20} color={colors.gray[500]} />
                <Text style={styles.infoText}>お会計後、再度QRコードを読み取ると報酬が付与されます</Text>
              </View>
            </View>
          </Card>

        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>

      {/* Reserve Button */}
      <View style={styles.reserveButtonContainer}>
        <Button
          title={
            loading
              ? '確認中...'
              : isReserved
              ? '予約済み'
              : !store.isAvailable
              ? '現在予約できません'
              : !selectedTime
              ? '予約時間を選択してください'
              : '予約詳細へ'
          }
          onPress={handleReservation}
          variant="primary"
          size="large"
          disabled={!store.isAvailable || !selectedTime || loading || isReserved}
          style={styles.reserveButton}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: DIMENSIONS.screenPadding,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
    backgroundColor: colors.white,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: fontSizes.lg,
    fontWeight: '600',
    color: colors.gray[900],
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: 4,
    marginRight: 8,
  },
  favoriteButton: {
    padding: 4,
  },
  imageContainer: {
    position: 'relative',
    backgroundColor: colors.gray[100],
  },
  imageLoadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    backgroundColor: colors.gray[100],
  },
  storeImage: {
    width: SCREEN_WIDTH,
    height: 250,
  },
  rewardBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: colors.white,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
  },
  rewardText: {
    fontSize: fontSizes.base,
    fontWeight: '700',
    color: colors.gray[900],
    marginLeft: 4,
  },
  availableBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: colors.success[500],
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  unavailableBadge: {
    backgroundColor: colors.gray[500],
  },
  availableText: {
    fontSize: fontSizes.sm,
    color: colors.white,
    fontWeight: '600',
  },
  contentContainer: {
    padding: DIMENSIONS.screenPadding,
  },
  storeInfoSection: {
    marginBottom: 24,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  storeName: {
    fontSize: fontSizes['2xl'],
    fontWeight: '700',
    color: colors.gray[900],
    flex: 1,
    marginRight: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: fontSizes.base,
    color: colors.gray[600],
    marginLeft: 4,
    fontWeight: '600',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  distanceText: {
    fontSize: fontSizes.sm,
    color: colors.gray[600],
    marginLeft: 4,
  },
  categoryBadge: {
    backgroundColor: colors.primary[50],
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  categoryText: {
    fontSize: fontSizes.sm,
    color: colors.primary[600],
    fontWeight: '500',
  },
  description: {
    fontSize: fontSizes.base,
    color: colors.gray[700],
    lineHeight: 24,
    marginBottom: 12,
  },
  address: {
    fontSize: fontSizes.sm,
    color: colors.gray[600],
    lineHeight: 20,
  },
  rewardInfoCard: {
    backgroundColor: colors.primary[50],
    borderWidth: 1,
    borderColor: colors.primary[100],
    marginBottom: 24,
  },
  rewardInfoTitle: {
    fontSize: fontSizes.lg,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: 12,
  },
  rewardInfoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rewardAmountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rewardAmountText: {
    fontSize: fontSizes['2xl'],
    fontWeight: '700',
    color: colors.gray[900],
    marginLeft: 8,
  },
  timeSlotInfo: {
    alignItems: 'flex-end',
  },
  timeSlotName: {
    fontSize: fontSizes.base,
    fontWeight: '600',
    color: colors.primary[600],
    marginBottom: 4,
  },
  timeSlotDuration: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeSlotText: {
    fontSize: fontSizes.sm,
    color: colors.gray[600],
    marginLeft: 4,
  },
  timeSlotsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: fontSizes.lg,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: 16,
  },
  reservedInfoCard: {
    backgroundColor: colors.success[50],
    borderWidth: 1,
    borderColor: colors.success[200],
    marginBottom: 16,
  },
  reservedInfoContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reservedInfoText: {
    marginLeft: 12,
    flex: 1,
  },
  reservedInfoTitle: {
    fontSize: fontSizes.base,
    fontWeight: '600',
    color: colors.success[700],
    marginBottom: 2,
  },
  reservedInfoSubtitle: {
    fontSize: fontSizes.sm,
    color: colors.success[600],
  },
  timeSlotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeSlotButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    minWidth: 80,
    alignItems: 'center',
  },
  timeSlotButtonSelected: {
    backgroundColor: colors.primary[500],
    borderColor: colors.primary[500],
  },
  timeSlotButtonReserved: {
    backgroundColor: colors.gray[100],
    borderColor: colors.gray[300],
    opacity: 0.6,
  },
  timeSlotButtonText: {
    fontSize: fontSizes.sm,
    color: colors.gray[700],
    fontWeight: '500',
  },
  timeSlotButtonTextSelected: {
    color: colors.white,
    fontWeight: '600',
  },
  timeSlotButtonTextReserved: {
    color: colors.gray[400],
  },
  infoCard: {
    marginBottom: 24,
  },
  infoList: {
    gap: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: fontSizes.base,
    color: colors.gray[600],
    marginLeft: 12,
    flex: 1,
  },
  bottomSpace: {
    height: 80,
  },
  reserveButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    paddingHorizontal: DIMENSIONS.screenPadding,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
  },
  reserveButton: {
    width: '100%',
  },
});