import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

export const useSocket = () => {
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token'); // or from Redux or auth state
        const socket = io('http://localhost:4000', {
            auth: {
                token: token, // sent in socket.handshake.auth.token
            },
            transports: ['websocket'],
        });
        socketRef.current = socket;

        socket.on('connect', () => {
            console.log('Socket connected:', socket.id);
        });

        socket.on('disconnect', () => {
            console.log('Socket disconnected');
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return socketRef;
};
