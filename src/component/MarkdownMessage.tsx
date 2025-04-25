"use client";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

type Props = {
  content: string;
  speed?: number; // milliseconds between words
};

export default function MarkdownReveal({ content, speed = 100 }: Props) {
  const words = content.split(" ");
  const [currentContent, setCurrentContent] = useState("");
  // const [index, setIndex] = useState(0);
  let index = 0;

  useEffect(() => {

    const interval = setInterval(() => {
      const i = index;
      if (i < words.length) {
        setCurrentContent((prev : any) => {
            return prev + (prev ? " " : "") + words[i]
        });
        index++;
      } else {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval); // Important cleanup
  }, [content, speed]);

  return (
    <div>
      <ReactMarkdown>{currentContent}</ReactMarkdown>
    </div>
  );
}