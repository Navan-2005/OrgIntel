// import socket from "socket.io-client";
import { io } from 'socket.io-client'; // Add this import

let socketInstance =null;

export const initializeSocket = (projectId) => {

    socketInstance = io('http://localhost:3000', {
        query: {
            projectId
        }
    });

    return socketInstance;

}

export const receiveMessage = (eventName, cb) => {
    socketInstance.on(eventName, cb);
}

export const sendMessage = (eventName, data) => {
    socketInstance.emit(eventName, data);
}