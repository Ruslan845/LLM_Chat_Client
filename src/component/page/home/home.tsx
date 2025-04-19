"use client"

import React, { useEffect } from "react";
import ChatText from "./chat";
import {
  addchat,
  gettitlelist
} from "@/store/apis";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";



const HomePage = () => {
  let number = useSelector((state: any) => state.chat !== undefined ? state.chat.chat_id : null);
  const user_id = useSelector((state: any) => state.users.currentuser !== undefined? state.users.currentuser.id : null);
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const dispatch = useDispatch();
  


  const sendData = async (question : string, model : string, tem : number, token : number) => {
    // Function to handle sending data
    setLoading(true);
    // console.log("user_id:", user_id, "question:", question, "model:", model, "number:", number);
    await addchat(question, user_id, model, tem, token, dispatch).then((response: any) => {
      // console.log("Response in addchat:", response);
      setLoading(false);
      router.push(`/chat/${response.chat_list.chat_id}`);
      // Handle the response here
    }
    ).catch((error: any) => {
      console.error("Error:", error);
      // Handle the error here
    }
    );
    // console.log("Data sent");
    // number = null;
  };

  useEffect(() => {
    const data = async() => {
    await gettitlelist(user_id, dispatch).then((response: any) => {
      // console.log("Response:", response);
      // Handle the response here
    }
    ).catch((error: any) => {
      console.error("Error:", error);
      // Handle the error here
    }
    );
  }
  }, []);

  return (
    <div className="flex h-screen bg-black text-white">
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <h1 className="md:text-3xl text-[20px] font-semibold mb-6">
          What do you want to know?
        </h1>

        {/* Search Bar */}
        <ChatText onSendData={sendData}/>
        
        {/* Skill Selection */}

        {/* News and Stock Cards */}
        <div className="w-full max-w-4xl gap-4">
          <div className="bg-gray-800 p-4 rounded-lg flex flex-col">
            <span className="text-white md:text-lg text-base font-bold">
              Join the waitlist to get early access to Comet
            </span>
            <span className="text-gray-600 md:text-base text-sm">
              Introducing Comet, a new browser for agentic search
            </span>
          </div>

          {/* <div className="w-full flex mt-4 gap-4 md:flex-row flex-col">
            <div className="bg-gray-800 md:w-1/3 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex gap-2 items-center lg:text-xl"><Settings /> 73°F
                </div>
                <div className="text-gray-400">Sunny</div>
              </div>

              <div className=" flex text-gray-400 justify-between mt-2 max-lg:text-sm"><div>Dallas</div><div>H: 76° L: 37°</div></div>
            </div>
            <div className="bg-gray-800 md:w-1/3 p-4 rounded-lg flex items-center gap-4">
              <div className="flex items-center max-w-20 overflow-hidden justify-center rounded-sm">
                <Image src={avatar_1} alt="avatar_1" className="max-w-20" />
              </div>
              <div className="max-lg:text-sm">Musk Says X Hit By 'Massive Cyberattack'</div>
            </div>
            <div className="bg-gray-800 md:w-1/3 p-4 rounded-lg flex items-center gap-4">
              <div className="flex items-center max-w-20 overflow-hidden justify-center rounded-sm">
                <Image src={avatar_2} alt="avatar" className="max-w-20" />
              </div>
              <div className="max-lg:text-sm">Student Cracks Century-Old Math...</div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
