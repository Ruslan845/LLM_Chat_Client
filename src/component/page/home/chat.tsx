import { useState, useEffect, useRef } from "react";
import { FaGlobe, FaPaperclip, FaArrowRight, FaStop } from "react-icons/fa";
import { Brain, Cpu, Zap, ScrollText, Globe, FunctionSquare, MessageCircle, Search, Shuffle, LoaderPinwheel } from "lucide-react";

const modelOptions = {
  OpenAI: {
    description: "There are GPT models",
    icon: MessageCircle,
    options: [
      {
        title: "gpt-4o",
        icon: Brain,
        description: "Best for Advanced Reasoning & Multimodal Tasks",
        value: "gpt-4o",
      },
      {
        title: "gpt-4-turbo",
        icon: Cpu,
        description: "Best for Code Completion",
        value: "gpt-4-turbo",
      },
      {
        title: "gpt-3.5-turbo",
        icon: Zap,
        description: "Best for Speed & Cost-Efficiency",
        value: "gpt-3.5-turbo",
      },
      {
        title: "text-davinci-003",
        icon: ScrollText,
        description: "Best for Text Completion (Legacy)",
        value: "text-davinci-003",
      },
    ],
  },
  DeepSeek: {
    description: "There are DeepSeek models",
    icon: Search,
    options: [
      {
        title: "DeepSeek-V3",
        icon: Globe,
        description: "Best for Multilingual, Real-time marketing and so on",
        value: "deepseek-chat",
      },
      {
        title: "DeepSeek-R1",
        icon: FunctionSquare,
        description: "Best for Math, Coding, Reasoning and so on",
        value: "deepseek-reasoner",
      },
    ],
  },
};

type TwoStepModelSelectorProps = {
  model: string;
  onModelChange: (value: string) => void;
};

const TwoStepModelSelector = ({
  model,
  onModelChange,
}: TwoStepModelSelectorProps) => {
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState("bottom");
  const [title, setTitle] = useState("gpt-3.5-turbo");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsDropdownOpen(false);
    }
  };

  const checkDropdownPosition = () => {
    if (buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - buttonRect.bottom;
      setDropdownPosition(spaceBelow < 300 ? "top" : "bottom");
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("resize", checkDropdownPosition);
    checkDropdownPosition();

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", checkDropdownPosition);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        ref={buttonRef}
        onClick={() => setIsDropdownOpen((prev) => !prev)}
        className="bg-gray-700 text-white px-4 py-2 rounded-lg cursor-pointer w-40 h-10"
      >
        {title}
      </button>

      {isDropdownOpen && (
        <div
          className={`absolute z-10 bg-gray-800 border border-gray-600 rounded-lg w-56 ${
            dropdownPosition === "top"
              ? "bottom-full mb-2"
              : "top-full mt-2"
          }`}
        >
          {Object.entries(modelOptions).map(([groupKey, groupData]) => (
            <div
              key={groupKey}
              className="relative"
              onMouseEnter={() => setOpenGroup(groupKey)}
              onMouseLeave={() => setOpenGroup(null)}
            >
              <div className="hover:bg-gray-700 px-4 py-2 cursor-pointer">
                <div className="flex items-center mb-1">
                  <div className="mr-2">
                    {groupKey === "OpenAI" ? (
                      <Shuffle size={20} />
                    ) : (
                      <LoaderPinwheel size={20} />
                    )}
                  </div>
                  <div>{groupKey}</div>
                </div>
                <div className="text-sm text-gray-400">
                  {groupData.description}
                </div>
              </div>

              {openGroup === groupKey && (
                <div
                  className="absolute left-full bg-gray-800 border border-gray-600 rounded-lg w-64 z-20"
                  style={{
                    top: dropdownPosition === "top" ? "auto" : 0,
                    bottom: dropdownPosition === "top" ? 0 : "auto",
                  }}
                >
                  {groupData.options.map(({ title, icon: Icon, description, value }) => (
                    <div
                      key={title}
                      className={`flex flex-col items-start px-4 py-2 hover:bg-gray-700 cursor-pointer ${
                        title === model ? "bg-gray-700" : ""
                      }`}
                      onClick={() => {
                        onModelChange(value);
                        setTitle(title);
                        setIsDropdownOpen(false);
                      }}
                    >
                      <div className="flex items-center">
                        <Icon size={20} className="mr-2" />
                        <span>{title}</span>
                      </div>
                      <span className="text-gray-400 text-sm">
                        {description}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

type Props = {
  isfinished?: boolean;
};

interface ChildProps {
  onSendData: (data: string, data1: string) => void;
}

const ChatText = ({ onSendData, isfinished }: ChildProps & Props) => {
  const [file, setFile] = useState<File | null>(null);
  const [question, setQuestion] = useState("");
  const [model, setModel] = useState("gpt-3.5-turbo");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
  };

  const handleSendQuestion = () => {
    if (question.trim() === "") return;

    onSendData(question, model);
    setQuestion("");
    setFile(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendQuestion();
      e.preventDefault();
    }
  };

  return (
    <div className="relative w-full border border-gray-600 max-w-4xl mb-4 bg-gray-800 rounded-xl p-4">
      <input
        type="text"
        placeholder="Ask anything..."
        className="w-full bg-transparent text-white focus:outline-none placeholder-gray-400"
        value={question}
        onKeyDown={handleKeyDown}
        onChange={(e) => setQuestion(e.target.value)}
      />

      <div className="w-full justify-between mt-8 flex items-center">
        <TwoStepModelSelector model={model} onModelChange={setModel} />
        <div className="flex items-center">
          <button className="mx-2 text-gray-400 hover:text-white">
            <FaGlobe />
          </button>
          <label className="relative mx-2 text-gray-400 hover:text-white cursor-pointer">
            <input
              type="file"
              className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleFileChange}
            />
            <FaPaperclip />
          </label>
          <button
            className="bg-gray-700 p-2 rounded-3xl text-gray-400 hover:bg-gray-600"
            onClick={handleSendQuestion}
          >
            {isfinished ? <FaArrowRight /> : <FaStop />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatText;

// "use client"

// import { Atom, Lightbulb, LoaderPinwheel, Shuffle } from "lucide-react";
// import { FaGlobe, FaPaperclip, FaArrowRight, FaStop } from "react-icons/fa";
// import ComboboxExt from "../../common-component/combobox";
// import { useState } from "react";

// type Props = {
//     isfinished? : Boolean;
// }

// interface ChildProps {
//     onSendData: (data: string, data1 : string) => void;
// }

// const ChatText = ({onSendData, isfinished} : ChildProps & Props) => {
//     const [file, setFile] = useState(null);0
//     const [question, setQuestion] = useState("");
//     const [model, setModel] = useState("gpt-3.5-turbo");

//     const options = [
//         {
//             title: "gpt-4",
//             icon: Shuffle,
//             description: "Original GPT-4, slower and more expensive than Turbo."
//         },
//         {
//             title: "gpt-4-turbo",
//             icon: LoaderPinwheel,
//             description: "Faster, cheaper, and supports larger context windows (up to 128K tokens). Preferred for most GPT-4 use."
//         },
//         {
//             title: "gpt-3.5-turbo",
//             icon: Shuffle,
//             description: "Fast, affordable, great for most tasks."
//         },
//         {
//             title: "gpt-3.5-turbo-16k",
//             icon: LoaderPinwheel,
//             description: "Same as above, but with 4x more context length."
//         },
//         // {
//         //     title: "Reasoning",
//         //     icon: Lightbulb,
//         //     description: "Advanced problem solving"
//         // },
//         // {
//         //     title: "Deep Research",
//         //     icon: Atom,
//         //     description: "In-depth reports on complex topics"
//         // }
//     ]

//     const handleFileChange = (e: any) => {
//         setFile(e.target.files[0]);
//     };

//     const handleSendQuestion = () => {
//         if (question.trim() === "") {
//             return;
//         }

//         onSendData(question, model);
//         setQuestion("");
//         setFile(null);
//     };

//     const onValueChange = (value: string) => {
//         // console.log("onValueChange", value);
//         setModel(value);
//     };

//     const handleKeyDown = (e : React.KeyboardEvent<HTMLInputElement>) => {
//         if(e.key === 'Enter') {
//             handleSendQuestion();
//             e.preventDefault(); // Prevent form submission when Enter key is pressed
//         }
//     };

//     return (
//         <div className="relative w-full border border-gray-600 max-w-4xl mb-4 bg-gray-800 rounded-xl block items-center p-4">
//             <input
//                 type="text"
//                 placeholder="Ask anything..."
//                 className="w-full flex-1 bg-transparent text-white focus:outline-none placeholder-gray-400"
//                 value={question}
//                 onKeyDown={handleKeyDown}
//                 onChange={(e) => setQuestion(e.target.value)}
//             />

//             <div className="w-full justify-between mt-8 flex items-center rounded-lg">
//                 <ComboboxExt
//                     onFilterChange={onValueChange}
//                     options={options}
//                     value={model}
//                 />
//                 <div className="flex">

//                     <button className="mx-2 text-gray-400 hover:text-white">
//                         <FaGlobe />
//                     </button>

//                     <button className="mx-2 text-gray-400 hover:text-white relative">
//                         <input type="file" className="w-6 h-6 cursor-pointer absolute top-1 left-[-5px] opacity-0" onChange={(e) => handleFileChange(e)} />
//                         <FaPaperclip />
//                     </button>
//                     <button className="bg-gray-700 p-2 rounded-3xl text-gray-400 hover:bg-gray-600" onClick={handleSendQuestion}>
//                     {isfinished ?
//                         <FaArrowRight /> : <FaStop />
//                     }
//                     </button>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default ChatText