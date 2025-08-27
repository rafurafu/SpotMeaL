// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { AppNavigator } from './src/navigation/AppNavigator';
import { colors } from './src/utils/constants';

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="dark" backgroundColor={colors.surface} />
      <AppNavigator />
    </NavigationContainer>
  );
}