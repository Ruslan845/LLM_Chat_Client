"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { prism } from "react-syntax-highlighter/dist/cjs/styles/prism";
import rehypeRaw from "rehype-raw"; // To allow raw HTML like <div>

// CodeBlock Component
interface CodeBlockProps {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode; // Make children optional
  [key: string]: any;
}

const CodeBlock: React.FC<CodeBlockProps> = ({
  inline,
  className,
  children,
  ...props
}) => {
  const match = /language-(\w+)/.exec(className || "");
  const code = String(children).replace(/\n$/, "");

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    alert("Code copied to clipboard!");
  };

  return !inline && match ? (
    <div className="relative">
      <SyntaxHighlighter
        style={prism}
        language={match[1]}
        PreTag="div"
        {...props}
      >
        {code}
      </SyntaxHighlighter>
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 bg-blue-500 text-white border-none px-2 py-1 rounded cursor-pointer"
      >
        Copy
      </button>
    </div>
  ) : (
    <code className={className} {...props}>
      {children}
    </code>
  );
};

// MarkdownMessage Component
interface MarkdownMessageProps {
  content: string;
}

export default function MarkdownMessage({ content }: MarkdownMessageProps) {
  const parseContent = (text: string) => {
    const sections = text.split(/```.*?\n[\s\S]*?```/g); // Split by code blocks
    const codeBlocks = text.match(/```.*?\n[\s\S]*?```/g) || []; // Extract code blocks

    const elements: React.ReactNode[] = [];
    let codeIndex = 0;

    sections.forEach((section, index) => {
      // Replace [tab] with spaces and split into individual lines
      const lines = section
        .split("\n") // Split into lines
        .map((line, lineIndex) => {
          // Count the number of [tab] markers in the line
          const tabCount = (line.match(/\[tab\]/g) || []).length;

          // Remove [tab] markers and calculate margin-left
          const cleanedLine = line.replace(/\[tab\]/g, "").replace(/\**/g,"");
          const marginLeft = tabCount * 20; // Each [tab] adds 20px margin

          // Check if the line contains any icon (Unicode emoji or symbols)
          const containsIcon = /[\u{1F300}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u.test(cleanedLine);

          // Check if the line is a numbered sub-item
          const isNumberedSubItem = /^\d+\./.test(cleanedLine.trim());

          // Add a break line before icon text
          if (containsIcon) {
            return (
              <React.Fragment key={`icon-line-${index}-${lineIndex}`}>
                <br key={`break-${index}-${lineIndex}`} />
                <pre
                  key={`line-${index}-${lineIndex}`}
                  style={{ marginLeft: `${marginLeft}px` }}
                  className={`plain-text mb-0 whitespace-pre-wrap text-2xl font-bold`} // Larger size and bold if icon is present
                >
                  {cleanedLine.trim()}
                </pre>
              </React.Fragment>
            );
          }

          return (
            <pre
              key={`line-${index}-${lineIndex}`}
              style={{ marginLeft: `${marginLeft}px` }}
              className={`plain-text mb-0 whitespace-pre-wrap ${
                isNumberedSubItem
                  ? "text-lg font-semibold" // Slightly smaller and bold for numbered sub-items
                  : ""
              }`}
            >
              {cleanedLine.trim()}
            </pre>
          );
        });

      // Add plain text or Markdown content
      if (lines.length > 0) {
        elements.push(...lines);
      }

      // Add code blocks
      if (codeIndex < codeBlocks.length) {
        const codeBlock = codeBlocks[codeIndex];
        const languageMatch = codeBlock.match(/```(\w+)?/);
        const language = languageMatch ? languageMatch[1] : undefined;
        const code = codeBlock.replace(/```.*?\n/, "").replace(/```$/, "");

        elements.push(
          <ReactMarkdown
            key={`code-${codeIndex}`}
            rehypePlugins={[rehypeRaw]}
            components={{
              code: ({ inline, className, children, ...props }: CodeBlockProps) => (
                <CodeBlock
                  inline={inline}
                  className={className || `language-${language}`}
                  {...props}
                >
                  {children}
                </CodeBlock>
              ),
              b: ({ children, ...props }) => (
                <b {...props}>
                  {children}
                </b>
              ),
            }}
          >
            {`\`\`\`${language || ""}\n${code}\n\`\`\``}
          </ReactMarkdown>
        );

        codeIndex++;
      }
    });

    return elements;
  };

  return <div className="response-container">{parseContent(content)}</div>;
}