"use client"

import { Atom, Lightbulb, LoaderPinwheel, Shuffle } from "lucide-react";
import { FaGlobe, FaPaperclip, FaArrowRight } from "react-icons/fa";
import ComboboxExt from "../../common-component/combobox";
import { useState } from "react";

interface ChildProps {
    onSendData: (data: string, data1 : string) => void;
}

const ChatText = ({onSendData} : ChildProps) => {
    const [file, setFile] = useState(null);
    const [question, setQuestion] = useState("");
    const [model, setModel] = useState("");

    const options = [
        {
            title: "gpt-3.5-turbo",
            icon: Shuffle,
            description: "Cheapest and best free start"
        },
        {
            title: "text-davinci-003",
            icon: LoaderPinwheel,
            description: "Legacy completion model"
        },
        // {
        //     title: "Reasoning",
        //     icon: Lightbulb,
        //     description: "Advanced problem solving"
        // },
        // {
        //     title: "Deep Research",
        //     icon: Atom,
        //     description: "In-depth reports on complex topics"
        // }
    ]

    const handleFileChange = (e: any) => {
        setFile(e.target.files[0]);
    };

    const handleSendQuestion = () => {
        if (question.trim() === "") {
            return;
        }

        onSendData(question, model);
        setQuestion("");
        setFile(null);
    };

    const onValueChange = (value: string) => {
        console.log("onValueChange", value);
        setModel(value);
    };

    return (
        <div className="relative w-full border border-gray-600 max-w-4xl mb-4 bg-gray-800 rounded-xl block items-center p-4">
            <input
                type="text"
                placeholder="Ask anything..."
                className="flex-1 bg-transparent text-white focus:outline-none placeholder-gray-400"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
            />

            <div className="w-full justify-between mt-8 flex items-center rounded-lg">
                <ComboboxExt
                    onFilterChange={onValueChange}
                    options={options}
                    value={model}
                />
                <div className="flex">

                    <button className="mx-2 text-gray-400 hover:text-white">
                        <FaGlobe />
                    </button>


                    <button className="mx-2 text-gray-400 hover:text-white relative">
                        <input type="file" className="w-6 h-6 cursor-pointer absolute top-1 left-[-5px] opacity-0" onChange={(e) => handleFileChange(e)} />
                        <FaPaperclip />
                    </button>

                    <button className="bg-gray-700 p-2 rounded-3xl text-gray-400 hover:bg-gray-600" onClick={handleSendQuestion}>
                        <FaArrowRight />
                    </button>

                </div>
            </div>
        </div>
    )
}

export default ChatText