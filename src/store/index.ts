import { configureStore } from '@reduxjs/toolkit';
import restaurantSlice from './slices/restaurantSlice';
import userSlice from './slices/userSlice';
import paymentSlice from './slices/paymentSlice';
import authSlice from './slices/authSlice';

export const store = configureStore({
  reducer: {
    restaurant: restaurantSlice,
    user: userSlice,
    payment: paymentSlice,
    auth: authSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;