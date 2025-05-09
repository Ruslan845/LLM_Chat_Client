"use server"

import { sendMessage } from "@/lib/socket-server";
import axios from "axios";
import { io } from "socket.io-client";

import {Pinecone} from '@pinecone-database/pinecone';
import { EmbeddingModel, FlagEmbedding } from 'fastembed'
import { Readable } from 'stream';
import { NextApiRequest, NextApiResponse } from 'next'

const baseURLs = {
  "OPENAI_API_KEY": 'https://api.openai.com/v1/chat/completions',
  "DEEPSEEK_API_KEY": 'https://api.deepseek.com/v1/chat/completions',
};

let socket : any = null;


const connect = async () => {
  try {
    // Crucial: Check if the server is ready.  A GET request to the /api/socket route
    // is a good way to signal server readiness.  This prevents a premature connection
    // attempt before the server is prepared.
    await axios.get(`${process.env.NEXT_PUBLIC_AUTH_URL}/api/socket`);

    // Check if socket already exists.  If so, don't create a new one.
    if (socket) {
        return; // Exit if already connected
    }

    const socketInstance = io(process.env.NEXT_PUBLIC_AUTH_URL, {
      path: "/api/socketio",
      transports: ['websocket'], // Explicitly specify WebSocket transport
    });


    socketInstance.on("connect", () => {
      socket = socketInstance; // Assign the socket only after successful connection.
    });

    socketInstance.on("connect_error", (error: any) => {
      console.error("Socket connection error:", error);
      // Important: Handle connection errors.  Consider retry logic here.
      // Example: setTimeout(() => connect(), 5000); // Retry in 5 seconds
    });

    socketInstance.on("disconnect", () => {
        console.log("Disconnected from socket server.");
        socket = null; // Clear the socket on disconnect.
    });

  } catch (error) {
    console.error("Error connecting to server:", error);
    // Important: Handle connection errors.  Consider retry logic here.
  }
};
const embedding = async ( question: string) : Promise<number[]> => {
    const embeddingModel = await FlagEmbedding.init({
        model: EmbeddingModel.BGESmallEN
    })
    const embedding = await embeddingModel.embed([`query: ${question}`]);
    // const batches: number[][] = [];
    // for await(const batch of embedding){
    //     batches.push(batch);
    // }
    for await (const batch of embedding){
        return batch[0];
    }
    throw new Error('No embedding generated.');
}

const RAG = async (question: string) => {
    //first step-generate embedding
    const embed = await embedding(question);

    const pinecone = new Pinecone({
        apiKey: process.env.PINECONE_API_KEY!,
    })
    const index = pinecone.Index(process.env.PINECONE_INDEX!);

    const embeddingRes = "asdfasdf"//
}

const getValueByName = (configArray : Array<any>, nameToFind : string) => {
    let API_key = null;
    if(configArray){
        configArray.map((key:any) => {
        if (key && key.name === nameToFind) {
            API_key=key.value;
        }
        })
    }
    return API_key; // Or undefined, depending on your desired behavior if not found.
}
  
export default async function handler(req: any, res: any) {
  const { id, question, model, temperature, max_tokens, keys } = req.body;

  if(!socket)
    await connect();
  console.log("socket: ", socket);
  if(question && model && temperature && max_tokens && keys){
    let baseURL = baseURLs.OPENAI_API_KEY;
    let key = getValueByName( keys, 'OPENAI_API_KEY');

    let web_search_result = "";

    if(model.startsWith("deep")){
        baseURL = baseURLs.DEEPSEEK_API_KEY;
        key = getValueByName( keys, 'DEEPSEEK_API_KEY');
    }

    const messages = [
      {
        role: "user",
        content: `
    You are tasked with generating a response in Markdown format. Follow these specific formatting rules **only if they are relevant to the user's question.**
    
    ---
    
    🔧 **INTELLIGENT FORMATTING RULES**
    
    1. **Context Awareness**
       - Before responding, evaluate if the question requires a technical, structured, or detailed explanation.
       - If the question is simple or conversational (e.g., "Nice to meet you!"), respond naturally without structure or code.
       - Only use sections, icons, and formatting when the content justifies it.
    
    2. **Use of Icons and Sections**
       - When applicable, include real icons (e.g., 🔹, ⚙️, ✅, 🌐, 💡) to title each section.
       - Start each section with an icon and a title, e.g.:
         \`\`\`
         🔹 Overview
         General information here.
         \`\`\`
    
    3. **Text Structure (if needed)**
       - Use [tab] to indicate indentation:
         - [tab] 1. Main point
         - [tab][tab]- Sub-point
         - [tab][tab][tab]• Deep detail
       - Do **not** use [tab] or icons inside code blocks.
    
    4. **When to Use Code Blocks**
       - Only include code blocks if:
         - The question is about programming or technical concepts.
         - The user likely expects a code sample (e.g., "show me", "with code", "example").
       - Never include code for greetings, social phrases, or casual questions.
    
    5. **Web Search Result Reference (if present)**
       - If \`web_search_result\` is provided, consider referencing its content where relevant.
    
    6. **Examples**
       - For a question like: "What's the difference between Java and JavaScript with sample code?"
         ➤ Use multiple sections, icons, indentation, and code samples.
       - For "Nice to meet you!"
         ➤ Respond with a natural, short message without formatting or code.
    
    ---
    
    📝 **Your task:**
    Provide a **clear, concise**, and **context-appropriate** Markdown response to the following question:
    
    "${question}"
    
    Web search result (if applicable): "${web_search_result}"
    
    Ensure the response respects all formatting rules and does not overformat trivial questions. Avoid including unnecessary sections or code.
    
    DO NOT generate tables. DO NOT include \`\`\`markdown.
        `,
      },
    ];


    try {
      const response = await axios.post(
        baseURL,
        {
          model,
          messages,
          temperature,
          max_tokens,
          stream: true,
        },
        {
          headers: {
            Authorization: `Bearer ${key}`,
            'Content-Type': 'application/json',
          },
          responseType: 'stream',
        }
      );
      
      const stream = response.data as Readable;

      let current_result = "";

      stream.on("data", async (chunk) => {
        try {
          const decodedChunk = new TextDecoder("utf-8").decode(chunk);
          const lines = decodedChunk.split("\n").filter((line) => line.trim() !== "");
          
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const json = line.replace("data: ", "").trim();
              if (json !== "[DONE]") {
                const parsed = JSON.parse(json);
                const content = parsed.choices?.[0]?.delta?.content;
                if (content && socket){
                  // console.log("Sending message to socket server:", content, " socket: ", socket);
                  // sendMessage(content);
                  current_result += content;
                  socket.emit("LLM_response", {
                    id: id,
                    message: current_result,
                    model: model,
                    isnew: true,
                    isfinish: false,
                  });
                }
              }
            }
          }
        } catch (err) {
          console.error("Error processing stream chunk:", err);
        }
      });
  
      stream.on("end", () => {
        console.log("Stream ended");
        socket.emit("LLM_response", {
          id: id,
          message: current_result,
          model: model,
          isnew: true,
          isfinish: true,
        });
        // Important: Tell the server to handle socket.io requests
        if (!res.writableEnded) {
          res.writeHead(200, { "Content-Type": "text/plain" }, response.data);
          res.end();
        }
      });
  
      stream.on("error", (err) => {
        console.error("Stream error:", err);
      });
    } catch (error: any) {
      const msg = error?.response?.data?.error?.message || error.message;
      throw new Error(`API error: ${msg}`);
    }
  }
}