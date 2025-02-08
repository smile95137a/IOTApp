import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppDispatch } from './store';
import { User } from '@/api/userApi';

interface UserState {
  user: User | null;
}

const initialState: UserState = {
  user: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addAmount: (state, action: PayloadAction<number>) => {
      if (state.user) {
        state.user.amount += action.payload;
      }
    },
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
    },
  },
});

export const { addAmount, setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
