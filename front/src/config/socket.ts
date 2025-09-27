import { io, Socket } from 'socket.io-client';

let socketInstance: Socket | null = null;

export const initializeSocket = (userEmail?: string) => {
    if (socketInstance) {
        socketInstance.disconnect();
    }

    socketInstance = io('http://localhost:3000', {
        query: {
            userEmail: userEmail || `User-${Date.now()}`
        },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
    });

    socketInstance.on('connect', () => {
        console.log('Connected to server:', socketInstance?.id);
    });

    socketInstance.on('disconnect', (reason) => {
        console.log('Disconnected from server:', reason);
    });

    socketInstance.on('connect_error', (error) => {
        console.error('Connection error:', error);
    });

    return socketInstance;
};

export const receiveMessage = (eventName: string, callback: (data: any) => void) => {
    if (socketInstance) {
        socketInstance.on(eventName, callback);
    }
};

export const sendMessage = (eventName: string, data: any) => {
    if (socketInstance) {
        socketInstance.emit(eventName, data);
    }
};

export const removeListener = (eventName: string, callback?: (data: any) => void) => {
    if (socketInstance) {
        if (callback) {
            socketInstance.off(eventName, callback);
        } else {
            socketInstance.off(eventName);
        }
    }
};

export const disconnectSocket = () => {
    if (socketInstance) {
        socketInstance.disconnect();
        socketInstance = null;
    }
};

export const getSocketId = () => {
    return socketInstance?.id || null;
};

export const isConnected = () => {
    return socketInstance?.connected || false;
};