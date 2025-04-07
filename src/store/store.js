import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';

const store = configureStore({
  reducer: {
    users: userReducer, // Add your reducers here
  },
});

export default store;