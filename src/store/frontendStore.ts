import { combineReducers } from '@reduxjs/toolkit';
import uiReducer from './slices/frontend/uiSlice';
import authReducer from './slices/frontend/authSlice';
import storeSelectionReducer from './slices/frontend/storeSelectionSlice';
import locationReducer from './slices/frontend/locationSlice';
import bookingStepReducer from './slices/frontend/bookingStepSlice';

const frontendReducer = combineReducers({
  ui: uiReducer,
  auth: authReducer,
  storeSelection: storeSelectionReducer,
  location: locationReducer,
  bookingStep: bookingStepReducer,
});

export default frontendReducer;
