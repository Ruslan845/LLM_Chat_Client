import { Server } from "socket.io";
import { NextApiRequest, NextApiResponse } from "next";

let ioServer: Server | null = null;
let clients: any[] = [];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if ((res.socket as any).server.io) {
    return res.end();
  }

  const io = new Server((res.socket as any).server, {
    cors: {
      origin: "*", // Replace with specific origin(s) in production
      methods: ["GET", "POST"],
    },
    path: "/api/socketio",
  });

  (res.socket as any).server.io = io; // Attach to server to reuse on next calls
  ioServer = io;

  io.on("connection", (socket) => {

    clients.push(socket);

    socket.on("disconnect", () => {
      clients = clients.filter((client) => client.id !== socket.id);
    });

    socket.on("message", (msg: any) => {
    });

    // Broadcast LLM response to all clients
    socket.on("LLM_response", (data: any) => {
      clients.forEach((client) => {
        if (client.connected) {
          client.emit("LLM_response", data);
        }
      });
    });
  });

  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Socket server started");
}
