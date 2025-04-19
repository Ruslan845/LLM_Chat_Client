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
import api from '@/lib/axios';

const UserManagementPage = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state: any) => state.users); 
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedChatId, setSelectedChatId] = useState<string>('');
  const [currentUser, setCurrentUser] = useState<any>({});
  const [titleList, setTitleList] = useState([]);
  const [chats, setChats] = useState([]);

  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    setCurrentUser(userData ? JSON.parse(userData) : {});
  }, []);

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (!userData) {
      router.push('/auth');
    } else if (!JSON.parse(userData)?.is_admin) {
      router.push('/home');
    }
  }, [router]);

  useEffect(() => {
    getAllUsers(dispatch);
  }, [dispatch]);

  const handleUserSelect = async (user: any) => {
    try {
      const userDetail = await getUserDetails(user.id, dispatch);
      setSelectedUser(userDetail);
      setSelectedChatId('');
      const response = await api.post(`/gpt/gettitlelist/`, {
        user_id: userDetail.id,
      });
      setTitleList(response.data.title_list);
      setChats([]);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const changeSelectedChat = async (chatId: string) => {
    setSelectedChatId(chatId);
    const response = await api.post(`/gpt/getchat/`, {
      chat_id: chatId,
    });
    setChats(response.data.chat_list.chat_list);
  };

  const handleSuspend = async () => {
    if (selectedUser) {
      const updatedIsActive = !selectedUser.is_active;
      try {
        await updateUserStatus(selectedUser.id, updatedIsActive, dispatch);
        setSelectedUser({ ...selectedUser, is_active: updatedIsActive });
      } catch (error) {
        console.error('Error updating user active status:', error);
      }
    }
  };

  const handleAdminToggle = async () => {
    if (selectedUser) {
      const updatedIsAdmin = !selectedUser.is_admin;
      try {
        await updateUserAdminStatus(selectedUser.id, updatedIsAdmin, dispatch);
        setSelectedUser({ ...selectedUser, is_admin: updatedIsAdmin });
      } catch (error) {
        console.error('Error updating admin status:', error);
      }
    }
  };

  const handleDelete = async () => {
    if (selectedUser) {
      try {
        await deleteUser(selectedUser.id, dispatch, users);
        setSelectedUser(null);
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
      {/* User List Panel */}
      <div className="w-2/12 bg-white shadow-lg p-6 border-r overflow-y-auto">
        <h2 className="text-xl font-bold text-gray-800 mb-6 sticky top-0 bg-white z-10">User List</h2>
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

      {/* Chat Titles + History */}
      <div className="flex w-7/12 border-r">
        {/* Chat Titles Panel */}
        <div className="w-4/12 bg-white shadow-lg p-6 border-r overflow-y-auto">
          <h2 className="text-xl font-bold text-gray-800 mb-6 sticky top-0 bg-white z-10">Chats</h2>
          <ul className="space-y-4">
            {titleList.map((title: any) => (
              <li
                key={title.chat_id}
                className={`p-4 rounded-lg cursor-pointer shadow-sm ${
                  selectedChatId === title.chat_id ? 'bg-blue-100 border border-blue-500' : 'hover:bg-gray-100'
                }`}
                onClick={() => changeSelectedChat(title.chat_id)}
              >
                <p className="font-medium text-gray-800">{title.chat_title}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Chat History Panel */}
        <div className="w-10/12 bg-white shadow-lg p-6 overflow-y-auto">
          <h2 className="text-xl font-bold text-gray-800 mb-6 sticky top-0 bg-white z-10">Chat History</h2>
          {selectedUser && selectedChatId && chats.length > 0 && (
            <div className="space-y-4">
              {chats.map((chat: any, index: number) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg shadow-sm ${
                    chat.role == "user"  ? 'bg-blue-50 text-right ml-auto' : 'bg-gray-100 text-left mr-auto'
                  }`}
                >
                  <p className="font-semibold text-sm text-gray-600 mb-1">{chat.model}</p>
                  <p className="text-gray-800">{chat.text}</p>
                  <p className="text-xs text-gray-500 mt-2">{chat.date}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* User Details Panel */}
      <div className="w-3/12 bg-white shadow-lg p-6 overflow-y-auto">
        <h2 className="text-xl font-bold text-gray-800 mb-6 sticky top-0 bg-white z-10">User Details</h2>
        {selectedUser ? (
          <>
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
