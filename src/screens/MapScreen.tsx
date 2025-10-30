// src/screens/MapScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { colors, fontSizes, DIMENSIONS } from '../utils/constants';
import { Store } from '../contexts/StoreContext';

// Navigation types
type RootStackParamList = {
  Home: undefined;
  Map: { store: Store };
  StoreDetail: { store: Store };
};

type MapScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Map'>;
type MapScreenRouteProp = RouteProp<RootStackParamList, 'Map'>;

export const MapScreen: React.FC = () => {
  const navigation = useNavigation<MapScreenNavigationProp>();
  const route = useRoute<MapScreenRouteProp>();
  const { store } = route.params;
  const [mapReady, setMapReady] = useState(false);

  const handleBack = () => {
    navigation.goBack();
  };

  // 店舗の座標（デフォルトは東京の座標を使用）
  const storeLocation = {
    latitude: store.latitude || 35.6812,
    longitude: store.longitude || 139.7671,
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.gray[900]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>店舗の場所</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Map */}
      <View style={styles.mapContainer}>
        {!mapReady && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary[500]} />
            <Text style={styles.loadingText}>地図を読み込み中...</Text>
          </View>
        )}
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: storeLocation.latitude,
            longitude: storeLocation.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          onMapReady={() => setMapReady(true)}
        >
          <Marker
            coordinate={storeLocation}
            title={store.name}
            description={store.address}
          >
            <View style={styles.markerContainer}>
              <View style={styles.marker}>
                <Ionicons name="restaurant" size={20} color={colors.white} />
              </View>
            </View>
          </Marker>
        </MapView>
      </View>

      {/* Store Info Card */}
      <View style={styles.storeInfoCard}>
        <View style={styles.storeInfoContent}>
          <View style={styles.storeIcon}>
            <Ionicons name="restaurant-outline" size={24} color={colors.primary[500]} />
          </View>
          <View style={styles.storeTextContainer}>
            <Text style={styles.storeName}>{store.name}</Text>
            <View style={styles.addressRow}>
              <Ionicons name="location-outline" size={16} color={colors.gray[500]} />
              <Text style={styles.storeAddress}>{store.address}</Text>
            </View>
            <View style={styles.distanceRow}>
              <Ionicons name="walk-outline" size={16} color={colors.gray[500]} />
              <Text style={styles.distanceText}>約 {store.distance}km</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          style={styles.detailButton}
          onPress={() => navigation.navigate('StoreDetail', { store })}
        >
          <Text style={styles.detailButtonText}>詳細を見る</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.white} />
        </TouchableOpacity>
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
  placeholder: {
    width: 32,
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.gray[50],
    zIndex: 1,
  },
  loadingText: {
    marginTop: 12,
    fontSize: fontSizes.base,
    color: colors.gray[600],
  },
  markerContainer: {
    alignItems: 'center',
  },
  marker: {
    backgroundColor: colors.primary[500],
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  storeInfoCard: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  storeInfoContent: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  storeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  storeTextContainer: {
    flex: 1,
  },
  storeName: {
    fontSize: fontSizes.lg,
    fontWeight: '700',
    color: colors.gray[900],
    marginBottom: 4,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  storeAddress: {
    fontSize: fontSizes.sm,
    color: colors.gray[600],
    marginLeft: 4,
    flex: 1,
  },
  distanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distanceText: {
    fontSize: fontSizes.sm,
    color: colors.gray[600],
    marginLeft: 4,
  },
  detailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary[500],
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  detailButtonText: {
    fontSize: fontSizes.base,
    fontWeight: '600',
    color: colors.white,
    marginRight: 4,
  },
});
