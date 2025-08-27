import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'RestaurantDetail'>;

export default function RestaurantDetailScreen({ route }: Props): React.JSX.Element {
  const { restaurant } = route.params;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.name}>{restaurant.name}</Text>
        <Text style={styles.rating}>⭐ {restaurant.rating}</Text>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.description}>{restaurant.description}</Text>
        <Text style={styles.price}>価格帯: ¥{restaurant.price}</Text>
        <Text style={styles.address}>{restaurant.location.address}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.orderButton}>
          <Text style={styles.orderButtonText}>注文する</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    backgroundColor: '#f8f9fa',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  rating: {
    fontSize: 18,
    color: '#FF6B35',
  },
  content: {
    padding: 20,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 15,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  address: {
    fontSize: 14,
    color: '#999',
  },
  actions: {
    padding: 20,
  },
  orderButton: {
    backgroundColor: '#FF6B35',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  orderButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});