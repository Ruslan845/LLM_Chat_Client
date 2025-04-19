'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers, gettitlelist, getchat, deletethread } from '@/store/apis';
import { FiSearch } from 'react-icons/fi';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

const NAVBAR_HEIGHT = '64px';

const ChatHistoryPage = () => {
  const dispatch = useDispatch();
  const users = useSelector((state: any) => state.users.users || []);
  const titlelist = useSelector((state: any) => state.chats.titlelist || []);
  const chats = useSelector((state: any) => state.chats.chats || []);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUsername, setSelectedUsername] = useState<string>('');
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [selectedThreadTitle, setSelectedThreadTitle] = useState<string>('');
  const [expandedUsers, setExpandedUsers] = useState<Record<string, boolean>>({});
  const [loadingThreads, setLoadingThreads] = useState<Record<string, boolean>>({});

  useEffect(() => {
    getAllUsers(dispatch);
  }, [dispatch]);

  useEffect(() => {
    if (selectedThreadId) {
      getchat(selectedThreadId, dispatch);
    }
  }, [selectedThreadId, dispatch]);

  const filteredUsers = users.filter((user: any) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleExpand = async (user: any) => {
    setExpandedUsers((prev) => ({ ...prev, [user.id]: !prev[user.id] }));
    setLoadingThreads((prev) => ({ ...prev, [user.id]: true }));
    setSelectedThreadId(null);
    setSelectedThreadTitle('');
    setSelectedUserId(user.id);
    setSelectedUsername(user.username);
    dispatch({ type: 'chat/setList', payload: [] }); // Clears chat list manually
    await gettitlelist(user.id, dispatch);
    setLoadingThreads((prev) => ({ ...prev, [user.id]: false }));
  };

  const handleThreadSelect = (thread: any) => {
    setSelectedThreadId(thread.chat_id);
    setSelectedThreadTitle(thread.chat_title || 'Untitled');
  };

  const handleDeleteChat = () => {
    if (selectedThreadId) {
      const confirmed = window.confirm('Are you sure you want to delete this chat?');
      if (confirmed) {
        deletethread(selectedThreadId, dispatch, titlelist);
        setSelectedThreadId(null);
        setSelectedThreadTitle('');
        dispatch({ type: 'chat/setList', payload: [] }); // Clear chat list when deleted
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      <div className="w-[320px] min-w-[320px] border-r border-gray-700 flex flex-col">
        <div className="h-[64px] px-4 border-b border-gray-700 flex items-center justify-between gap-2">
          <h2 className="text-lg font-semibold whitespace-nowrap">Users</h2>
          <div className="relative w-full">
            <FiSearch className="absolute top-2.5 left-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-1.5 border border-gray-700 bg-gray-800 text-gray-100 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        </div>
        <div className="flex-1 p-4 overflow-y-auto">
          {filteredUsers.map((user: any) => (
            <div key={user.id} className="mb-2">
              <div
                className={`cursor-pointer p-3 rounded ${selectedUserId === user.id ? 'bg-blue-800' : 'bg-gray-800'} hover:bg-blue-700`}
                onClick={() => toggleExpand(user)}
              >
                <div className="font-semibold">{user.username}</div>
                <div className="text-sm text-gray-400">{user.email}</div>
              </div>
              {expandedUsers[user.id] && selectedUserId === user.id && (
                <div className="ml-4 mt-2 space-y-1">
                  {loadingThreads[user.id] ? (
                    <div className="text-gray-400 flex items-center gap-2">
                      <AiOutlineLoading3Quarters className="animate-spin" /> Loading threads...
                    </div>
                  ) : (
                    titlelist.length > 0 ? (
                      titlelist.map((thread: any) => (
                        <div
                          key={thread.chat_id}
                          className={`cursor-pointer p-2 rounded text-sm ${selectedThreadId === thread.chat_id ? 'bg-blue-600' : 'bg-gray-700'} hover:bg-blue-500`}
                          onClick={() => handleThreadSelect(thread)}
                        >
                          {thread.chat_title || 'Untitled'}
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-gray-400">No Thread</div>
                    )
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="h-[64px] px-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            Chat History {selectedUsername && `→ ${selectedUsername}`} {selectedThreadId && selectedThreadTitle && `→ ${selectedThreadTitle}`}
          </h2>
          {(selectedThreadId || selectedUsername) && (
            <button
              onClick={handleDeleteChat}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded shadow text-sm"
            >
              Delete Chat
            </button>
          )}
        </div>
        <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-2">
          {selectedThreadId && chats.length > 0 && chats.map((chat: any) => (
            <div
              key={chat.id}
              className={`p-3 rounded-lg inline-block max-w-xl text-sm whitespace-pre-wrap ${chat.role === 'bot' ? 'self-start text-left bg-gray-700' : 'self-end text-right bg-gray-800'} ${chat.deleteddate ? 'bg-red-900' : ''}`}
            >
              {chat.role === 'bot' && <div className="text-xs text-blue-300 mb-1">{chat.model}</div>}
              <div>{chat.text}</div>
              <div className="text-xs text-gray-400 mt-1">
                {`Created at: ${chat.date}`}
                {chat.deleteddate && (
                  <div className="text-red-400 mt-1">Deleted at: {chat.deleteddate}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatHistoryPage;