import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useStoreContext, Store } from '../contexts/StoreContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { StoreCard } from '../components/store/StoreCard';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { colors, fontSizes, DIMENSIONS } from '../utils/constants';

type RootStackParamList = {
  Home: undefined;
  StoreDetail: { store: Store };
  Favorites: undefined;
  Profile: undefined;
};

type FavoritesScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Favorites'>;

export default function FavoritesScreen(): React.JSX.Element {
  const navigation = useNavigation<FavoritesScreenNavigationProp>();
  const { stores, loading: storesLoading, refreshStores } = useStoreContext();
  const { getFavoriteStores, loading: favoritesLoading } = useFavorites();
  const [refreshing, setRefreshing] = React.useState(false);

  const favoriteStores = getFavoriteStores(stores);
  const loading = storesLoading || favoritesLoading;

  const handleStoreSelect = (store: Store) => {
    navigation.navigate('StoreDetail', { store });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshStores();
    } catch (error) {
      console.error('Failed to refresh stores:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const renderStoreItem = ({ item }: { item: Store }) => (
    <StoreCard store={item} onPress={handleStoreSelect} />
  );

  const renderEmptyState = () => (
    <Card style={styles.emptyState}>
      <View style={styles.emptyStateContent}>
        <Ionicons name="heart-outline" size={64} color={colors.gray[300]} />
        <Text style={styles.emptyStateTitle}>お気に入りがありません</Text>
        <Text style={styles.emptyStateDescription}>
          気になる店舗をお気に入りに追加して、
          {'\n'}
          いつでも簡単にアクセスできるようにしましょう
        </Text>
        <Button
          title="店舗を探す"
          onPress={() => navigation.navigate('Home')}
          variant="primary"
          size="medium"
          style={styles.exploreButton}
        />
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.gray[900]} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>お気に入り</Text>
          <View style={styles.headerRight} />
        </View>

        {/* Content */}
        {loading && favoriteStores.length === 0 ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>読み込み中...</Text>
          </View>
        ) : favoriteStores.length > 0 ? (
          <View style={styles.content}>
            <View style={styles.countContainer}>
              <Text style={styles.countText}>
                {favoriteStores.length}件のお気に入り
              </Text>
            </View>
            <FlatList
              data={favoriteStores}
              renderItem={renderStoreItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            />
          </View>
        ) : (
          <View style={styles.content}>
            {renderEmptyState()}
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: DIMENSIONS.screenPadding,
    paddingVertical: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: fontSizes.xl,
    fontWeight: '700',
    color: colors.gray[900],
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  countContainer: {
    paddingHorizontal: DIMENSIONS.screenPadding,
    paddingVertical: 12,
  },
  countText: {
    fontSize: fontSizes.sm,
    fontWeight: '600',
    color: colors.gray[900],
  },
  listContent: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: fontSizes.base,
    color: colors.gray[600],
  },
  emptyState: {
    marginHorizontal: DIMENSIONS.screenPadding,
    marginTop: 60,
  },
  emptyStateContent: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyStateTitle: {
    fontSize: fontSizes.xl,
    fontWeight: '700',
    color: colors.gray[700],
    marginTop: 24,
    marginBottom: 12,
  },
  emptyStateDescription: {
    fontSize: fontSizes.base,
    color: colors.gray[500],
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  exploreButton: {
    minWidth: 160,
  },
});