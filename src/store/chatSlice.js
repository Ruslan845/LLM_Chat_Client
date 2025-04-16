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
      // console.log("action.payload", action.payload)
      state.chats = action.payload;  // Update chat_list correctly
      // console.log("state.chats", state.chats)
    },
    setTitleList(state, action) {
      // console.log("action.payload: ", action.payload);  // Check if the title list was received correctly
        state.titlelist = action.payload;
        // console.log("state.titlelist: ", state.titlelist);  // Check if the title list was updated
    },
    addtext(state, action) {
        // state.chats.chats = {...state.chats.chats, action.payload};  // Push directly into chat_list
        // state.chats.chats.push(action.payload);
        // console.log("state.chat_list: ", state.chat_list);  // Check if the message was added
        const existingChats = Array.isArray(state.chats) ? state.chats : [];
        // console.log("existingChats: ", existingChats);  // Check if the existing chats were retrieved correctly
        // console.log("state: ", JSON.parse(JSON.stringify(state)));
        return { 
          ...state,
            chats: [...existingChats, action.payload]
        }
    }
  },
});

export const { setList, setTitleList, addtext } = chatSlice.actions;
export default chatSlice.reducer;
