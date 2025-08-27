import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types';

interface UserState {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  currentUser: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setCurrentUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
    },
    addToFavorites: (state, action: PayloadAction<string>) => {
      if (state.currentUser && !state.currentUser.favorites.includes(action.payload)) {
        state.currentUser.favorites.push(action.payload);
      }
    },
    removeFromFavorites: (state, action: PayloadAction<string>) => {
      if (state.currentUser) {
        state.currentUser.favorites = state.currentUser.favorites.filter(
          id => id !== action.payload
        );
      }
    },
    logout: (state) => {
      state.currentUser = null;
    },
  },
});

export const {
  setLoading,
  setError,
  setCurrentUser,
  addToFavorites,
  removeFromFavorites,
  logout,
} = userSlice.actions;

export default userSlice.reducer;