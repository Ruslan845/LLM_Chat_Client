import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import chatReducer from './chatSlice';

const store = configureStore({
  reducer: {
    users: userReducer, // Add your reducers here
    chats: chatReducer, // Add your reducers here
  },
});

export default store;