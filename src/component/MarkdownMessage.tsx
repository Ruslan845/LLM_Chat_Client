"use client";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

type Props = {
  content: string;
  speed?: number; // milliseconds between words
};

interface ChildProps {
  onSendData: (isFinished: Boolean) => void;
}

export default function MarkdownReveal({ content, speed = 300, onSendData }: Props & ChildProps) {
  const words = content.split(" ");
  const [currentContent, setCurrentContent] = useState("");
  console.log("words: ", words);

  useEffect(() => {
    console.log("content: ", content);
    let index = 0;

    const interval = setInterval(() => {
      if (index < words.length) {
        setCurrentContent( (prev:any) =>
          prev + (prev ? " " : "") + words[index]
        );
        index++;
      } else {
        clearInterval(interval);
        onSendData(true);
      }
      console.log("currentContent: ", currentContent);
    }, speed);

    return () => clearInterval(interval);
  }, [content, speed]);

  return (
    <div className="prose prose-lg max-w-none text-white p-4">
      <ReactMarkdown>{currentContent}</ReactMarkdown>
    </div>
  );
}
