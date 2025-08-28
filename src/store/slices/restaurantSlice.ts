import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Restaurant } from '../../types';

interface StoreRegistrationData {
  name: string;
  category: string;
  description: string;
  address: string;
  image: string;
  contactEmail: string;
  contactPhone: string;
}

interface RestaurantState {
  restaurants: Restaurant[];
  selectedRestaurant: Restaurant | null;
  loading: boolean;
  error: string | null;
  storeRegistration: {
    isSubmitting: boolean;
    submissionStatus: 'idle' | 'success' | 'error';
  };
}

const initialState: RestaurantState = {
  restaurants: [],
  selectedRestaurant: null,
  loading: false,
  error: null,
  storeRegistration: {
    isSubmitting: false,
    submissionStatus: 'idle',
  },
};

const restaurantSlice = createSlice({
  name: 'restaurant',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setRestaurants: (state, action: PayloadAction<Restaurant[]>) => {
      state.restaurants = action.payload;
    },
    setSelectedRestaurant: (state, action: PayloadAction<Restaurant>) => {
      state.selectedRestaurant = action.payload;
    },
    clearSelectedRestaurant: (state) => {
      state.selectedRestaurant = null;
    },
    setStoreRegistrationSubmitting: (state, action: PayloadAction<boolean>) => {
      state.storeRegistration.isSubmitting = action.payload;
    },
    setStoreRegistrationStatus: (state, action: PayloadAction<'idle' | 'success' | 'error'>) => {
      state.storeRegistration.submissionStatus = action.payload;
    },
    resetStoreRegistrationStatus: (state) => {
      state.storeRegistration.submissionStatus = 'idle';
      state.storeRegistration.isSubmitting = false;
    },
  },
});

export const {
  setLoading,
  setError,
  setRestaurants,
  setSelectedRestaurant,
  clearSelectedRestaurant,
  setStoreRegistrationSubmitting,
  setStoreRegistrationStatus,
  resetStoreRegistrationStatus,
} = restaurantSlice.actions;

export type { StoreRegistrationData };

export default restaurantSlice.reducer;