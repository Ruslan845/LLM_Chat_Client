'use client';

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  getAllUsers,
  getUserDetails,
  updateUserAdminStatus,
  updateUserStatus,
  deleteUser,
} from '@/store/apis';
import { useRouter } from 'next/navigation';

const UserManagementPage = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state: any) => state.users); // Access currentUser from Redux
  const [selectedUser, setSelectedUser] = useState<any>(null); // Local state for selected user
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>({}); // Local state for current use

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    setCurrentUser(userData ? JSON.parse(userData) : {}); // Set current user from localStorage
  }, []);

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (!userData) {
      console.log('No userData found in localStorage');
      router.push('/auth'); // Redirect to the login page
    } else if (!JSON.parse(userData)?.is_admin) {
      console.log('You cannot access this site. You are a user, not an admin.');
      router.push('/home'); // Redirect to the home page
    } else {
      console.log('userData found:', JSON.parse(userData));
    }
  }, [router]);

  // Fetch all users on component mount
  useEffect(() => {
    getAllUsers(dispatch); // Call the API function with dispatch
  }, [dispatch]);

  // Fetch details of a selected user
  const handleUserSelect = async (user: any) => {
    try {
      const userDetail = await getUserDetails(user.id, dispatch); // Fetch user details and update Redux state
      setSelectedUser(userDetail); // Update local state for immediate UI updates
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  // Handle suspend action
  const handleSuspend = async () => {
    if (selectedUser) {
      const updatedIsActive = !selectedUser.is_active;
      try {
        await updateUserStatus(selectedUser.id, updatedIsActive, dispatch); // Update Redux state
        setSelectedUser({ ...selectedUser, is_active: updatedIsActive }); // Update local state
      } catch (error) {
        console.error('Error updating user active status:', error);
      }
    }
  };

  // Handle admin toggle action
  const handleAdminToggle = async () => {
    if (selectedUser) {
      const updatedIsAdmin = !selectedUser.is_admin;
      try {
        await updateUserAdminStatus(selectedUser.id, updatedIsAdmin, dispatch); // Update Redux state
        setSelectedUser({ ...selectedUser, is_admin: updatedIsAdmin }); // Update local state
      } catch (error) {
        console.error('Error updating admin status:', error);
      }
    }
  };

  // Handle delete action
  const handleDelete = async () => {
    if (selectedUser) {
      try {
        await deleteUser(selectedUser.id, dispatch, users); // Update Redux state
        setSelectedUser(null); // Clear local state
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen text-lg font-bold">Loading...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen text-lg font-bold text-red-500">Error: {error}</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* First Panel: User List */}
      <div className="w-1/4 bg-white shadow-lg p-6 border-r">
        <h2 className="text-xl font-bold text-gray-800 mb-6">User List</h2>
        <ul className="space-y-4">
          {users.map((user: any) => (
            <li
              key={user.id}
              className={`p-4 rounded-lg cursor-pointer shadow-sm ${
                selectedUser?.id === user.id ? 'bg-blue-100 border border-blue-500' : 'hover:bg-gray-100'
              }`}
              onClick={() => handleUserSelect(user)}
            >
              <p className="font-medium text-gray-800">{user.username}</p>
              <p className="text-sm text-gray-600">{user.social_auth.provider}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Second Panel: Placeholder */}
      <div className="w-1/2 bg-gray-50 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Welcome to Admin Panel</h2>
        <p className="text-gray-600">
          You can see chartlist of users.
        </p>
      </div>

      {/* Third Panel: User Details */}
      <div className="w-1/4 bg-white shadow-lg p-6 overflow-y-auto">
        {selectedUser ? (
          <>
            <h2 className="text-xl font-bold text-gray-800 mb-6">User Details</h2>
            <div className="flex flex-col items-center mb-6">
              <img
                src={selectedUser.avatar || 'https://www.gravatar.com/avatar/?d=mp&f=y'}
                alt={`${selectedUser.username}'s avatar`}
                className="w-24 h-24 rounded-full mb-4 shadow-md"
                onError={(e: any) => (e.target.src = 'https://www.gravatar.com/avatar/?d=mp&f=y')}
              />
              <p className="text-lg font-medium text-gray-800">{selectedUser.username}</p>
              <p className="text-sm text-gray-600">{selectedUser.email}</p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Login Type:</span> {selectedUser.social_auth?.provider || 'N/A'}
              </p>
            </div>
            <div className="space-y-4">
              <p className="text-gray-700">
                <span className="font-medium">Status:</span>{' '}
                {selectedUser.is_active ? (
                  <span className="text-green-500 font-medium">Active</span>
                ) : (
                  <span className="text-red-500 font-medium">Inactive</span>
                )}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Role:</span>{' '}
                {selectedUser.is_admin ? 'Admin' : 'User'}
              </p>
            </div>
            <div className="mt-6 flex flex-col gap-4">
              <button
                onClick={handleSuspend}
                className={`w-full px-4 py-2 bg-yellow-500 text-white rounded-lg shadow hover:bg-yellow-600 ${
                  selectedUser.id === currentUser?.id ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={selectedUser.id === currentUser?.id}
              >
                {selectedUser.is_active ? 'Suspend' : 'Activate'}
              </button>
              <button
                onClick={handleAdminToggle}
                className={`w-full px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 ${
                  selectedUser.id === currentUser?.id ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={selectedUser.id === currentUser?.id}
              >
                {selectedUser.is_admin ? 'Set as User' : 'Set as Admin'}
              </button>
              <button
                onClick={handleDelete}
                className="w-full px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-600">
            Select a user to view details.
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagementPage;