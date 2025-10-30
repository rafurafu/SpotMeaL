// src/screens/HomeScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
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
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StoreCard } from '../components/store/StoreCard';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { colors, fontSizes, DIMENSIONS } from '../utils/constants';
import { useStoreContext, Store } from '../contexts/StoreContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { getCurrentReward } from '../services/restaurantService';

// Navigation types
type RootStackParamList = {
  Home: undefined;
  StoreDetail: { store: Store };
  Reservation: { store: Store };
  Profile: undefined;
  Favorites: undefined;
  StoreRegistration: undefined;
  QRScan: { reservationId: string };
  Map: { store: Store };
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const categories = ['全て', '和食', 'ラーメン', '寿司', 'カフェ', 'イタリアン'];

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { stores, loading, refreshStores } = useStoreContext();
  const { favorites } = useFavorites();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('全て');
  const [refreshing, setRefreshing] = useState(false);
  const [currentReward, setCurrentReward] = useState(getCurrentReward());
  
  // スクロールアニメーション用
  const scrollY = useRef(new Animated.Value(0)).current;
  
  // ヘッダー全体（ロゴ・アプリ名・サブタイトル）の透明度
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });
  
  // ヘッダー全体の高さ
  const headerContentHeight = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [80, 0],
    extrapolate: 'clamp',
  });
  
  // 報酬カードの透明度
  const hideableOpacity = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });
  
  // 報酬カードの高さ
  const rewardCardHeight = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [80, 0],
    extrapolate: 'clamp',
  });

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
    try {
      await refreshStores();
      setCurrentReward(getCurrentReward());
    } catch (error) {
      console.error('Failed to refresh stores:', error);
    } finally {
      setRefreshing(false);
    }
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
    <View style={styles.container}>
      <SafeAreaView style={styles.safeAreaTop}>
        {/* 固定ヘッダー部分 */}
        <View style={styles.fixedSection}>
          {/* Header */}
          <Animated.View style={[
            styles.header,
            { 
              height: headerContentHeight,
              opacity: headerOpacity,
              overflow: 'hidden'
            }
          ]}>
            <View style={styles.headerContent}>
              <View style={styles.logoContainer}>
                <Image 
                  source={require('../../assets/images/icon.png')}
                  style={styles.logoImage}
                />
              </View>
              <View style={styles.headerText}>
                <Text style={styles.appTitle}>
                  SpotMeal
                </Text>
                <Text style={styles.subtitle}>
                  新しいお店を発見してお得に楽しもう
                </Text>
              </View>
              <View style={styles.headerActions}>
                <TouchableOpacity
                  style={styles.headerButton}
                  onPress={() => {
                    if (stores.length > 0) {
                      navigation.navigate('Map', { store: stores[0] });
                    }
                  }}
                  disabled={stores.length === 0}
                >
                  <Ionicons name="map-outline" size={24} color={stores.length > 0 ? colors.gray[600] : colors.gray[400]} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.headerButton, styles.favoriteButtonContainer]}
                  onPress={() => navigation.navigate('Favorites')}
                >
                  <Ionicons
                    name={favorites.length > 0 ? "heart" : "heart-outline"}
                    size={24}
                    color={favorites.length > 0 ? colors.error[500] : colors.gray[600]}
                  />
                  {favorites.length > 0 && (
                    <View style={styles.favoriteBadge}>
                      <Text style={styles.favoriteBadgeText}>
                        {favorites.length > 99 ? '99+' : favorites.length}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>

          {/* 現在の報酬情報 */}
          <Animated.View style={{ 
            height: rewardCardHeight, 
            opacity: hideableOpacity,
            overflow: 'hidden'
          }}>
            <Card style={styles.rewardCard}>
              <View style={styles.rewardHeader}>
                <View style={styles.rewardInfo}>
                  <Text style={styles.rewardTimeSlot}>{currentReward.timeSlot}</Text>
                  <View style={styles.rewardAmount}>
                    <Ionicons name="diamond" size={20} color={colors.warning[500]} />
                    <Text style={styles.rewardValue}>¥{currentReward.amount}</Text>
                    <Text style={styles.rewardLabel}>来店報酬</Text>
                  </View>
                </View>
                <View style={styles.rewardBadge}>
                  <Text style={styles.rewardBadgeText}>現在</Text>
                </View>
              </View>
            </Card>
          </Animated.View>

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
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>店舗情報を読み込み中...</Text>
          </View>
        ) : filteredStores.length > 0 ? (
          <FlatList
            data={filteredStores}
            renderItem={renderStoreItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.storeListContent}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: false }
            )}
            scrollEventThrottle={16}
          />
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: false }
            )}
            scrollEventThrottle={16}
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

      {/* Bottom Navigation */}
      <View style={styles.bottomNavigation}>
        <TouchableOpacity 
          style={styles.bottomNavItem}
          onPress={() => navigation.navigate('Home')}
        >
          <Ionicons name="home" size={24} color={colors.primary[500]} />
          <Text style={styles.bottomNavText}>ホーム</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.bottomNavItem}
          onPress={() => navigation.navigate('StoreRegistration')}
        >
          <Ionicons name="add-circle-outline" size={24} color={colors.gray[500]} />
          <Text style={styles.bottomNavText}>店舗掲載</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.bottomNavItem}
          onPress={() => navigation.navigate('QRScan', { reservationId: 'demo' })}
        >
          <Ionicons name="qr-code-outline" size={24} color={colors.gray[500]} />
          <Text style={styles.bottomNavText}>QRスキャン</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.bottomNavItem}
          onPress={() => navigation.navigate('Favorites')}
        >
          <Ionicons name="heart-outline" size={24} color={colors.gray[500]} />
          <Text style={styles.bottomNavText}>お気に入り</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.bottomNavItem}
          onPress={() => navigation.navigate('Profile')}
        >
          <Ionicons name="person-outline" size={24} color={colors.gray[500]} />
          <Text style={styles.bottomNavText}>プロフィール</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  safeAreaTop: {
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: 8,
    marginLeft: 4,
  },
  favoriteButtonContainer: {
    position: 'relative',
  },
  favoriteBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: colors.error[500],
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: colors.white,
  },
  favoriteBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.white,
  },
  bottomNavigation: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    paddingTop: 12,
    paddingHorizontal: 8,
    paddingBottom: 34,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  bottomNavItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  bottomNavText: {
    fontSize: fontSizes.xs,
    color: colors.gray[500],
    fontWeight: '500',
    marginTop: 4,
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
    color: colors.primary[500],
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
    backgroundColor: colors.primary[500],
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
    paddingBottom: 120,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    fontSize: fontSizes.base,
    color: colors.gray[600],
    marginTop: 12,
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