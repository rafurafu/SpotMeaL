// App.tsx
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { AppNavigator } from './src/navigation/AppNavigator';
import { StoreProvider } from './src/contexts/StoreContext';
import { FavoritesProvider } from './src/contexts/FavoritesContext';
import { store } from './src/store';
import { colors } from './src/utils/constants';
import { loadAuthUser } from './src/utils/authStorage';
import { setUser } from './src/store/slices/authSlice';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

function AppContent() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // AsyncStorageから保存されたユーザー情報を取得
        const savedUser = await loadAuthUser();
        if (savedUser) {
          // ユーザー情報をReduxストアに復元
          store.dispatch(setUser(savedUser));
        }
      } catch (error) {
        console.error('Failed to restore auth state:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
      </View>
    );
  }

  return (
    <StoreProvider>
      <FavoritesProvider>
        <NavigationContainer>
          <StatusBar style="dark" backgroundColor={colors.surface} />
          <AppNavigator />
        </NavigationContainer>
      </FavoritesProvider>
    </StoreProvider>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});