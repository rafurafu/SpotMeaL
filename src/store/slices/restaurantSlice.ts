import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Restaurant } from '../../types';

interface RestaurantState {
  restaurants: Restaurant[];
  selectedRestaurant: Restaurant | null;
  loading: boolean;
  error: string | null;
}

const initialState: RestaurantState = {
  restaurants: [],
  selectedRestaurant: null,
  loading: false,
  error: null,
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
  },
});

export const {
  setLoading,
  setError,
  setRestaurants,
  setSelectedRestaurant,
  clearSelectedRestaurant,
} = restaurantSlice.actions;

export default restaurantSlice.reducer;