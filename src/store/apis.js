import api from '../lib/axios';
import { setUsers, setSelectedUser, toggleUserStatus, toggleAdminStatus } from './userSlice';
import { setList, setTitleList, addtext } from './chatSlice';

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
    console.log("Delete success:", response.data);
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

export const addchat = async (quesiton, userid, model, tem, token, dispatch) => {
  try {
    const response = await api.post(`/gpt/addchat/`,{
      question : quesiton,
      user_id : userid,
      model : model,
      temperature : tem,
      max_token : token,
    });
    dispatch(setList(response.data.chat_list));
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

export const askquestion = async (question, model, id, tem, token, web, dispatch) => {
  try {
    console.log(tem, token, id, question, model);
    const response = await api.post(`/gpt/askgpt/`,{
      question : question,
      model : model,
      chat_id : id,
      temperature : tem,
      max_token : token,
      web : web,
    });
    dispatch(addtext(response.data.answer)); // Dispatch the fetched chat to Redux
    // console.log("after dispatching", response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching chat:', error);
    throw error;
  }
}

export const getallkeys = async () => {
  try {
    const response = await api.get(`/keys/get_all/`);
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