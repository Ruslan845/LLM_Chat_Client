'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers, deleteUser, updateUserStatus, updateUserAdminStatus } from '@/store/apis';
import { FiSearch } from 'react-icons/fi';

const modelList = [
  'gpt-4o',
  'gpt-4-turbo',
  'gpt-3.5-turbo',
  'text-davinci-003',
  'DeepSeek-V3',
  'DeepSeek-R1',
];

const UserManagementPage = () => {
  const dispatch = useDispatch();
  const users = useSelector((state: any) => state.users.users || []);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    getAllUsers(dispatch);
  }, [dispatch]);

  const handleSuspendToggle = (userId: string, isActive: boolean) => {
    updateUserStatus(userId, !isActive, dispatch);
  };

  const handleDelete = (userId: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this user?');
    if (confirmed) {
      deleteUser(userId, dispatch, users);
    }
  };

  const handleChangeRole = (userId: string, isAdmin: boolean) => {
    updateUserAdminStatus(userId, !isAdmin, dispatch);
  };

  const filteredUsers = users.filter((user: any) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 min-h-screen bg-gray-900 text-gray-100">
      <h1 className="text-3xl font-bold mb-6">User Management</h1>

      <div className="relative mb-6 w-full md:w-1/2">
        <FiSearch className="absolute top-3 left-3 text-gray-400" />
        <input
          type="text"
          placeholder="Search by username or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 border border-gray-700 bg-gray-800 text-gray-100 rounded-lg w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="overflow-x-auto rounded border border-gray-700">
        <table className="min-w-full bg-gray-800 border border-gray-700 text-sm text-left">
          <thead>
            <tr className="bg-gray-700 text-gray-300 uppercase text-xs tracking-wider">
              <th className="py-3 px-4 border-b border-gray-600">ID</th>
              <th className="py-3 px-4 border-b border-gray-600">Username</th>
              <th className="py-3 px-4 border-b border-gray-600">Email</th>
              {modelList.map((model) => (
                <th
                  key={model}
                  className="py-3 px-4 border-b border-gray-600 whitespace-nowrap w-24" /* Fixed width for models */
                >
                  {model}
                </th>
              ))}
              <th className="py-3 px-4 border-b border-gray-600">Role</th>
              <th className="py-3 px-4 border-b border-gray-600">Status</th>
              <th
                className="py-3 px-4 border-b border-gray-600 sticky right-0 z-10" /* Sticky "Actions" */
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user: any) => (
              <tr key={user.id} className="hover:bg-gray-700 transition-colors">
                <td className="py-3 px-4 border-b border-gray-700">{user.id}</td>
                <td className="py-3 px-4 border-b border-gray-700 font-medium">{user.username}</td>
                <td className="py-3 px-4 border-b border-gray-700">{user.email}</td>
                {modelList.map((model) => (
                  <td
                    key={model}
                    className="py-3 px-4 border-b border-gray-700 text-center w-24" /* Fixed width for models */
                  >
                    <span className={user.models?.includes(model) ? 'text-green-400' : 'text-red-400'}>
                      {user.models?.includes(model) ? '✅' : '❌'}
                    </span>
                  </td>
                ))}
                <td className="py-3 px-4 border-b border-gray-700">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      user.is_admin ? 'bg-green-900 text-green-400' : 'bg-gray-600 text-gray-300'
                    }`}
                  >
                    {user.is_admin ? 'Admin' : 'User'}
                  </span>
                </td>
                <td className="py-3 px-4 border-b border-gray-700">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      user.is_active ? 'bg-blue-900 text-blue-400' : 'bg-red-900 text-red-400'
                    }`}
                  >
                    {user.is_active ? 'Active' : 'Suspended'}
                  </span>
                </td>
                <td
                  className="py-3 px-4 border-b border-gray-700 sticky right-0 z-10 flex flex-col gap-2 md:flex-row md:items-center"
                >
                  <button
                    onClick={() => handleSuspendToggle(user.id, user.is_active)}
                    className={`px-3 py-1 rounded text-xs font-medium shadow hover:opacity-90 transition ${
                      user.is_active ? 'bg-orange-500 text-gray-900' : 'bg-green-600 text-gray-100'
                    }`}
                  >
                    {user.is_active ? 'Suspend' : 'Activate'}
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="px-3 py-1 rounded text-xs font-medium bg-red-700 text-white shadow hover:bg-red-800 transition"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleChangeRole(user.id, user.is_admin)}
                    className="px-3 py-1 rounded text-xs font-medium bg-blue-600 text-white shadow hover:bg-blue-700 transition"
                  >
                    Change {user.is_admin ? 'User' : 'Admin'}
                  </button>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td
                  colSpan={modelList.length + 6}
                  className="py-4 px-4 text-center text-gray-400"
                >
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default UserManagementPage;
