// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { AppNavigator } from './src/navigation/AppNavigator';
import { StoreProvider } from './src/contexts/StoreContext';
import { store } from './src/store';
import { colors } from './src/utils/constants';

export default function App() {
  return (
    <Provider store={store}>
      <StoreProvider>
        <NavigationContainer>
          <StatusBar style="dark" backgroundColor={colors.surface} />
          <AppNavigator />
        </NavigationContainer>
      </StoreProvider>
    </Provider>
  );
}