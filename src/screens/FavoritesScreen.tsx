import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function FavoritesScreen(): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>お気に入り</Text>
      <Text style={styles.comingSoon}>近日公開予定...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  comingSoon: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});