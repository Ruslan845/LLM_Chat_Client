"use client";

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import ChatText from "./chat";
import { useDispatch, useSelector } from "react-redux";
import { getchat, deletechatmessage, askquestion, addchats } from "@/store/apis";
import { addchattext, updatechattext } from "@/store/chatSlice";
import MarkdownReveal from "@/component/MarkdownMessage";
import { FaTrash } from "react-icons/fa";
import type { Socket } from "socket.io-client"; // Import Socket.IO client
import { initSocket } from "@/lib/socket";

const ChatPage = ({ id }: { id: string }) => {
  const user = useSelector((state: any) => state.users.currentuser);
  const messages = useSelector((state: any) => state.chats.chats);
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [startmodel, setStartmodel] = useState("gpt-3.5-turbo");
  const [deletingMessageId, setDeletingMessageId] = useState<number | null>(null);
  const dispatch = useDispatch();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const func = async () => {
      await axios.get("/api/socket");
      const socketInstance = initSocket();
      socketInstance.on("connect", () => {
        console.log("Frontend client connected to socket server");
      });
      socketInstance.on("LLM_response", async (data: any) => {
        // console.log("Received data from server: ", data);
        if (data && id == data.id) {
          const { message, model, isnew } = data;
          // console.log("Message: ", message);
          const newMessage = {
            role: "bot",
            text: message,
            model: model,
            isnew: isnew,
          };
          // console.log("New message: ", newMessage);
          dispatch(updatechattext(newMessage));
          setTyping(false);
          if (data.isfinish){
            console.log("Finished message: ", message);
            let chats = [{
              role: "bot",
              text: message,
              model: model,
              date: new Date().toISOString(),
              deleteddate: null,
              isnew: false,
            }];
            await addchats(chats, id);
            await getchat(id, dispatch);
            return;
          }
        }
      }
      );
      setSocket(socketInstance);

      return () => {
        socketInstance.disconnect();
      }
    }
    func();
  },[]);

  // Setup Socket.IO listener for AI responses

  useEffect(() => {
    const fetchChat = async () => {
      try {
        setLoading(true);
        const as_string = localStorage.getItem("newChat");
        if (as_string) {
          localStorage.removeItem("newChat");
          const newchat = JSON.parse(as_string);
          setStartmodel(newchat.model);
          // await getchat(id, dispatch);
          sendData(newchat.question, newchat.model, newchat.tem, newchat.token, newchat.web);
        }
        else {
          await getchat(id, dispatch);
        }
        setLoading(false);
      } catch (error: any) {
        console.error("Error fetching chat:", error);
      }
    };

    if (id) fetchChat();
  }, [id, dispatch]);

  const sendData = async (question: string, model: string, tem: number, token: number, web: boolean) => {
    setLoading(true);
    setTyping(true);
    console.log("Sending question:", question, model, tem, token);
    await askquestion(question, model, id , tem, token, web, dispatch)

    // Emit the message via WebSocket

    scrollToBottom();
    setLoading(false);
  };

  const onDeleteButton = async (message_id: number) => {
    setDeletingMessageId(message_id);
    try {
      await deletechatmessage(id, message_id, dispatch);
    } catch (error: any) {
      console.error("Error deleting message:", error);
    }
    setDeletingMessageId(null);
  };

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
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
              {Array.isArray(messages) && messages.length > 0
                ? messages
                    .filter((msg) => msg.deleteddate == null)
                    .map((message: any, index: number) => (
                      <div key={index} className="relative group w-full">
                        <div className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                          <div
                            className={`${
                              message.role === "user" ? "bg-blue-500 text-white" : "bg-gray-600 text-white"
                            } p-3 rounded-lg ${message.role === "user" ? "whitespace-pre-wrap" : "w-full"}`}
                          >
                            {message.role === "bot" && message.model && (
                              <div className="text-sm text-gray-400 mb-2">{`Model: ${message.model}`}</div>
                            )}
                            {message.role === "bot" ? (
                              <MarkdownReveal content={message.text} />
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
                    ))
                : null}
              {loading && (
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <div className="loader-ring mb-4"></div>
                  </div>
                </div>
              )}
            </div>

            {/* Input area */}
            <ChatText onSendData={sendData} isfinished={typing} startmodel={startmodel} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatPage;
