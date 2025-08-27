// src/screens/StoreDetailScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { colors, fontSizes, DIMENSIONS } from '../utils/constants';

// Navigation types
type RootStackParamList = {
  Home: undefined;
  StoreDetail: { store: Store };
  Reservation: { store: Store };
};

type StoreDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'StoreDetail'>;
type StoreDetailScreenRouteProp = RouteProp<RootStackParamList, 'StoreDetail'>;

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

export const StoreDetailScreen: React.FC = () => {
  const navigation = useNavigation<StoreDetailScreenNavigationProp>();
  const route = useRoute<StoreDetailScreenRouteProp>();
  const { store } = route.params;
  
  const currentTimeSlot = getCurrentTimeSlot();
  
  const timeSlots = [
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
    '18:00', '18:30', '19:00', '19:30', '20:00', '20:30'
  ];

  const handleReservation = () => {
    navigation.navigate('Reservation', { store });
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
        <TouchableOpacity style={styles.favoriteButton}>
          <Ionicons name="heart-outline" size={24} color={colors.gray[900]} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Store Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: store.image }}
            style={styles.storeImage}
            resizeMode="cover"
          />
          <View style={styles.rewardBadge}>
            <Ionicons name="diamond" size={20} color={colors.warning[500]} />
            <Text style={styles.rewardText}>¥{store.currentReward}</Text>
          </View>
          {store.isAvailable && (
            <View style={styles.availableBadge}>
              <Text style={styles.availableText}>受付中</Text>
            </View>
          )}
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
            <View style={styles.timeSlotsGrid}>
              {timeSlots.map((time) => (
                <TouchableOpacity key={time} style={styles.timeSlotButton}>
                  <Text style={styles.timeSlotButtonText}>{time}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Reservation Info */}
          <Card style={styles.infoCard}>
            <Text style={styles.sectionTitle}>予約について</Text>
            <View style={styles.infoList}>
              <View style={styles.infoItem}>
                <Ionicons name="people-outline" size={20} color={colors.gray[500]} />
                <Text style={styles.infoText}>1〜4名様まで予約可能</Text>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="time-outline" size={20} color={colors.gray[500]} />
                <Text style={styles.infoText}>予約は当日から3日先まで可能</Text>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="diamond-outline" size={20} color={colors.gray[500]} />
                <Text style={styles.infoText}>来店確認後、報酬が自動付与されます</Text>
              </View>
            </View>
          </Card>

          {/* Free Posts Remaining */}
          {store.freePostsRemaining > 0 && (
            <Card style={styles.freePostsCard}>
              <View style={styles.freePostsContent}>
                <Ionicons name="gift-outline" size={24} color={colors.success[500]} />
                <View style={styles.freePostsText}>
                  <Text style={styles.freePostsTitle}>無料掲載中</Text>
                  <Text style={styles.freePostsSubtitle}>
                    あと{store.freePostsRemaining}回無料で掲載できます
                  </Text>
                </View>
              </View>
            </Card>
          )}
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>

      {/* Reserve Button */}
      <View style={styles.reserveButtonContainer}>
        <Button 
          title={store.isAvailable ? '予約する' : '現在予約できません'}
          onPress={handleReservation}
          variant="primary"
          size="large"
          disabled={!store.isAvailable}
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
  favoriteButton: {
    padding: 4,
  },
  imageContainer: {
    position: 'relative',
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
  timeSlotButtonText: {
    fontSize: fontSizes.sm,
    color: colors.gray[700],
    fontWeight: '500',
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
  freePostsCard: {
    backgroundColor: colors.success[50],
    borderWidth: 1,
    borderColor: colors.success[100],
    marginBottom: 16,
  },
  freePostsContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  freePostsText: {
    marginLeft: 12,
    flex: 1,
  },
  freePostsTitle: {
    fontSize: fontSizes.base,
    fontWeight: '600',
    color: colors.success[700],
    marginBottom: 2,
  },
  freePostsSubtitle: {
    fontSize: fontSizes.sm,
    color: colors.success[600],
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