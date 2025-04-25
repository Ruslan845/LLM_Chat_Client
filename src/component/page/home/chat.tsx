import { useState, useEffect, useRef } from "react";
import {
  FaGlobe,
  FaPaperclip,
  FaArrowRight,
  FaStop,
} from "react-icons/fa";
import {
  Cpu,
  Zap,
  Globe,
  FunctionSquare,
  MessageCircle,
  Search,
  Shuffle,
  LoaderPinwheel,
  SlidersHorizontal,
  BarChart4,
  Microscope,
  BrainCircuit,
} from "lucide-react";

const modelOptions = {
  OpenAI: {
    description: "There are GPT models",
    icon: MessageCircle,
    options: [
      { title: "gpt-4o(Omni)", icon: Microscope, description: "Best for: Real-time multimodal interaction", value: "gpt-4o", maxtoken: 8192 },
      { title: "gpt-4-turbo", icon: Cpu, description: "Best for: Cost-effective coding reasoning", value: "gpt-4-turbo", maxtoken: 16384 },
      { title: "gpt-3.5-turbo", icon: Zap, description: "Best for: Lightweight & fast tasks", value: "gpt-3.5-turbo", maxtoken: 4096 },
      { title: "gpt-4(legacy)", icon: BrainCircuit, description: "Best for: Logical reasoning & complex tasks", value: "gpt-4", maxtoken: 4096 },
    ],
  },
  DeepSeek: {
    description: "There are DeepSeek models",
    icon: Search,
    options: [
      { title: "DeepSeek-V3", icon: Globe, description: "Best for Multilingual, Real-time marketing and so on", value: "deepseek-chat", maxtoken: 4096 },
      { title: "DeepSeek-R1", icon: FunctionSquare, description: "Best for Math, Coding, Reasoning and so on", value: "deepseek-reasoner", maxtoken: 4096 },
    ],
  },
};

type TwoStepModelSelectorProps = {
  model: string;
  onModelChange: (value: string) => void;
};

const TwoStepModelSelector = ({ model, onModelChange }: TwoStepModelSelectorProps) => {
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState("bottom");
  const [selectedTitle, setSelectedTitle] = useState("gpt-3.5-turbo");
  const [selectedIcon, setSelectedIcon] = useState(() => Zap);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const found = Object.values(modelOptions)
      .flatMap(group => group.options)
      .find(opt => opt.value === model);
    if (found) {
      setSelectedTitle(found.title);
      setSelectedIcon(() => found.icon);
    }
  }, [model]);

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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
        className="bg-gray-700 text-white px-4 py-2 rounded-lg cursor-pointer w-52 h-10 flex items-center gap-2"
      >
        {/* {selectedIcon && <selectedIcon size={18} />} */}
        <span>{selectedTitle}</span>
      </button>

      {isDropdownOpen && (
        <div className={`absolute z-10 bg-gray-800 text-white border border-gray-600 rounded-lg w-56 ${dropdownPosition === "top" ? "bottom-full mb-2" : "top-full mt-2"}`}>
          {Object.entries(modelOptions).map(([groupKey, groupData]) => (
            <div key={groupKey} className="relative" onMouseEnter={() => setOpenGroup(groupKey)} onMouseLeave={() => setOpenGroup(null)}>
              <div className="hover:bg-gray-700 px-4 py-2 cursor-pointer">
                <div className="flex items-center mb-1">
                  <div className="mr-2">{groupKey === "OpenAI" ? <Shuffle size={20} /> : <LoaderPinwheel size={20} />}</div>
                  <div>{groupKey}</div>
                </div>
                <div className="text-sm text-gray-400">{groupData.description}</div>
              </div>

              {openGroup === groupKey && (
                <div className="absolute left-full bg-gray-800 border border-gray-600 rounded-lg w-64 z-20"
                  style={{ top: dropdownPosition === "top" ? "auto" : 0, bottom: dropdownPosition === "top" ? 0 : "auto" }}
                >
                  {groupData.options.map(({ title, icon: Icon, description, value }) => (
                    <div
                      key={title}
                      className={`flex flex-col items-start px-4 py-2 hover:bg-gray-700 cursor-pointer ${title === selectedTitle ? "bg-gray-700" : ""}`}
                      onClick={() => {
                        onModelChange(value);
                        setIsDropdownOpen(false);
                      }}
                    >
                      <div className="flex items-center">
                        <Icon size={20} className="mr-2" />
                        <span>{title}</span>
                      </div>
                      <span className="text-gray-400 text-sm">{description}</span>
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
  isfinished?: boolean, startmodel: string;
};

interface ChildProps {
  onSendData: (data: string, model: string, tem: number, token: number, web: boolean) => void;
}

const ChatText = ({ onSendData, isfinished, startmodel }: ChildProps & Props) => {
  const [file, setFile] = useState<File | null>(null);
  const [question, setQuestion] = useState("");
  const [model, setModel] = useState(startmodel);
  const [temperature, setTemperature] = useState(0.7);
  const [maxToken, setMaxToken] = useState(1000);
  const [max, setMax] = useState(4096);
  const [showTempInput, setShowTempInput] = useState(false);
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [webSearchEnabled, setWebSearchEnabled] = useState(false);


  useEffect(() => {
    const max_v = Object.values(modelOptions).flatMap((group) => group.options).find((m) => m.value === model)?.maxtoken;
    if (max_v) setMax(max_v);
  }, [model]);

  useEffect(() => {
    setModel(startmodel);
  }, [startmodel])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => setFile(e.target.files?.[0] || null);

  const handleSendQuestion = () => {
    if (question.trim() === "") return;
    onSendData(question, model, temperature, maxToken, webSearchEnabled);
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
        <div className="flex items-center gap-3 h-10">
          {/* 🌐 Language/Globe */}
          <div className="relative group w-10 h-10 flex items-center justify-center">
            <button
              className={`w-full h-full flex items-center justify-center rounded ${webSearchEnabled
                  ? 'text-blue-400 bg-gray-700 hover:text-blue-300'
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setWebSearchEnabled(prev => !prev)}
            >
              <FaGlobe />
              {model}
            </button>
            <span className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-700 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap">
              Web search
            </span>
          </div>


          {/* 🎛️ Temperature */}
          <div className="relative group w-10 h-10 flex items-center justify-center">
            <button
              className="flex items-center justify-center text-gray-400 hover:text-white w-full h-full"
              onClick={() => {
                setShowTempInput(!showTempInput);
                setShowTokenInput(false);
              }}
            >
              <SlidersHorizontal size={18} />
            </button>
            <span className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-700 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap">
              Temperature
            </span>
            {showTempInput && (
              <input
                type="number"
                min={0}
                max={1}
                step={0.01}
                value={temperature}
                onChange={(e) => setTemperature(Math.min(1, Math.max(0, parseFloat(e.target.value))))}
                className="absolute top-10 right-0 w-20 bg-gray-700 text-white border border-gray-600 rounded px-2 py-1"
              />
            )}
          </div>

          {/* 📊 Max Tokens */}
          <div className="relative group w-10 h-10 flex items-center justify-center">
            <button
              className="flex items-center justify-center text-gray-400 hover:text-white w-full h-full"
              onClick={() => {
                setShowTokenInput(!showTokenInput);
                setShowTempInput(false);
              }}
            >
              <BarChart4 size={18} />
            </button>
            <span className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-700 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap">
              Max Tokens
            </span>
            {showTokenInput && (
              <input
                type="number"
                min={1}
                max={max}
                step={1}
                value={maxToken}
                onChange={(e) => setMaxToken(parseInt(e.target.value, 10))}
                className="absolute top-10 right-0 w-24 bg-gray-700 text-white border border-gray-600 rounded px-2 py-1"
              />
            )}
          </div>

          {/* 📎 Attachment */}
          <div className="relative group w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white cursor-pointer">
            <label className="cursor-pointer">
              <input
                type="file"
                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileChange}
              />
              <FaPaperclip />
            </label>
            <span className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-700 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap">
              Attach File
            </span>
          </div>

          {/* ➡️ or ⏹ Send/Stop */}
          <div className="w-10 h-10 flex items-center justify-center">
            <button
              className="w-full h-full bg-gray-700 rounded-full text-gray-400 hover:bg-gray-600"
              onClick={handleSendQuestion}
            >
              {!isfinished ? <FaArrowRight /> : <FaStop />}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ChatText;
