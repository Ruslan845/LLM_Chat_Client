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
      return {
        ...state,
        chats: action.payload
      }
    },
    setTitleList(state, action) {
      state.titlelist = action.payload;
    },
    addchattext(state, action) {
      const existingChats = Array.isArray(state.chats) ? state.chats : [];
      return {
        ...state,
          chats: [...existingChats, action.payload]
      }
    },
    setchattitle(state, action) {
      let titlelist = [];
      state.titlelist.map((item) => {
        if(item.chat_id == action.payload.chat_id)
          titlelist.push({chat_id: item.chat_id, chat_title: action.payload.chat_title, chat_date: item.chat_date});
        else titlelist.push(item);
      })
      state.titlelist = titlelist
    }
  },
});

export const { setList, setTitleList, addchattext, setold, setchattitle } = chatSlice.actions;
export default chatSlice.reducer;
