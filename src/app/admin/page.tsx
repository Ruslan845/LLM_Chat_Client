'use client'

import React, { useState } from 'react';

export default function Home() {
  // --- Sample Data ---
  const users = [
    { id: 1, username: 'alice', email: 'alice@example.com' },
    { id: 2, username: 'bob', email: 'bob@example.com' },
  ];

  const titlelist = {
    alice: [
      { chat_id: 'a1', chat_title: 'Alice & GPT-4' },
      { chat_id: 'a2', chat_title: 'Project Talk' },
    ],
    bob: [
      { chat_id: 'b1', chat_title: 'Bob & Gemini' },
    ],
  };

  const chats = {
    'Alice & GPT-4': [
      {
        role: 'user',
        text: 'Hi there!',
        model: 'GPT-4',
        date: new Date().toISOString(),
        deleteddate: null,
      },
      {
        role: 'bot',
        text: 'Hello! How can I assist you today?',
        model: 'GPT-4',
        date: new Date().toISOString(),
        deleteddate: null,
      },
    ],
    'Project Talk': [
      {
        role: 'user',
        text: 'Tell me more about the project scope.',
        model: 'GPT-4',
        date: new Date().toISOString(),
        deleteddate: null,
      },
      {
        role: 'bot',
        text: 'The project will include frontend and backend...',
        model: 'GPT-4',
        date: new Date().toISOString(),
        deleteddate: null,
      },
    ],
    'Bob & Gemini': [
      {
        role: 'user',
        text: 'What is Gemini?',
        model: 'Gemini',
        date: new Date().toISOString(),
        deleteddate: null,
      },
      {
        role: 'bot',
        text: 'Gemini is a powerful language model by Google.',
        model: 'Gemini',
        date: new Date().toISOString(),
        deleteddate: null,
      },
    ],
  };

  // --- State ---
  const [search, setSearch] = useState('');
  const [selectedThread, setSelectedThread] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [hoveredUser, setHoveredUser] = useState(null);

  // --- Filter Users ---
  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(search.toLowerCase())
  );

  // --- Handle Click ---
  const handleThreadClick = (username, thread) => {
    setSelectedUser(username);
    setSelectedThread(thread);
  };

  const handleDelete = () => {
    const threadChats = chats[selectedThread.chat_title];
    if (threadChats && threadChats.length > 0) {
      threadChats[threadChats.length - 1].deleteddate = new Date().toISOString();
    }
    setSelectedThread({ ...selectedThread });
  };

  // --- UI ---
  return (
    <div className="flex h-screen font-sans bg-gray-900 text-white">
      {/* Left Panel */}
      <div className="w-1/3 border-r border-gray-700 p-4 overflow-y-auto">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 mb-4 bg-gray-800 text-white border border-gray-600 rounded"
        />
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className="mb-4 group relative"
            onMouseEnter={() => setHoveredUser(user.username)}
            onMouseLeave={() => setHoveredUser(null)}
          >
            <div>
              <strong>{user.username}</strong><br />
              <small className="text-gray-400">{user.email}</small>
            </div>
            {hoveredUser === user.username && (
              <ul className="mt-2 ml-4 pl-2 border-l border-gray-600">
                {(titlelist[user.username] || []).map((thread) => (
                  <li
                    key={thread.chat_id}
                    onClick={() => handleThreadClick(user.username, thread)}
                    className="text-blue-400 cursor-pointer hover:underline"
                  >
                    {thread.chat_title}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      {/* Right Panel */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-800">
        {selectedThread ? (
          <>
            <h2 className="text-2xl font-semibold mb-4">{selectedThread.chat_title}</h2>
            <div className="space-y-4 max-h-[80vh] overflow-y-auto">
              {(chats[selectedThread.chat_title] || []).map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-3 rounded-lg max-w-md ${msg.role === 'user' ? 'bg-blue-500' : 'bg-gray-600'} text-white`}>
                    <div className="text-sm text-gray-300 mb-1">{msg.model}</div>
                    <div className="whitespace-pre-wrap">{msg.text}</div>
                    <div className="text-xs text-gray-400 mt-1">{new Date(msg.date).toLocaleString()}</div>
                    {msg.deleteddate && <div className="text-red-400 mt-1">This is deleted</div>}
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={handleDelete}
              className="mt-6 px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white"
            >
              Delete Thread
            </button>
          </>
        ) : (
          <div className="text-gray-400">Select a thread to view chat history.</div>
        )}
      </div>
    </div>
  );
}
