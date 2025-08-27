import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Alert,
  TouchableOpacity,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { colors, fontSizes, DIMENSIONS } from '../utils/constants';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

type RootStackParamList = {
  StoreDetail: { store: Store };
};

type MapScreenNavigationProp = StackNavigationProp<RootStackParamList>;

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
  latitude: number;
  longitude: number;
}

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
    currentReward: 150,
    isAvailable: true,
    freePostsRemaining: 2,
    latitude: 35.6665,
    longitude: 139.7026,
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
    currentReward: 120,
    isAvailable: true,
    freePostsRemaining: 1,
    latitude: 35.6938,
    longitude: 139.7034,
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
    currentReward: 180,
    isAvailable: true,
    freePostsRemaining: 3,
    latitude: 35.6724,
    longitude: 139.7640,
  },
  {
    id: '4',
    name: 'カフェ・ド・パリ',
    category: 'カフェ',
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400',
    description: 'パリの街角にあるような雰囲気のカフェ。',
    address: '東京都港区表参道3-4-7',
    rating: 4.3,
    distance: 0.5,
    currentReward: 100,
    isAvailable: true,
    freePostsRemaining: 0,
    latitude: 35.6656,
    longitude: 139.7123,
  },
];

export const MapScreen: React.FC = () => {
  const navigation = useNavigation<MapScreenNavigationProp>();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [mapProvider, setMapProvider] = useState(PROVIDER_DEFAULT);
  const [showProviderMenu, setShowProviderMenu] = useState(false);

  useEffect(() => {
    (async () => {
      // 保存されたマッププロバイダーを読み込み
      try {
        const savedProvider = await AsyncStorage.getItem('mapProvider');
        if (savedProvider) {
          setMapProvider(savedProvider);
        }
      } catch (error) {
        console.log('マッププロバイダーの読み込みに失敗:', error);
      }

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('位置情報へのアクセスが拒否されました');
        return;
      }

      try {
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
      } catch (error) {
        setErrorMsg('位置情報の取得に失敗しました');
      }
    })();
  }, []);

  const handleStorePress = (store: Store) => {
    setSelectedStore(store);
  };

  const handleStoreDetailPress = () => {
    if (selectedStore) {
      navigation.navigate('StoreDetail', { store: selectedStore });
    }
  };

  const getMarkerColor = (category: string): string => {
    switch (category) {
      case '和食': return '#4CAF50';
      case 'ラーメン': return '#FF9800';
      case '寿司': return '#2196F3';
      case 'カフェ': return '#9C27B0';
      default: return colors.primary;
    }
  };

  const getProviderName = (provider: any): string => {
    switch (provider) {
      case PROVIDER_GOOGLE: return 'Google Maps';
      case PROVIDER_DEFAULT: return 'デフォルト';
      default: return 'デフォルト';
    }
  };

  const handleProviderChange = async (provider: any) => {
    setMapProvider(provider);
    setShowProviderMenu(false);
    
    // 選択したプロバイダーを保存
    try {
      await AsyncStorage.setItem('mapProvider', provider);
    } catch (error) {
      console.log('マッププロバイダーの保存に失敗:', error);
    }
  };

  const defaultRegion = {
    latitude: 35.6762,
    longitude: 139.6503,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const currentRegion = location ? {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  } : defaultRegion;

  if (errorMsg) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="location-outline" size={64} color={colors.gray[300]} />
          <Text style={styles.errorTitle}>位置情報が利用できません</Text>
          <Text style={styles.errorText}>{errorMsg}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => {
              setErrorMsg(null);
              // 位置情報の再取得を試行
            }}
          >
            <Text style={styles.retryButtonText}>再試行</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={() => setShowProviderMenu(false)}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>近くの店舗</Text>
          <View style={styles.headerButtons}>
            <TouchableOpacity 
              style={styles.providerButton}
              onPress={() => setShowProviderMenu(!showProviderMenu)}
            >
              <Ionicons name="layers" size={20} color={colors.primary} />
              <Text style={styles.providerButtonText}>{getProviderName(mapProvider)}</Text>
              <Ionicons name="chevron-down" size={16} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.locationButton}>
              <Ionicons name="locate" size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

      {showProviderMenu && (
        <View style={styles.providerMenu}>
          <TouchableOpacity 
            style={[styles.providerMenuItem, mapProvider === PROVIDER_DEFAULT && styles.providerMenuItemActive]}
            onPress={() => handleProviderChange(PROVIDER_DEFAULT)}
          >
            <Ionicons name="checkmark" size={16} color={mapProvider === PROVIDER_DEFAULT ? colors.primary : 'transparent'} />
            <Text style={[styles.providerMenuText, mapProvider === PROVIDER_DEFAULT && styles.providerMenuTextActive]}>
              デフォルト (無料)
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.providerMenuItem, mapProvider === PROVIDER_GOOGLE && styles.providerMenuItemActive]}
            onPress={() => handleProviderChange(PROVIDER_GOOGLE)}
          >
            <Ionicons name="checkmark" size={16} color={mapProvider === PROVIDER_GOOGLE ? colors.primary : 'transparent'} />
            <Text style={[styles.providerMenuText, mapProvider === PROVIDER_GOOGLE && styles.providerMenuTextActive]}>
              Google Maps (有料)
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <MapView
        style={styles.map}
        provider={mapProvider}
        region={currentRegion}
        showsUserLocation={true}
        showsMyLocationButton={false}
        showsCompass={true}
        zoomEnabled={true}
        scrollEnabled={true}
      >
        {mockStores.map((store) => (
          <Marker
            key={store.id}
            coordinate={{
              latitude: store.latitude,
              longitude: store.longitude,
            }}
            onPress={() => handleStorePress(store)}
            pinColor={getMarkerColor(store.category)}
          >
            <View style={[styles.customMarker, { borderColor: getMarkerColor(store.category) }]}>
              <Ionicons name="restaurant" size={16} color={getMarkerColor(store.category)} />
            </View>
          </Marker>
        ))}
      </MapView>

      {selectedStore && (
        <View style={styles.storeInfoCard}>
          <View style={styles.storeInfoHeader}>
            <View style={styles.storeBasicInfo}>
              <Text style={styles.storeName}>{selectedStore.name}</Text>
              <Text style={styles.storeCategory}>{selectedStore.category}</Text>
              <View style={styles.storeDetails}>
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={14} color={colors.warning} />
                  <Text style={styles.rating}>{selectedStore.rating}</Text>
                </View>
                <Text style={styles.distance}>{selectedStore.distance}km</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setSelectedStore(null)}
            >
              <Ionicons name="close" size={20} color={colors.gray[500]} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.rewardInfo}>
            <Ionicons name="diamond" size={16} color={colors.warning} />
            <Text style={styles.rewardText}>¥{selectedStore.currentReward} 来店報酬</Text>
          </View>

          <TouchableOpacity 
            style={styles.detailButton}
            onPress={handleStoreDetailPress}
          >
            <Text style={styles.detailButtonText}>詳細を見る</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.white} />
          </TouchableOpacity>
        </View>
      )}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: DIMENSIONS.screenPadding,
    paddingVertical: 12,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  headerTitle: {
    fontSize: fontSizes.lg,
    fontWeight: '600',
    color: colors.gray[900],
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  providerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.gray[100],
    borderRadius: 8,
    marginRight: 8,
  },
  providerButtonText: {
    fontSize: fontSizes.sm,
    color: colors.primary,
    marginHorizontal: 4,
    fontWeight: '500',
  },
  locationButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.gray[100],
  },
  providerMenu: {
    position: 'absolute',
    top: 60,
    right: DIMENSIONS.screenPadding,
    backgroundColor: colors.white,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
    minWidth: 160,
  },
  providerMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
  },
  providerMenuItemActive: {
    backgroundColor: colors.primary + '10',
  },
  providerMenuText: {
    fontSize: fontSizes.sm,
    color: colors.gray[700],
    marginLeft: 8,
  },
  providerMenuTextActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  map: {
    flex: 1,
  },
  customMarker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.white,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  storeInfoCard: {
    position: 'absolute',
    bottom: 20,
    left: DIMENSIONS.screenPadding,
    right: DIMENSIONS.screenPadding,
    backgroundColor: colors.white,
    borderRadius: DIMENSIONS.cardRadius,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  storeInfoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  storeBasicInfo: {
    flex: 1,
  },
  storeName: {
    fontSize: fontSizes.lg,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: 4,
  },
  storeCategory: {
    fontSize: fontSizes.sm,
    color: colors.primary,
    marginBottom: 8,
  },
  storeDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  rating: {
    fontSize: fontSizes.sm,
    color: colors.gray[700],
    marginLeft: 4,
  },
  distance: {
    fontSize: fontSizes.sm,
    color: colors.gray[500],
  },
  closeButton: {
    padding: 4,
  },
  rewardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.warning + '10',
    borderRadius: 8,
  },
  rewardText: {
    fontSize: fontSizes.sm,
    fontWeight: '600',
    color: colors.gray[800],
    marginLeft: 6,
  },
  detailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: DIMENSIONS.buttonRadius,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  detailButtonText: {
    fontSize: fontSizes.base,
    fontWeight: '600',
    color: colors.white,
    marginRight: 6,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorTitle: {
    fontSize: fontSizes.xl,
    fontWeight: '600',
    color: colors.gray[700],
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  errorText: {
    fontSize: fontSizes.base,
    color: colors.gray[500],
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: DIMENSIONS.buttonRadius,
  },
  retryButtonText: {
    fontSize: fontSizes.base,
    fontWeight: '600',
    color: colors.white,
  },
});