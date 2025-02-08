import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppDispatch } from './store';

interface User {
  uid: string;
  email: string | null;
  name: string;
  countryCode: string | null;
  phoneNumber: string | null;
  roles: string[];
}

interface AuthState {
  isLoggedIn: boolean;
  accessToken: string | null;
  user: User | null;
}

const initialState: AuthState = {
  isLoggedIn: false,
  accessToken: null,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (
      state,
      action: PayloadAction<{ token: string | null; user: User | null }>
    ) => {
      state.accessToken = action.payload.token;
      state.user = action.payload.user;
      state.isLoggedIn = !!action.payload.token;

      if (action.payload.token && action.payload.user) {
        AsyncStorage.setItem('accessToken', action.payload.token);
        AsyncStorage.setItem('user', JSON.stringify(action.payload.user));
      }
    },
    logOut: (state) => {
      state.isLoggedIn = false;
      state.accessToken = null;
      state.user = null;

      AsyncStorage.removeItem('accessToken');
      AsyncStorage.removeItem('user');
    },
  },
});

export const { setAuth, logOut } = authSlice.actions;

export const loadAuthState = () => async (dispatch: AppDispatch) => {
  try {
    const token = await AsyncStorage.getItem('accessToken');
    const userData = await AsyncStorage.getItem('user');
    const user = userData ? JSON.parse(userData) : null;

    if (token && user) {
      dispatch(setAuth({ token, user }));
    }
  } catch (error) {
    console.error('[Auth] Failed to load auth state:', error);
  }
};
export default authSlice.reducer;
