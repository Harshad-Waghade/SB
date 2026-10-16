"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSockets = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const setupSockets = (io) => {
    const onlineUsers = {};
    io.use((socket, next) => {
        const token = socket.handshake.auth?.token || socket.handshake.query?.token;
        if (token && typeof token === 'string') {
            try {
                const decoded = jsonwebtoken_1.default.verify(token, env_1.ENV.JWT_SECRET);
                socket.data.userId = decoded.id;
            }
            catch (err) {
                // Allow unauthenticated guests for public live counts
            }
        }
        next();
    });
    io.on('connection', (socket) => {
        const userId = socket.data.userId;
        if (userId) {
            onlineUsers[userId] = socket.id;
            socket.join(`user:${userId}`);
            console.log(`🔌 User connected to WebSocket: ${userId}`);
        }
        // Join conversation room
        socket.on('join_conversation', (conversationId) => {
            socket.join(`conv:${conversationId}`);
        });
        socket.on('leave_conversation', (conversationId) => {
            socket.leave(`conv:${conversationId}`);
        });
        // Real-time message relay
        socket.on('send_message', (data) => {
            // Emit to conversation room
            io.to(`conv:${data.conversationId}`).emit('new_message', data.message);
            // Also send instant notification to recipient if not in room
            if (data.recipientId && onlineUsers[data.recipientId]) {
                io.to(`user:${data.recipientId}`).emit('notification_received', {
                    title: 'New Message',
                    body: data.message.text || 'You received a new attachment',
                    type: 'new_message',
                    link: `/messages`
                });
            }
        });
        // Typing indicators
        socket.on('typing_start', (data) => {
            socket.to(`conv:${data.conversationId}`).emit('user_typing', data);
        });
        socket.on('typing_stop', (data) => {
            socket.to(`conv:${data.conversationId}`).emit('user_stopped_typing', data);
        });
        socket.on('disconnect', () => {
            if (userId && onlineUsers[userId] === socket.id) {
                delete onlineUsers[userId];
            }
        });
    });
};
exports.setupSockets = setupSockets;
//# sourceMappingURL=socketHandler.js.map