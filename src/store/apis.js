import axios from 'axios';
import { setUsers, setSelectedUser, toggleUserStatus, toggleAdminStatus } from './userSlice';

// Axios instance for base configuration
const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL + '/admin', // Use the environment variable
    headers: {
    'Content-Type': 'application/json',
  },
});

// Fetch all users
export const getAllUsers = async (dispatch) => {
  try {
    const response = await axiosInstance.get('/getallusers/');
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
    const response = await axiosInstance.get(`/getoneuser/${userId}/`);
    console.log(response.data);
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
    const response = await axiosInstance.post(`/updateuser/${userId}/`, {
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
    const response = await axiosInstance.post(`/updateuser/${userId}/`, {
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
    const response = await axiosInstance.delete(`/deleteuser/${userId}/`);
    const updatedUsers = users.filter((user) => user.id !== userId);
    dispatch(setUsers(updatedUsers)); // Update the Redux store
    dispatch(setSelectedUser(null)); // Clear the selected user
    return response.data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};