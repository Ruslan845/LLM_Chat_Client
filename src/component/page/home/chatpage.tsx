"use client"

import React, { useEffect, useState, useRef } from 'react';
import ChatText from "./chat";
import { useDispatch, useSelector } from 'react-redux';
import { askquestion, getchat } from '@/store/apis';
// import MarkdownMessage from "@/component//markdownMessage";


const ChatPage = ({id} : {id:string}) => {

    const user = useSelector((state: any) => state.users.currentuser);
    const messages = useSelector((state: any) => state.chats.chats);
    const dispatch = useDispatch();
    const scrollRef = useRef(null);

    useEffect(()  => {
      const get = async () => {
        await getchat(id, dispatch).then((response: any) => {
            console.log("Response:", response);
            // Handle the response here
        }
        ).catch((error: any) => {
            console.error("Error:", error);
            // Handle the error here
        }
        );
        console.log("Data sent");
      }
      get();
    },[,id]);


    const sendData = async (question : string, model : string) => {
    // Function to handle sending data

        await askquestion(question, model, id, dispatch).then((response: any) => {
            console.log("Response:", response);
            scrollToBottom();
            // Handle the response here
        }
        ).catch((error: any) => {
            console.error("Error:", error);
            // Handle the error here
        }
        );
        console.log("Data sent");
    };

    const scrollToBottom = () => {
      if(scrollRef.current) {
        (scrollRef.current as HTMLElement).scrollTop = (scrollRef.current as HTMLElement).scrollHeight;
      }
    }

  return (
        <div className="flex justify-center items-center h-screen bg-gray-900 p-4">
          <div className="w-full max-w-4xl bg-gray-800 p-6 rounded-lg shadow-lg">
            <h1 className="text-center text-3xl font-semibold text-white mb-6">Chatbot</h1>
              <div className="flex flex-col h-[80vh]">
          {/* Messages */}
          <div ref = {scrollRef} className="flex-grow overflow-y-auto bg-gray-700 p-4 rounded-lg mb-4 space-y-4">
          {Array.isArray(messages) && messages.length > 0 ? messages.map((message: any, index: number) => (
          <div
            key={index}
            className={`flex ${
              message.number % 2 == 1 ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`${
                message.number % 2 == 1
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-600 text-white'
              } p-3 rounded-lg ${
                message.number % 2 == 1 ? 'max-w-xs' : 'w-full'
              }`}
            >
              {message.number % 2 == 0 && message.model && (
                <div className="text-sm text-gray-400 mb-2">{`Model: ${message.model}`}</div>
              )}
              {/* Render Markdown */}
              {/* <MarkdownMessage content={message.text} /> */}
              {message.text}
            </div>
          </div>
        )) : <></>}
          </div>
              {/* Input area */}
                <ChatText onSendData={sendData}/>
            </div>
          </div>
        </div>
      );
    };

export default ChatPage;
