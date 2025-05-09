import { io } from "socket.io-client";

let socket: any = null;

export function initSocket() {
  if (!socket) {
    socket = io({
      path: "/api/socketio",
    });
  }

  return socket;
}
