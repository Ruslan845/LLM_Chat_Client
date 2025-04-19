import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    chats: [],  // Update chat_list correctly
    titlelist: [],
};

const chatSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    setList(state, action) {
      console.log("action.payload", action.payload)
      state.chats = action.payload;  // Update chat_list correctly
      console.log("state.chats", state.chats)
    },
    setTitleList(state, action) {
      state.titlelist = action.payload;
    },
    addtext(state, action) {
        const existingChats = Array.isArray(state.chats) ? state.chats : [];
        return { 
          ...state,
            chats: [...existingChats, action.payload]
        }
    },
    Setold(state,action){
      const existingChats = Array.isArray(state.chats.chats)? state.chats.chats : [];
      for(chat of existingChats){
        chat.isnew = false;
      }
      state.chats.chats = existingChats;
    }
  },
});

export const { setList, setTitleList, addtext, Setold } = chatSlice.actions;
export default chatSlice.reducer;
