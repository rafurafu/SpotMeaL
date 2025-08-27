// src/screens/HomeScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StoreCard } from '../components/store/StoreCard';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { colors, spacing } from '../utils/constants';

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

interface HomeScreenProps {
  onStoreSelect?: (store: Store) => void;
  navigation?: any;
  route?: any;
}

// 現在の時間帯に基づく報酬を取得する関数
const getCurrentReward = (): { amount: number; timeSlot: string } => {
  const now = new Date();
  const hour = now.getHours() + now.getMinutes() / 60;
  
  if (hour >= 14 && hour < 17) {
    return { amount: 150, timeSlot: 'アイドルタイム (14:00-17:00)' };
  } else if (hour >= 17 && hour < 19) {
    return { amount: 120, timeSlot: '平日夜早め (17:00-19:00)' };
  } else if (hour >= 12 && hour < 13.5) {
    return { amount: 80, timeSlot: 'ピーク時 (12:00-13:30)' };
  } else {
    return { amount: 100, timeSlot: '通常時間' };
  }
};

// モックデータ
const mockStores: Store[] = [
  {
    id: '1',
    name: '和食処 さくら',
    category: '和食',
    image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
    description: 'こだわりの食材を使った季節の和食をお楽しみください。',
    address: '東京都渋谷区神宮前1-2-3',
    rating: 4.5,
    distance: 0.3,
    currentReward: getCurrentReward().amount,
    isAvailable: true,
    freePostsRemaining: 2,
  },
  {
    id: '2',
    name: 'ラーメン横丁',
    category: 'ラーメン',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400',
    description: '濃厚豚骨スープが自慢のラーメン店。',
    address: '東京都新宿区歌舞伎町2-1-5',
    rating: 4.2,
    distance: 0.8,
    currentReward: getCurrentReward().amount,
    isAvailable: true,
    freePostsRemaining: 1,
  },
  {
    id: '3',
    name: '寿司 一心',
    category: '寿司',
    image: 'https://images.unsplash.com/photo-1563612116625-3012372fccce?w=400',
    description: '新鮮な魚介を使った本格江戸前寿司。',
    address: '東京都中央区銀座4-5-6',
    rating: 4.8,
    distance: 1.2,
    currentReward: getCurrentReward().amount,
    isAvailable: true,
    freePostsRemaining: 3,
  },
];

const categories = ['全て', '和食', 'ラーメン', '寿司', 'カフェ', 'イタリアン'];

export const HomeScreen: React.FC<HomeScreenProps> = ({ onStoreSelect, navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('全て');
  const [stores] = useState<Store[]>(mockStores);
  const [refreshing, setRefreshing] = useState(false);
  const [currentReward, setCurrentReward] = useState(getCurrentReward());

  // フィルタリングされた店舗リスト
  const filteredStores = stores.filter(store => {
    const matchesSearch = store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         store.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === '全て' || store.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // 引っ張って更新
  const onRefresh = async () => {
    setRefreshing(true);
    // APIから最新データを取得する処理
    setTimeout(() => {
      setCurrentReward(getCurrentReward());
      setRefreshing(false);
    }, 1000);
  };

  // 1分ごとに報酬情報を更新
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentReward(getCurrentReward());
    }, 60000); // 1分

    return () => clearInterval(interval);
  }, []);

  const renderCategoryButton = (category: string) => (
    <Button
      key={category}
      title={category}
      onPress={() => setSelectedCategory(category)}
      variant={selectedCategory === category ? 'primary' : 'outline'}
      size="small"
      style={styles.categoryButton}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.appTitle}>SpotMeal</Text>
          <Text style={styles.subtitle}>新しいお店を発見してお得に楽しもう</Text>
        </View>

        {/* 現在の報酬情報 */}
        <Card style={styles.rewardCard}>
          <View style={styles.rewardHeader}>
            <View style={styles.rewardInfo}>
              <Text style={styles.rewardTimeSlot}>{currentReward.timeSlot}</Text>
              <View style={styles.rewardAmount}>
                <Ionicons name="cash-outline" size={24} color={colors.warning} />
                <Text style={styles.rewardValue}>¥{currentReward.amount}</Text>
                <Text style={styles.rewardLabel}>来店報酬</Text>
              </View>
            </View>
            <View style={styles.rewardBadge}>
              <Text style={styles.rewardBadgeText}>今すぐ</Text>
            </View>
          </View>
        </Card>

        {/* 検索バー */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={20} color={colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="店名やカテゴリで検索"
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={colors.textSecondary}
            />
            {searchQuery.length > 0 && (
              <Button
                title="×"
                onPress={() => setSearchQuery('')}
                variant="outline"
                size="small"
                style={styles.clearButton}
              />
            )}
          </View>
        </View>

        {/* カテゴリフィルター */}
        <View style={styles.categoryContainer}>
          <Text style={styles.categoryTitle}>カテゴリ</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScrollContent}
          >
            {categories.map(renderCategoryButton)}
          </ScrollView>
        </View>

        {/* 店舗リスト */}
        <View style={styles.storeListContainer}>
          <View style={styles.storeListHeader}>
            <Text style={styles.storeListTitle}>
              おすすめの店舗 ({filteredStores.length}件)
            </Text>
            {selectedCategory !== '全て' && (
              <Button
                title="フィルターをクリア"
                onPress={() => setSelectedCategory('全て')}
                variant="outline"
                size="small"
              />
            )}
          </View>
          
          {filteredStores.length > 0 ? (
            filteredStores.map((store) => (
              <StoreCard
                key={store.id}
                store={store}
                onPress={(store) => {
                  if (onStoreSelect) {
                    onStoreSelect(store);
                  } else if (navigation) {
                    navigation.navigate('StoreDetail', { store });
                  }
                }}
              />
            ))
          ) : (
            <Card style={styles.emptyState}>
              <View style={styles.emptyStateContent}>
                <Ionicons name="search" size={48} color={colors.textSecondary} />
                <Text style={styles.emptyStateTitle}>店舗が見つかりませんでした</Text>
                <Text style={styles.emptyStateDescription}>
                  検索条件を変更してお試しください
                </Text>
                <Button
                  title="検索条件をリセット"
                  onPress={() => {
                    setSearchQuery('');
                    setSelectedCategory('全て');
                  }}
                  variant="primary"
                  size="medium"
                  style={styles.resetButton}
                />
              </View>
            </Card>
          )}
        </View>

        {/* 底部のスペース */}
        <View style={styles.bottomSpace} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.md,
    backgroundColor: colors.surface,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  rewardCard: {
    marginHorizontal: spacing.md,
    marginTop: 16,
    backgroundColor: colors.background,
  },
  rewardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rewardInfo: {
    flex: 1,
  },
  rewardTimeSlot: {
    fontSize: 14,
    color: colors.primary,
    marginBottom: 8,
  },
  rewardAmount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rewardValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginLeft: 8,
  },
  rewardLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  rewardBadge: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  rewardBadgeText: {
    fontSize: 14,
    color: colors.surface,
    fontWeight: '600',
  },
  searchContainer: {
    paddingHorizontal: spacing.md,
    paddingTop: 20,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    marginLeft: 8,
  },
  clearButton: {
    minHeight: 28,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  categoryContainer: {
    paddingTop: 20,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    paddingHorizontal: spacing.md,
    marginBottom: 12,
  },
  categoryScrollContent: {
    paddingHorizontal: spacing.md,
    gap: 8,
  },
  categoryButton: {
    marginRight: 0,
  },
  storeListContainer: {
    paddingTop: 24,
  },
  storeListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    marginBottom: 16,
  },
  storeListTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  emptyState: {
    marginHorizontal: spacing.md,
  },
  emptyStateContent: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateDescription: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  resetButton: {
    minWidth: 160,
  },
  bottomSpace: {
    height: 100,
  },
});