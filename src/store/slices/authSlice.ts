import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthUser, AuthState } from '../../types/auth';
import { saveAuthUser, removeAuthUser } from '../../utils/authStorage';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  isNewUser: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action: PayloadAction<AuthUser | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;

      // AsyncStorageに保存
      if (action.payload) {
        saveAuthUser(action.payload).catch(error => {
          console.error('Failed to save user to AsyncStorage:', error);
        });
      }
    },
    setNewUser: (state, action: PayloadAction<boolean>) => {
      state.isNewUser = action.payload;
    },
    updateUserProfile: (state, action: PayloadAction<Partial<AuthUser>>) => {
      if (state.user) {
        state.user = {
          ...state.user,
          ...action.payload,
        };

        // AsyncStorageに保存
        saveAuthUser(state.user).catch(error => {
          console.error('Failed to save updated user to AsyncStorage:', error);
        });
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;

      // AsyncStorageから削除
      removeAuthUser().catch(error => {
        console.error('Failed to remove user from AsyncStorage:', error);
      });
    },
  },
});

export const { clearError, setUser, setNewUser, updateUserProfile, setLoading, setError, logout } = authSlice.actions;
export default authSlice.reducer;