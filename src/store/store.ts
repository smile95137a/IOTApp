import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import loadingReducer from './loadingSlice';
import registerReducer from './registerSlice';
import userReducer from './userSlice';
import storeSelectionReducer from './storeSelectionSlice';
import locationReducer from './locationSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    loading: loadingReducer,
    register: registerReducer,
    user: userReducer,
    storeSelection: storeSelectionReducer,
    location: locationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
