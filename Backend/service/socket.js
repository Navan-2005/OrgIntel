const socket = require('socket.io');

let io;

module.exports = {
    init: (server) => {
        io = socket(server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"]
            }
        });

        // Track room data
        const rooms = {};

        io.on('connection', (socket) => {
            console.log('new client joined');
            
            let currentRoom = null;
            let currentUser = null;

            // Join room
            socket.on('join', (roomId, user) => {
                currentRoom = roomId;
                currentUser = user;
                
                socket.join(roomId);
                
                // Initialize room if it doesn't exist
                if (!rooms[roomId]) {
                    rooms[roomId] = {
                        users: [],
                        currentPage: 1,
                        pdf: null
                    };
                }
                
                // Add user to room
                rooms[roomId].users.push(user);
                
                // Notify others in the room
                socket.to(roomId).emit('user-connected', user);
                
                // Send current room state to the new user
                socket.emit('room-state', {
                    currentPage: rooms[roomId].currentPage,
                    pdf: rooms[roomId].pdf,
                    users: rooms[roomId].users
                });
            });

            // Handle page scrolling
            socket.on("scroll-page", ({ roomId, user, docId, page }) => {
                if (rooms[roomId]) {
                    rooms[roomId].currentPage = page;
                    socket.to(roomId).emit("scroll-sync", { page });
                }
            });

            // Handle new PDF upload
            socket.on("new-pdf", ({ roomId, fileName }) => {
                if (rooms[roomId]) {
                    rooms[roomId].pdf = fileName;
                    rooms[roomId].currentPage = 1;
                    io.to(roomId).emit("pdf-updated", { 
                        fileName, 
                        currentPage: 1 
                    });
                }
            });

            // Disconnect
            socket.on('disconnect', () => {
                if (currentRoom && currentUser) {
                    if (rooms[currentRoom]) {
                        rooms[currentRoom].users = rooms[currentRoom].users.filter(
                            u => u.id !== currentUser.id
                        );
                        
                        if (rooms[currentRoom].users.length === 0) {
                            delete rooms[currentRoom];
                        } else {
                            socket.to(currentRoom).emit('user-disconnected', currentUser);
                        }
                    }
                }
            });
        });

        return io;
    },

    getIo: () => {
        if (!io) throw new Error("Socket.io not initialized");
        return io;
    }
};