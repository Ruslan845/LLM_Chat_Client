import api from '../lib/axios';
import axios from 'axios';
import { setUsers, setSelectedUser, toggleUserStatus, toggleAdminStatus } from './userSlice';
import { setList, setTitleList, addchattext, setchattitle } from './chatSlice';
import 'highlight.js/styles/github.css';


let tokenizers;
if (typeof window === 'undefined') {
  tokenizers = require('@anush008/tokenizers-linux-x64-gnu');
}

// Fetch all users
export const getAllUsers = async (dispatch) => {
  try {
    const response = await api.get('/admin/getallusers/');
    dispatch(setUsers(response.data)); // Dispatch the fetched users to Redux
    return response.data;
  } catch (error) {
    console.error('Error fetching all users:', error);
    throw error;
  }
};

// Fetch user details
export const getUserDetails = async (userId, dispatch) => {
  try {
    const response = await api.get(`/admin/getoneuser/${userId}/`);
    // console.log(response.data);
    dispatch(setSelectedUser(response.data)); // Dispatch the selected user to Redux
    return response.data;
  } catch (error) {
    console.error('Error fetching user details:', error);
    throw error;
  }
};

// Update user active status
export const updateUserStatus = async (userId, isActive, dispatch) => {
  try {
    const response = await api.post(`/admin/updateuser/${userId}/`, {
      is_active: isActive,
    });
    dispatch(toggleUserStatus(userId)); // Dispatch the toggle action to Redux
    return response.data;
  } catch (error) {
    console.error('Error updating user active status:', error);
    throw error;
  }
};

// Update user admin status
export const updateUserAdminStatus = async (userId, isAdmin, dispatch) => {
  try {
    const response = await api.post(`/admin/updateuser/${userId}/`, {
      is_admin: isAdmin,
    });
    dispatch(toggleAdminStatus(userId)); // Dispatch the toggle action to Redux
    return response.data;
  } catch (error) {
    console.error('Error updating admin status:', error);
    throw error;
  }
};

// Delete a user
export const deleteUser = async (userId, dispatch, users) => {
  try {
    const response = await api.delete(`/admin/deleteuser/${userId}/`);
    const updatedUsers = users.filter((user) => user.id !== userId);
    dispatch(setUsers(updatedUsers)); // Update the Redux store
    dispatch(setSelectedUser(null)); // Clear the selected user
    return response.data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}

export const deletethread = async (chatid, dispatch, titlelist) => {
  try {
    const response = await api.delete(`/gpt/deletethread/${chatid}/`);
    const updatedChatList = titlelist.filter((chat) => chat.chat_id !== chatid);
    dispatch(setTitleList(updatedChatList)); // Update the Redux store
    return response.data;
  } catch (error) {
    console.error('Error deleting chat:', error);
    throw error;
  }
}

export const deletechatmessage = async (chatid, messageid, dispatch) => {
  try {
    let response = await api.delete(`/gpt/deletechatmessage/${chatid}/${messageid}/`);
    response = await api.post(`/gpt/getchat/`,{
      chat_id : chatid,
    });
    // console.log(response);
    dispatch(setList(response.data.chat_list.chat_list)); // Dispatch the fetched chat to Redux)
    return response.data;
  } catch (error) {
    console.error('Error deleting chat message:', error);
    throw error;
  }
}

export const gettitlelist = async (userid, dispatch) => {
  if(!userid)
    return null
  try {
    const response = await api.post(`/gpt/gettitlelist/`,{
      user_id : userid,
    });
    dispatch(setTitleList(response.data.title_list)); // Dispatch the fetched chat to Redux
    return response.data;
  } catch (error) {
    console.error('Error fetching chat:', error);
    throw error;
  }
}

export const addchat = async (userid, question, dispatch) => {
  try {
    const response = await api.post(`/gpt/addchat/`,{
      user_id : userid,
      question: question
    });
    dispatch(setTitleList(response.data.title_list)); // Dispatch the fetched chat to Redux
    return response.data;
  } catch (error) {
    console.error('Error fetching chat:', error);
    throw error;
  }
}

export const getchat = async (chatid, dispatch) => {
  try {
    const response = await api.post(`/gpt/getchat/`,{
      chat_id : chatid,
    });
    // console.log(response);
    dispatch(setList(response.data.chat_list.chat_list)); // Dispatch the fetched chat to Redux)
    return response.data;
  } catch (error) {
    console.error('Error fetching chat:', error);
    throw error;
  }
}

export const websearch = async (question, key) => {
  const params = new URLSearchParams({
    api_key : key,
    engine: 'google',
    q: question,
  });
  const response = await fetch(`https://serpapi.com/search.json?${params}`)
  const data = await response.json();
  console.log("websearch result: ", data);
  return data;
}

// export const saveChatToBackend = async (question, response, model, tem, token, web) => {
//   try {
//     const payload = {
//       question,
//       response,
//       model,
//       temperature: tem,
//       max_tokens: token,
//       web_search_enabled: web,
//     };

//     await axios.post("/api/saveChat", payload, {
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     console.log("Chat saved to backend successfully");
//   } catch (error) {
//     console.error("Error saving chat to backend:", error);
//   }
// };

// Modified askquestion function to support streaming

export const askquestion = async (question,model,id,tem,token,web,dispatch) => {
  try {
    let chats = [{
      role: "user",
      text: question,
      model: model,
      date: new Date().toISOString(),
      deleteddate: null,
      isnew: false,
    }]
    console.log("chats: ", chats);
    dispatch(addchattext(chats[0]));
    addchats(chats, id)
    let keys = JSON.parse(localStorage.getItem("keys"))
    if(!keys) {
      keys = await getallkeys();
    }
    let response_web_search = ""
    dispatch(addchattext({  
      role: "bot",
      text: "Loading...",
      model: model,
      date: new Date().toISOString(),
      deleteddate: null,
      isnew: true,
    }));
    const fullResponse = await axios.post('/api/stream', {
      id,
      question,
      model,
      temperature: tem,
      max_tokens: token,
      keys, // Pass keys if needed
      response_web_search, // Pass web search results if needed
    });

    return fullResponse; // Return the full response for saving to the backend
  } catch (error) {
    console.error("Error in askquestion:", error);
    throw error;
  }
};

export const addchats = async (chats, chat_id) => {
  try{
    const response = await api.post(`/gpt/addchathistory`,{
      chats : chats,
      chat_id : chat_id,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching chat:', error);
    throw error;
  }
}

export const getallkeys = async () => {
  try {
    const response = await api.get(`/keys/get_all/`);
    localStorage.setItem('keys', JSON.stringify(response.data.keys));
    return response.data.keys;
  } catch (error) {
    console.error('Error fetching keys:', error);
    throw error;
  }
}

export const setonekey = async (name, value) => {
  try {
    const response = await api.post(`/keys/set_key/`,{
      name : name,
      value : value,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching keys:', error);
    throw error;
  }
}

export const updatechattitle = async (user_id, chat_id, chat_title, dispatch) => {
  try {
    const response = await api.post('/gpt/updatechattitle', {
      user_id,
      chat_id,
      chat_title,
    })
    dispatch(setchattitle({chat_id, chat_title}));
  } catch (error) {
    console.error('Error fetching keys:', error);
    throw error;
  }
}