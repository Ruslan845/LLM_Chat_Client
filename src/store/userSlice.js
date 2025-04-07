import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  users: [],
  selectedUser: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setCurrentUser(state, action) {
      state.currentuser = action.payload; // Update the current user
    },
    setUsers(state, action) {
      state.users = action.payload; // Update the users array
    },
    setSelectedUser(state, action) {
      state.selectedUser = action.payload; // Update the selected user
    },
    toggleUserStatus(state, action) {
      const user = state.users.find((u) => u.id === action.payload);
      if (user) {
        user.is_active = !user.is_active; // Toggle the is_active status
      }
    },
    toggleAdminStatus(state, action) {
      const user = state.users.find((u) => u.id === action.payload);
      if (user) {
        user.is_admin = !user.is_admin; // Toggle the is_admin status
      }
    },
  },
});

export const { setCurrentUser, setUsers, setSelectedUser, toggleUserStatus, toggleAdminStatus } = userSlice.actions;
export default userSlice.reducer;