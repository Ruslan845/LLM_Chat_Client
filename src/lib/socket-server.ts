import { Server } from "socket.io";
import axios from "axios";
import { initSocket } from "@/lib/socket";
import { io } from "socket.io-client";

let socket : any = null;

const connect = async () => {
  await axios.get("/api/socket");
  const socketInstance = io({
    path: "/api/socketio",
  });
  console.log("Socket instance created: ", socketInstance);
  socketInstance.on("connect", () => {
    console.log("Server client connected to socket server");
    socket = socketInstance;
    console.log("Socket instance set: ", socket);
  });
}

export async function sendMessage(message: string) {
  // console.log("socket: ", socket)
  // if (!socket) {
  await connect();
  // }

  try {
    // socket.emit("LLM_response", message);
    console.log("Message sent:", message, " socket: ", socket);
  } catch (error) {
    console.error("Error sending message:", error);
  }
}