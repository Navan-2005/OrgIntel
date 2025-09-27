const dotenv = require('dotenv')
const express = require('express');
const bodyParser = require("body-parser");
dotenv.config();
const app = express();
const multer = require('multer');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const axios = require('axios');

const port = process.env.PORT || 3000;
const { main, search, searchWithContext, storeinchroma, storechatHistory, getChatHistory } = require('./service/pdf.js');
const PDFController = require('./controller/pdfController.js');
const pdfRouter = require('./routes/pdfRoutes.js')
const userRouter = require('./routes/userroutes.js')
const mcprouter = require('./routes/mcproutes.js')
const connectDB = require('./db/db.js')

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());

const upload = multer();

app.use('/pdf', pdfRouter)
app.use('/users', userRouter)
app.use('/mcp', mcprouter)

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

// Store active users in rooms and their session data
const activeUsers = new Map();
const roomMessages = new Map();
const userSessions = new Map(); // Store sessionId for each user

// Enhanced AI Response Generator Function
async function generateResult(prompt, sessionId = null, userEmail = 'anonymous') {
    try {
        // If we have a sessionId, try to get context from uploaded documents and chat history
        if (sessionId) {
            console.log(`🤖 Generating AI response with PDF context for session: ${sessionId}`);
            
            // Use your existing PDF chat system
            const { documents, chatHistory } = await searchWithContext(prompt, sessionId);
            
            if (documents && documents.length > 0) {
                // Create a request object similar to what your PDFController expects
                const mockReq = {
                    body: {
                        question: prompt,
                        sessionId: sessionId,
                        model: 'gemini-2.0-flash-lite'
                    }
                };
                
                const mockRes = {
                    status: (code) => ({
                        json: (data) => data
                    })
                };
                
                try {
                    // Use your existing PDF controller logic
                    const response = await PDFController.chat(mockReq, mockRes);
                    if (response && response.answer) {
                        return `📄 **AI Response (with document context):**\n\n${response.answer}`;
                    }
                } catch (pdfError) {
                    console.log('PDF chat error, falling back to general response:', pdfError.message);
                }
            } else {
                return `📄 **AI Response:** I don't have any document context for session ${sessionId}. Please upload some PDF files first, or I can help with general questions.`;
            }
        }

        // For general AI chat without documents, use MCP or fallback response
        try {
            const response = await axios.post('http://localhost:3000/mcp/chat', {
                message: prompt,
                userId: 'shared-ai-user'
            });
            return `🤖 **AI Response:**\n\n${response.data.response || response.data.answer || "I'm here to help! Ask me anything."}`;
        } catch (mcpError) {
            console.log('MCP not available, using fallback response');
            // Fallback response with basic intelligence
            return generateFallbackResponse(prompt, userEmail);
        }
    } catch (error) {
        console.error('AI Generation Error:', error);
        return `❌ **AI Error:** Sorry, I encountered an error while processing your request: ${error.message}. Please try again.`;
    }
}

// Fallback response generator for when external AI services are unavailable
function generateFallbackResponse(prompt, userEmail) {
    const responses = [
        `Hello ${userEmail}! You asked: "${prompt}". I'm an AI assistant ready to help with questions, analysis, and conversations. Unfortunately, my advanced AI services are temporarily unavailable, but I'm still here to chat!`,
        `Thanks for your question about "${prompt}". While I don't have access to my full AI capabilities right now, I can tell you that I'm designed to help with document analysis, answer questions, and engage in meaningful conversations.`,
        `Interesting question: "${prompt}". I'm currently running in basic mode, but I'd love to help however I can. Try uploading some PDF documents for me to analyze, or ask me anything else!`
    ];
    return `🤖 **AI Response (Basic Mode):**\n\n${responses[Math.floor(Math.random() * responses.length)]}`;
}

// Session management for users
function getUserSession(socketId, userEmail) {
    if (!userSessions.has(socketId)) {
        const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        userSessions.set(socketId, {
            sessionId,
            userEmail,
            createdAt: new Date(),
            hasUploadedFiles: false
        });
        console.log(`📝 Created new session for ${userEmail}: ${sessionId}`);
    }
    return userSessions.get(socketId);
}

// Initialize global room messages
if (!roomMessages.has('global-chat')) {
    roomMessages.set('global-chat', []);
}

io.on('connection', socket => {
    console.log(`User connected: ${socket.id}`);
    
    // Join global chat room by default
    const roomId = 'global-chat';
    socket.join(roomId);
    socket.roomId = roomId;
    
    // Get user email from query
    const userEmail = socket.handshake.query.userEmail || `User-${socket.id.slice(0, 8)}`;
    
    // Add user to active users and create session
    activeUsers.set(socket.id, {
        id: socket.id,
        email: userEmail,
        joinedAt: new Date()
    });
    
    const userSession = getUserSession(socket.id, userEmail);
    
    // Send existing messages to newly connected user
    const existingMessages = roomMessages.get(roomId) || [];
    socket.emit('chat-history', existingMessages);
    
    // Notify others about new user
    socket.broadcast.to(roomId).emit('user-joined', {
        user: activeUsers.get(socket.id),
        totalUsers: activeUsers.size
    });
    
    // Send current user count
    io.to(roomId).emit('user-count', activeUsers.size);

    // Handle regular chat messages
    socket.on('chat-message', async (data) => {
        try {
            const user = activeUsers.get(socket.id);
            const userSession = getUserSession(socket.id, user?.email);
            
            const messageData = {
                id: `msg-${Date.now()}-${socket.id}`,
                message: data.message,
                sender: {
                    _id: socket.id,
                    email: user?.email || 'Unknown User'
                },
                timestamp: new Date(),
                type: 'user'
            };

            // Store message in room history
            const roomMessages_current = roomMessages.get(roomId) || [];
            roomMessages_current.push(messageData);
            roomMessages.set(roomId, roomMessages_current);

            // Check if message starts with @ai
            const aiIsPresentInMessage = data.message.trim().startsWith('@ai');
            
            // Broadcast message to all users in room
            io.to(roomId).emit('chat-message', messageData);

            // If AI is mentioned, generate AI response
            if (aiIsPresentInMessage) {
                // Remove @ai from the beginning of the message
                const prompt = data.message.replace(/^@ai\s*/i, '').trim();
                
                if (prompt) {
                    // Indicate AI is typing
                    io.to(roomId).emit('ai-typing', true);
                    
                    // Use the session if files have been uploaded, otherwise general chat
                    const sessionToUse = userSession.hasUploadedFiles ? userSession.sessionId : null;
                    const aiResponse = await generateResult(prompt, sessionToUse, user?.email);
                    
                    const aiMessageData = {
                        id: `ai-msg-${Date.now()}`,
                        message: aiResponse,
                        sender: {
                            _id: 'ai-assistant',
                            email: 'AI Assistant'
                        },
                        timestamp: new Date(),
                        type: 'ai'
                    };

                    // Store AI message in room history
                    roomMessages_current.push(aiMessageData);
                    roomMessages.set(roomId, roomMessages_current);

                    // Send AI response to all users
                    setTimeout(() => {
                        io.to(roomId).emit('ai-typing', false);
                        io.to(roomId).emit('chat-message', aiMessageData);
                    }, 1500); // Small delay to show typing indicator
                } else {
                    // If just @ai with no question
                    const helpMessage = {
                        id: `ai-help-${Date.now()}`,
                        message: `🤖 **AI Assistant:** Hi! I'm ready to help. Ask me anything by typing @ai followed by your question!\n\n💡 **Tips:**\n• Upload PDF files for document-based questions\n• I can help with analysis, explanations, and general conversation\n• I remember our conversation context`,
                        sender: {
                            _id: 'ai-assistant',
                            email: 'AI Assistant'
                        },
                        timestamp: new Date(),
                        type: 'ai'
                    };
                    
                    roomMessages_current.push(helpMessage);
                    roomMessages.set(roomId, roomMessages_current);
                    io.to(roomId).emit('chat-message', helpMessage);
                }
            }
        } catch (error) {
            console.error('Chat message error:', error);
            socket.emit('chat-error', { message: 'Failed to process message' });
        }
    });

    // Handle document upload notifications
    socket.on('document-uploaded', async (data) => {
        try {
            const user = activeUsers.get(socket.id);
            const userSession = getUserSession(socket.id, user?.email);
            
            // Mark that this user has uploaded files
            userSession.hasUploadedFiles = true;
            userSessions.set(socket.id, userSession);
            
            const notificationData = {
                id: `doc-${Date.now()}-${socket.id}`,
                message: `📄 **Document Upload:** ${user?.email || 'Someone'} uploaded "${data.fileName}" (${(data.fileSize / 1024 / 1024).toFixed(2)} MB)`,
                sender: {
                    _id: 'system',
                    email: 'System'
                },
                timestamp: new Date(),
                type: 'system'
            };

            // Store and broadcast document notification
            const roomMessages_current = roomMessages.get(roomId) || [];
            roomMessages_current.push(notificationData);
            roomMessages.set(roomId, roomMessages_current);
            
            io.to(roomId).emit('chat-message', notificationData);
            
            console.log(`📄 Document uploaded by ${user?.email}: ${data.fileName} for session ${userSession.sessionId}`);
        } catch (error) {
            console.error('Document upload notification error:', error);
        }
    });

    // Handle user typing indicator
    socket.on('typing', (data) => {
        const user = activeUsers.get(socket.id);
        socket.broadcast.to(roomId).emit('user-typing', {
            user: user,
            isTyping: data.isTyping
        });
    });

    // Handle session info request
    socket.on('get-session-info', () => {
        const userSession = getUserSession(socket.id, userEmail);
        socket.emit('session-info', {
            sessionId: userSession.sessionId,
            hasUploadedFiles: userSession.hasUploadedFiles
        });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
        
        const user = activeUsers.get(socket.id);
        
        // Clean up user data
        activeUsers.delete(socket.id);
        userSessions.delete(socket.id);
        
        socket.broadcast.to(roomId).emit('user-left', {
            user: user,
            totalUsers: activeUsers.size
        });
        
        io.to(roomId).emit('user-count', activeUsers.size);
        socket.leave(roomId);
    });
});

// Enhanced error handling
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

server.listen(port, () => {
    console.log(`🚀 Server is running on port ${port}`);
    console.log(`🌐 Socket.IO server is ready`);
    console.log(`📄 PDF processing is enabled`);
});