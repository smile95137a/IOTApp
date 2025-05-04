import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RegisterState {
  phone: string;
  countryCode: string;
  verificationCode: string;
}

const initialState: RegisterState = {
  phone: '',
  countryCode: '+886',
  verificationCode: '',
};

const registerSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {
    setRegisterData: (state, action: PayloadAction<RegisterState>) => {
      state.phone = action.payload.phone;
      state.countryCode = action.payload.countryCode;
      state.verificationCode = action.payload.verificationCode;
    },
  },
});

export const { setRegisterData } = registerSlice.actions;
export default registerSlice.reducer;
