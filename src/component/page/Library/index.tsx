'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { gettitlelist, deletethread, updatechattitle } from '@/store/apis';
import { FiSearch } from 'react-icons/fi';

const Library = () => {
  const dispatch = useDispatch();
  const titlelist = useSelector((state: any) => state.chats.titlelist || []);
  const user = useSelector((state: any) => state.users.currentUser);

  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [deletingThreadId, setDeletingThreadId] = useState<string | null>(null);
  const [renamingThreadId, setRenamingThreadId] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      gettitlelist(user.id, dispatch);
    }
  }, [user?.id, dispatch]);

  const filteredThreads = titlelist.filter((t: any) =>
    t.chat_title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (chatId: string) => {
    if (!window.confirm('Are you sure you want to delete this chat?')) return;
    setDeletingThreadId(chatId);
    try {
      await deletethread(chatId, dispatch, titlelist);
      await gettitlelist(user.id, dispatch);
    } catch (error) {
      console.error('Error deleting thread:', error);
    } finally {
      setDeletingThreadId(null);
    }
  };

  const handleRename = async (chatId: string) => {
    if (!editedTitle.trim()) return;
    setRenamingThreadId(chatId);
    try {
        const user = localStorage.getItem("userData");
        const parsedUser = user ? JSON.parse(user) : null;
        const user_id = parsedUser?.id;

      await updatechattitle(user_id, chatId, editedTitle.trim(), dispatch);
      setEditingId(null);
    } catch (error : any) {
        console.log(error);
        if (error?.response.data.message === "duplicate") {
            alert('Please input other title.');
          } else {
            console.error('Error renaming thread:', error);
          }
    } finally {
      setRenamingThreadId(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, chatId: string) => {
    if (e.key === 'Enter') {
      handleRename(chatId);
    }
  };

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <span>📚</span> Library
          </h1>
          <div className="flex items-center gap-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search threads..."
              className="px-3 py-2 rounded-md bg-gray-800 text-sm text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Link href="/home">
              <button className="bg-blue-600 hover:bg-blue-700 p-2 rounded-md">
                <Plus className="text-white w-5 h-5" />
              </button>
            </Link>
          </div>
        </div>

        <div className="border border-gray-700 rounded-md">
          {filteredThreads.length === 0 ? (
            <div className="text-center text-gray-400 py-12">No threads found.</div>
          ) : (
            <div className="divide-y divide-gray-700">
              {filteredThreads.map((thread: any) => {
                const isEditing = editingId === thread.chat_id;
                const isDeleting = deletingThreadId === thread.chat_id;
                const isRenaming = renamingThreadId === thread.chat_id;

                return (
                  <div
                    key={thread.chat_id}
                    className="flex items-center justify-between p-4 hover:bg-gray-800 transition-colors"
                  >
                    <div
                      className={`flex items-center gap-2 w-full ${
                        isEditing ? '' : 'cursor-pointer'
                      }`}
                      onDoubleClick={() => {
                        if (!isDeleting && !isRenaming) {
                          setEditingId(thread.chat_id);
                          setEditedTitle(thread.chat_title);
                        }
                      }}
                    >
                      <span className="text-lg">🤖</span>
                      {isEditing ? (
                        <input
                          autoFocus
                          disabled={isRenaming || isDeleting}
                          type="text"
                          value={editedTitle}
                          onChange={(e) => setEditedTitle(e.target.value)}
                          onBlur={() => setEditingId(null)}
                          onKeyDown={(e) => handleKeyDown(e, thread.chat_id)}
                          className="bg-transparent border-b border-gray-500 focus:border-blue-500 text-white w-full px-1 outline-none"
                        />
                      ) : (
                        <Link href={`/chat/${thread.chat_id}`} className="w-full">
                          <div className="flex justify-between w-full">
                            <span className="truncate font-medium">{thread.chat_title}</span>
                            <span className="text-sm text-gray-400 ml-4 whitespace-nowrap">
                              {thread.chat_date}
                            </span>
                          </div>
                        </Link>
                      )}
                    </div>

                    <div className="flex gap-2 pl-4">
                      {isRenaming ? (
                        <svg
                          className="animate-spin h-5 w-5 text-blue-400"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8H4z"
                          />
                        </svg>
                      ) : (
                        editingId !== thread.chat_id && (
                          <button
                            onClick={() => {
                              if (!isDeleting && !isRenaming) {
                                setEditingId(thread.chat_id);
                                setEditedTitle(thread.chat_title);
                              }
                            }}
                          >
                            <Pencil className="w-5 h-5 text-blue-400 hover:text-blue-600" />
                          </button>
                        )
                      )}
                      <button
                        onClick={() => handleDelete(thread.chat_id)}
                        disabled={isRenaming}
                      >
                        {isDeleting ? (
                          <svg
                            className="animate-spin h-5 w-5 text-red-500"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v8H4z"
                            />
                          </svg>
                        ) : (
                          <Trash2 className="w-5 h-5 text-red-500 hover:text-red-700" />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Library;
