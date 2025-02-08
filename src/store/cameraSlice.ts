import { createSlice } from '@reduxjs/toolkit';

interface CameraState {
  isCameraOpen: boolean;
}

const initialState: CameraState = {
  isCameraOpen: false,
};

const cameraSlice = createSlice({
  name: 'camera',
  initialState,
  reducers: {
    openCamera: (state) => {
      state.isCameraOpen = true;
    },
    closeCamera: (state) => {
      state.isCameraOpen = false;
    },
  },
});

export const { openCamera, closeCamera } = cameraSlice.actions;
export default cameraSlice.reducer;
