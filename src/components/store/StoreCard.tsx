// src/components/store/StoreCard.tsx
import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../ui/Card';
import { colors, spacing } from '../../utils/constants';

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

interface StoreCardProps {
  store: Store;
  onPress: (store: Store) => void;
}


export const StoreCard: React.FC<StoreCardProps> = ({ store, onPress }) => {
  return (
    <Card style={styles.cardContainer}>
      <TouchableOpacity onPress={() => onPress(store)} activeOpacity={0.8}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: store.image }}
            style={styles.storeImage}
            resizeMode="cover"
          />
          {/* 報酬バッジ */}
          <View style={styles.rewardBadge}>
            <Ionicons name="cash-outline" size={16} color={colors.warning} />
            <Text style={styles.rewardText}>¥{store.currentReward}</Text>
          </View>
          {/* 利用可能状態 */}
          {store.isAvailable && (
            <View style={styles.availableBadge}>
              <Text style={styles.availableText}>受付中</Text>
            </View>
          )}
        </View>

        <View style={styles.contentContainer}>
          {/* 店舗名とカテゴリ */}
          <View style={styles.titleRow}>
            <Text style={styles.storeName} numberOfLines={1}>
              {store.name}
            </Text>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{store.category}</Text>
            </View>
          </View>

          {/* 評価と距離 */}
          <View style={styles.metaRow}>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color={colors.warning} />
              <Text style={styles.ratingText}>{store.rating}</Text>
            </View>
            <View style={styles.distanceContainer}>
              <Ionicons name="location-outline" size={16} color={colors.textSecondary} />
              <Text style={styles.distanceText}>{store.distance}km</Text>
            </View>
          </View>

          {/* 説明 */}
          <Text style={styles.description} numberOfLines={2}>
            {store.description}
          </Text>

          {/* 無料投稿残り回数 */}
          {store.freePostsRemaining > 0 && (
            <View style={styles.freePostsContainer}>
              <Ionicons name="gift-outline" size={14} color={colors.success} />
              <Text style={styles.freePostsText}>
                あと{store.freePostsRemaining}回無料
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Card>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: spacing.md,
    marginVertical: 8,
    padding: 0,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
  },
  storeImage: {
    width: '100%',
    height: 160,
  },
  rewardBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  rewardText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 4,
  },
  availableBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: colors.success,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  availableText: {
    fontSize: 12,
    color: colors.surface,
    fontWeight: '600',
  },
  contentContainer: {
    padding: 16,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  storeName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
    marginRight: 8,
  },
  categoryBadge: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  categoryText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  ratingText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distanceText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 8,
  },
  freePostsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  freePostsText: {
    fontSize: 12,
    color: colors.success,
    fontWeight: '500',
    marginLeft: 4,
  },
});