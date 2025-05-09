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
      };
    },
    setTitleList(state, action) {
      state.titlelist = action.payload;
    },
    addchattext(state, action) {
      const existingChats = Array.isArray(state.chats) ? state.chats : [];
      const { role, text, isnew } = action.payload;

      // Check if the last message is a bot message and is still being streamed
      if (isnew && existingChats.length > 0 && existingChats[existingChats.length - 1].role === "bot") {
        const lastMessage = existingChats[existingChats.length - 1];
        return {
          ...state,
          chats: [
            ...existingChats.slice(0, -1), // Keep all messages except the last one
            { ...lastMessage, text: lastMessage.text + text } // Append the new chunk to the last message
          ]
        };
      }

      // Otherwise, add a new message
      return {
        ...state,
        chats: [...existingChats, action.payload]
      };
    },
    setchattitle(state, action) {
      let titlelist = [];
      state.titlelist.map((item) => {
        if (item.chat_id === action.payload.chat_id) {
          titlelist.push({
            chat_id: item.chat_id,
            chat_title: action.payload.chat_title,
            chat_date: item.chat_date
          });
        } else {
          titlelist.push(item);
        }
      });
      state.titlelist = titlelist;
    },
    updatechattext(state, action) {
      const { id, role, text, isnew } = action.payload; //Get text from payload
      if (!state || !Array.isArray(state.chats)) {
        return state; // Handle cases where state or chats is not defined or not an array.
      }
    
      const updatedChats = [...state.chats]; // Create a copy to avoid mutation
    
      // Find the index of the last bot message
      const lastBotMessageIndex = updatedChats.reduce((index, chat, currentIndex) => {
        if (chat.role === 'bot' && (index === -1 || currentIndex > index)) {
          return currentIndex;
        }
        return index;
      }, -1);
    
      if (lastBotMessageIndex !== -1) {
        // Update the last bot message with the new text
        updatedChats[lastBotMessageIndex] = {
          ...updatedChats[lastBotMessageIndex],
          text: text, // Assign the new text
          isnew: isnew || updatedChats[lastBotMessageIndex].isnew // Preserve isnew if not specified
        };
      }
    
      return {
        ...state,
        chats: updatedChats,
      };
    }
  },
});

export const { setList, setTitleList, addchattext, setchattitle, updatechattext } = chatSlice.actions;
export default chatSlice.reducer;