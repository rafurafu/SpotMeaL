// src/components/store/StoreCard.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../ui/Card';
import { colors, spacing } from '../../utils/constants';
import { useFavorites } from '../../contexts/FavoritesContext';
import { getReservationByRestaurant } from '../../services/reservationService';

interface Store {
  id: string;
  name: string;
  category: string;
  image: any; // require()で取得した画像リソース
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
  const { isFavorite: checkIsFavorite, toggleFavorite } = useFavorites();
  const [isReserved, setIsReserved] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // 画像ソースの処理：require()で取得した画像リソースまたはURIオブジェクト
  const imageSource = typeof store.image === 'object' && store.image.uri
    ? { uri: store.image.uri }
    : store.image;

  const isFavorite = checkIsFavorite(store.id);

  // 予約状態をロード
  useEffect(() => {
    const loadReservationStatus = async () => {
      const reservation = await getReservationByRestaurant(store.id);
      setIsReserved(!!reservation);
    };
    loadReservationStatus();
  }, [store.id]);

  const handleFavoriteToggle = async (e: any) => {
    e.stopPropagation(); // カードのonPressを防ぐ

    try {
      await toggleFavorite(store.id);
    } catch (error) {
      Alert.alert('エラー', 'お気に入りの更新に失敗しました');
    }
  };

  return (
    <Card style={styles.cardContainer}>
      <TouchableOpacity onPress={() => onPress(store)} activeOpacity={0.8}>
        <View style={styles.imageContainer}>
          {imageLoading && (
            <View style={styles.imageLoadingContainer}>
              <ActivityIndicator size="large" color={colors.primary[500]} />
            </View>
          )}
          <Image
            source={imageSource}
            style={styles.storeImage}
            resizeMode="cover"
            onLoadStart={() => setImageLoading(true)}
            onLoadEnd={() => setImageLoading(false)}
            onError={() => setImageLoading(false)}
          />
          {/* いいねボタン */}
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={handleFavoriteToggle}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={24}
              color={isFavorite ? colors.error[500] : colors.white}
            />
          </TouchableOpacity>
          {/* 利用可能状態 */}
          {store.isAvailable && (
            <View style={[
              styles.availableBadge,
              isReserved && styles.unavailableBadge
            ]}>
              <Text style={styles.availableText}>
                {isReserved ? '受付終了' : '受付中'}
              </Text>
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
              <Ionicons name="star" size={16} color={colors.warning[500]} />
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
    width: '100%',
    height: 160,
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  availableBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: colors.success[500],
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  unavailableBadge: {
    backgroundColor: colors.gray[500],
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
    backgroundColor: colors.primary[500],
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: colors.primary[500],
  },
  categoryText: {
    fontSize: 12,
    color: colors.white,
    fontWeight: '600',
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
    color: colors.success[500],
    fontWeight: '500',
    marginLeft: 4,
  },
});