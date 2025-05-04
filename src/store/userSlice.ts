import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  user: any | null;
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
    setUser: (state, action: PayloadAction<any | null>) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
    },
  },
});

export const { addAmount, setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
