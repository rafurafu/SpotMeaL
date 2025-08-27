// src/screens/HomeScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  FlatList,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StoreCard } from '../components/store/StoreCard';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { colors, fontSizes, DIMENSIONS } from '../utils/constants';

// Navigation types
type RootStackParamList = {
  Home: undefined;
  StoreDetail: { store: Store };
  Reservation: { store: Store };
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

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
    description: 'こだわりの食材を使った季節の和食をお楽しみください。落ち着いた雰囲気の店内でゆっくりとお食事をどうぞ。',
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
    description: '濃厚豚骨スープが自慢のラーメン店。深夜まで営業しているので、遅い時間でもお楽しみいただけます。',
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
    description: '新鮮な魚介を使った本格江戸前寿司。職人の技が光る逸品をカウンターでお楽しみください。',
    address: '東京都中央区銀座4-5-6',
    rating: 4.8,
    distance: 1.2,
    currentReward: getCurrentReward().amount,
    isAvailable: true,
    freePostsRemaining: 3,
  },
  {
    id: '4',
    name: 'カフェ・ド・パリ',
    category: 'カフェ',
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400',
    description: 'パリの街角にあるような雰囲気のカフェ。こだわりのコーヒーと手作りスイーツをご提供。',
    address: '東京都港区表参道3-4-7',
    rating: 4.3,
    distance: 0.5,
    currentReward: getCurrentReward().amount,
    isAvailable: true,
    freePostsRemaining: 0,
  },
];

const categories = ['全て', '和食', 'ラーメン', '寿司', 'カフェ', 'イタリアン'];

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('全て');
  const [stores, setStores] = useState<Store[]>(mockStores);
  const [refreshing, setRefreshing] = useState(false);
  const [currentReward, setCurrentReward] = useState(getCurrentReward());

  // 店舗選択時のハンドラー
  const handleStoreSelect = (store: Store) => {
    navigation.navigate('StoreDetail', { store });
  };

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
    setTimeout(() => {
      setCurrentReward(getCurrentReward());
      setRefreshing(false);
    }, 1000);
  };

  // 1分ごとに報酬情報を更新
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentReward(getCurrentReward());
    }, 60000);
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

  const renderStoreItem = ({ item }: { item: Store }) => (
    <StoreCard store={item} onPress={handleStoreSelect} />
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* 固定ヘッダー部分 */}
      <View style={styles.fixedSection}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.logoContainer}>
              <Image 
                source={require('../../assets/images/icon.png')}
                style={styles.logoImage}
              />
            </View>
            <View style={styles.headerText}>
              <Text style={styles.appTitle}>SpotMeal</Text>
              <Text style={styles.subtitle}>新しいお店を発見してお得に楽しもう</Text>
            </View>
          </View>
        </View>

        {/* 現在の報酬情報 */}
        <Card style={styles.rewardCard}>
          <View style={styles.rewardHeader}>
            <View style={styles.rewardInfo}>
              <Text style={styles.rewardTimeSlot}>{currentReward.timeSlot}</Text>
              <View style={styles.rewardAmount}>
                <Ionicons name="diamond" size={20} color={colors.warning} />
                <Text style={styles.rewardValue}>¥{currentReward.amount}</Text>
                <Text style={styles.rewardLabel}>来店報酬</Text>
              </View>
            </View>
            <View style={styles.rewardBadge}>
              <Text style={styles.rewardBadgeText}>現在</Text>
            </View>
          </View>
        </Card>

        {/* 検索バー */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={20} color={colors.gray[400]} />
            <TextInput
              style={styles.searchInput}
              placeholder="店名やカテゴリで検索"
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={colors.gray[400]}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color={colors.gray[400]} />
              </TouchableOpacity>
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
      </View>

      {/* スクロール可能な店舗リスト部分 */}
      <View style={styles.storeListContainer}>
        <View style={styles.storeListHeader}>
          <Text style={styles.storeListTitle}>
            おすすめの店舗 ({filteredStores.length}件)
          </Text>
        </View>
        
        {filteredStores.length > 0 ? (
          <FlatList
            data={filteredStores}
            renderItem={renderStoreItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.storeListContent}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        ) : (
          <ScrollView 
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            <Card style={styles.emptyState}>
              <View style={styles.emptyStateContent}>
                <Ionicons name="search" size={48} color={colors.gray[300]} />
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
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  fixedSection: {
    flexGrow: 0,
    flexShrink: 0,
  },
  header: {
    paddingHorizontal: DIMENSIONS.screenPadding,
    paddingVertical: 0,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    marginRight: 8,
  },
  logoImage: {
    width: 60,
    height: 60,
  },
  headerText: {
    flex: 1,
  },
  appTitle: {
    fontSize: fontSizes.xl,
    fontWeight: '700',
    color: colors.gray[900],
    marginBottom: 0,
  },
  subtitle: {
    fontSize: fontSizes.xs,
    color: colors.gray[600],
  },
  rewardCard: {
    marginHorizontal: DIMENSIONS.screenPadding,
    marginTop: 0,
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
    fontSize: fontSizes.xs,
    color: colors.primary,
    marginBottom: 4,
  },
  rewardAmount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rewardValue: {
    fontSize: fontSizes.lg,
    fontWeight: '700',
    color: colors.gray[900],
    marginLeft: 6,
  },
  rewardLabel: {
    fontSize: fontSizes.xs,
    color: colors.gray[600],
    marginLeft: 6,
  },
  rewardBadge: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  rewardBadgeText: {
    fontSize: fontSizes.xs,
    color: colors.white,
    fontWeight: '600',
  },
  searchContainer: {
    paddingHorizontal: DIMENSIONS.screenPadding,
    paddingTop: 8,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: DIMENSIONS.buttonRadius,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  searchInput: {
    flex: 1,
    fontSize: fontSizes.base,
    color: colors.gray[900],
    marginLeft: 8,
  },
  categoryContainer: {
    paddingTop: 8,
  },
  categoryTitle: {
    fontSize: fontSizes.sm,
    fontWeight: '600',
    color: colors.gray[900],
    paddingHorizontal: DIMENSIONS.screenPadding,
    marginBottom: 6,
  },
  categoryScrollContent: {
    paddingHorizontal: DIMENSIONS.screenPadding,
  },
  categoryButton: {
    minWidth: 60,
    marginRight: 8,
  },
  storeListContainer: {
    flex: 1,
    paddingTop: 12,
  },
  storeListContent: {
    paddingBottom: 100,
  },
  storeListHeader: {
    paddingHorizontal: DIMENSIONS.screenPadding,
    marginBottom: 8,
  },
  storeListTitle: {
    fontSize: fontSizes.sm,
    fontWeight: '600',
    color: colors.gray[900],
  },
  emptyState: {
    marginHorizontal: DIMENSIONS.screenPadding,
  },
  emptyStateContent: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyStateTitle: {
    fontSize: fontSizes.lg,
    fontWeight: '600',
    color: colors.gray[700],
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateDescription: {
    fontSize: fontSizes.base,
    color: colors.gray[500],
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