import { MutableRefObject } from "react";
import { Socket } from "socket.io-client";

export const useUserMessageAction = (socketRef: MutableRefObject<Socket | null>) => {
  const sendMessage = (message: string) => {
    if (socketRef.current) {
      socketRef.current.emit("sendMessage", { message });
      console.log("Sent message:", message);
    }
  };

  const receiveMessage = (callback: (message: string) => void) => {
    if (socketRef.current) {
      socketRef.current.on("receiveMessage", (data) => {
        console.log("Message received:", data.message);
        callback(data.message);
      });
    }
  };

  return { sendMessage, receiveMessage };
};
