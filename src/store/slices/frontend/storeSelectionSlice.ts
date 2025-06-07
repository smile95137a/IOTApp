import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface StoreInfo {
  [key: string]: any; // 可擴充欄位
}

interface StoreSelectionState {
  selectedStore: StoreInfo | null;
}

const initialState: StoreSelectionState = {
  selectedStore: null,
};

const storeSelectionSlice = createSlice({
  name: 'storeSelection',
  initialState,
  reducers: {
    setSelectedStore: (state, action: PayloadAction<StoreInfo>) => {
      state.selectedStore = action.payload;
    },
    clearSelectedStore: (state) => {
      state.selectedStore = null;
    },
  },
});

export const { setSelectedStore, clearSelectedStore } =
  storeSelectionSlice.actions;
export default storeSelectionSlice.reducer;
