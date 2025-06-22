import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface BookingStepState {
  step: 1 | 2 | 3;
  store?: any;
  table?: any;
  selectedDate?: string;
  timeSlot?: string;
}

const initialState: BookingStepState = {
  step: 1,
};

const bookingStepSlice = createSlice({
  name: 'bookingStep',
  initialState,
  reducers: {
    setStep: (state, action: PayloadAction<1 | 2 | 3>) => {
      state.step = action.payload;
    },
    setStore: (state, action: PayloadAction<any>) => {
      state.store = action.payload;
    },
    setTable: (state, action: PayloadAction<any>) => {
      state.table = action.payload;
    },
    setSelectedDate: (state, action: PayloadAction<string>) => {
      state.selectedDate = action.payload;
    },
    setTimeSlot: (state, action: PayloadAction<string>) => {
      state.timeSlot = action.payload;
    },
    resetBooking: () => initialState,
  },
});

export const {
  setStep,
  setStore,
  setTable,
  setSelectedDate,
  setTimeSlot,
  resetBooking,
} = bookingStepSlice.actions;

export default bookingStepSlice.reducer;
