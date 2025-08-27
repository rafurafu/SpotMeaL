import { configureStore } from '@reduxjs/toolkit';
import restaurantSlice from './slices/restaurantSlice';
import userSlice from './slices/userSlice';
import paymentSlice from './slices/paymentSlice';

export const store = configureStore({
  reducer: {
    restaurant: restaurantSlice,
    user: userSlice,
    payment: paymentSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;