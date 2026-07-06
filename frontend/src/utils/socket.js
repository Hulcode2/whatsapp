import { io } from "socket.io-client";

let socket = null;

export const connectSocket = (userId) => {
  socket = io(import.meta.env.VITE_API_URL, {
    query: {
      userId,
    },
    withCredentials: true,
  });

  socket.on("connect", () => {
    console.log("Connected:", socket.id);
  });

  socket.on("disconnect", () => {
    console.log("Disconnected");
  });

  return socket;
};
export const getSocket = () => {
  return socket;
};

export const disconnectSocket = () => {
  socket?.disconnect();
  socket = null;
};
