import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { StripeProvider } from '@stripe/stripe-react-native';
import { store } from './src/store';
import AppNavigator from './src/navigation/AppNavigator';
import { stripeService } from './src/services/stripeService';

// TODO: Replace with your actual Stripe publishable key
const STRIPE_PUBLISHABLE_KEY = 'pk_test_your_key_here';

export default function App(): React.JSX.Element {
  useEffect(() => {
    // Initialize Stripe
    stripeService.initialize(STRIPE_PUBLISHABLE_KEY);
  }, []);

  return (
    <Provider store={store}>
      <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
        <AppNavigator />
        <StatusBar style="auto" />
      </StripeProvider>
    </Provider>
  );
}