"use client"

import React from "react";
import ChatText from "./chat";
import { Settings } from "lucide-react";
import Image from "next/image";
import avatar_1 from "@/../public/avatar.png"
import avatar_2 from "@/../public/avatar-2.jpg"


const HomePage = () => {
  return (
    <div className="flex h-screen bg-black text-white">
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <h1 className="md:text-3xl text-[20px] font-semibold mb-6">
          What do you want to know?
        </h1>

        {/* Search Bar */}
        <ChatText />

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

          <div className="w-full flex mt-4 gap-4 md:flex-row flex-col">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
