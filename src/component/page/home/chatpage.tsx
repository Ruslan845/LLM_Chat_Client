"use client";

import React, { useEffect, useRef, useState } from 'react';
import ChatText from "./chat";
import { useDispatch, useSelector } from 'react-redux';
import { askquestion, getchat, deletechatmessage } from '@/store/apis';
import MarkdownReveal from '@/component/MarkdownMessage';
import { addtext, Setold } from '@/store/chatSlice';
import { FaTrash } from 'react-icons/fa';

const ChatPage = ({ id }: { id: string }) => {
  const user = useSelector((state: any) => state.users.currentuser);
  const messages = useSelector((state: any) => state.chats.chats);
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [deletingMessageId, setDeletingMessageId] = useState<number | null>(null);
  const dispatch = useDispatch();
  const scrollRef = useRef(null);

  useEffect(() => {
    const get = async () => {
      try {
        await getchat(id, dispatch);
      } catch (error: any) {
        console.error("Error:", error);
      }
    };
    get();
  }, [id]);

  const sendData = async (question: string, model: string, tem: number, token: number, web: boolean) => {
    setLoading(true);
    const date = new Date();
    const date_string = date.toISOString().replace('Z', '') + '000';
    dispatch(addtext({
      role: "user",
      text: question,
      model,
      date: date_string,
      deleteddate: null,
      isnew: false,
    }));
    setTyping(true);
    try {
      await askquestion(question, model, id, tem, token, web, dispatch);
      scrollToBottom();
    } catch (error: any) {
      console.error("Error:", error);
    }
    setLoading(false);
  };

  const onDeleteButton = async (message_id: number) => {
    setDeletingMessageId(message_id);
    try {
      await deletechatmessage(id, message_id, dispatch);
    } catch (error: any) {
      console.error("Error:", error);
    }
    setDeletingMessageId(null);
  };

  const scrollToBottom = () => {
    if (scrollRef.current) {
      (scrollRef.current as HTMLElement).scrollTop = (scrollRef.current as HTMLElement).scrollHeight;
    }
  };

  const onSendData = (para: Boolean) => {
    if (para) {
      setTyping(false);
      dispatch(Setold(false));
    }
  };

  return (
    <>
      {/* Visible only on small screens */}
      <div className="sm:hidden flex justify-center items-center h-screen bg-gray-900 text-white text-xl p-4">
        Please use a larger screen to access the chatbot.
      </div>

      {/* Visible only on screens sm and larger */}
      <div className="hidden sm:flex justify-center items-center h-screen bg-gray-900 p-4">
        <div className="w-full max-w-4xl bg-gray-800 p-6 rounded-lg shadow-lg">
          <h1 className="text-center text-3xl font-semibold text-white mb-6">Chatbot</h1>
          <div className="flex flex-col h-[80vh]">
            {/* Messages */}
            <div ref={scrollRef} className="flex-grow overflow-y-auto bg-gray-700 p-4 rounded-lg mb-4 space-y-4">
              {Array.isArray(messages) && messages.length > 0 ? messages.filter(msg => msg.deleteddate == null).map((message: any, index: number) => (
                <div key={index} className="relative group w-full">
                  <div className={`flex ${message.role === "user" ? 'justify-end' : 'justify-start'}`}>
                    <div className={`${message.role === "user" ? 'bg-blue-500 text-white' : 'bg-gray-600 text-white'} p-3 rounded-lg ${message.role === "user" ? 'max-w-xs' : 'w-full'}`}>
                      {message.role === "bot" && message.model && (
                        <div className="text-sm text-gray-400 mb-2">{`Model: ${message.model}`}</div>
                      )}
                      {message.role === "bot" && message.isnew ? (
                        <MarkdownReveal content={message.text} onSendData={onSendData} />
                      ) : (
                        <>{message.text}</>
                      )}
                    </div>

                    {/* Delete Button or Spinner */}
                    {deletingMessageId === index ? (
                      <div className="absolute right-1 bottom-1 text-gray-400 animate-spin">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onDeleteButton(index)}
                        className="absolute right-1 bottom-1 text-gray-400 hover:text-red-500 hidden group-hover:block p-1"
                      >
                        <FaTrash size={14} />
                      </button>
                    )}
                  </div>
                </div>
              )) : null}
              {loading && (
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <div className="loader-ring mb-4"></div>
                  </div>
                </div>
              )}
            </div>

            {/* Input area */}
            <ChatText onSendData={sendData} isfinished={typing} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatPage;
