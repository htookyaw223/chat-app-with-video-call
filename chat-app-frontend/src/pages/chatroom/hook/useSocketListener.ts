import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";

interface Message {
    user: string;
    text: string;
    timestamp: string;
    isSentByCurrentUser: boolean;
}
export const useSocketListener = (socketRef: React.MutableRefObject<Socket | null>) => {
    const [messages, setMessages] = useState<Message[]>([]);
    useEffect(() => {
        if (!socketRef.current) return;
        socketRef.current.on('userStatus', (data) => {
            console.log('User status update:', data);
        });

        socketRef.current.on('receiveMessage', (data) => {
            console.log('Message received:', data);
            const newMessage: Message = {
                user: data.sender.payload.username, // Assuming userId is the sender's ID
                text: data.message,
                timestamp: new Date().toLocaleTimeString(),
                isSentByCurrentUser: false,
            };
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        });
        return () => {
            socketRef.current?.off('userStatus');
        };
    }, [socketRef]);
    
    return { messages, setMessages };
}