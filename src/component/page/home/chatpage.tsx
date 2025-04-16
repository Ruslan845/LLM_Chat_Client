"use client"

import React, { useEffect, useState, useRef } from 'react';
import ChatText from "./chat";
import { useDispatch, useSelector } from 'react-redux';
import { askquestion, getchat } from '@/store/apis';
import MarkdownReveal from '@/component/MarkdownMessage';
import { addtext } from '@/store/chatSlice';

const ChatPage = ({id} : {id:string}) => {

    const user = useSelector((state: any) => state.users.currentuser);
    const messages = useSelector((state: any) => state.chats.chats);
    const [loading, setLoading] = useState(false);
    const [typing, setTyping] = useState(false);
    const dispatch = useDispatch();
    const scrollRef = useRef(null);

    useEffect(()  => {
        const get = async () => {
            await getchat(id, dispatch).then((response: any) => {
                // console.log("Response:", response);
            }).catch((error: any) => {
                console.error("Error:", error);
            });
        }
        get();
    }, [id]);

    const sendData = async (question : string, model : string) => {
        setLoading(true);
        const date = new Date();
        const date_string = date.toISOString().replace('Z', '') + '000'; // Remove 'Z' and add microseconds
        dispatch(addtext({
            "role": "user",
            "text": question,
            "model": model,
            "date": date_string,
            "deleteddate": null
        }));
        setTyping(true);
        scrollToBottom();
        await askquestion(question, model, id, dispatch).then((response: any) => {
            // console.log("Response:", response);
        }).catch((error: any) => {
            console.error("Error:", error);
        });
        setLoading(false);
    };

    const onDeleteButton = async (id : Number) => {

    }

    const scrollToBottom = () => {
        if (scrollRef.current) {
            (scrollRef.current as HTMLElement).scrollTop = (scrollRef.current as HTMLElement).scrollHeight;
        }
    }

    const onSendData = (para : Boolean) => {
        if(para) setTyping(false);
    }

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
                          <div className='relative group w-full'>
                            <div key={index} className={`flex ${message.role == "user" ? 'justify-end' : 'justify-start'}`}>
                                <div className={`${message.role == "user" ? 'bg-blue-500 text-white' : 'bg-gray-600 text-white'} p-3 rounded-lg ${message.role == "user" ? 'max-w-xs' : 'w-full'}`}>
                                    {message.role == "bot" && message.model && (
                                        <div className="text-sm text-gray-400 mb-2">{`Model: ${message.model}`}</div>
                                    )}
                                    {message.role == "bot" ? (
                                        <MarkdownReveal content={message.text} onSendData={onSendData}/>
                                    ) : (
                                        <>{message.text}</>
                                    )}
                                </div>
                                <button
                                  type="button"
                                  onClick={() => onDeleteButton(index)}
                                  className={`absolute right-1 bottom-1 text-gray-500 hover:text-red-500 hidden group-hover:block px-1 text-sm font-bold`}
                                >
                                  ×
                                </button>
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
                    <ChatText onSendData={sendData} isfinished={typing}/>
                </div>
            </div>
        </div>
        </>
    );
};

export default ChatPage;
