import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env';

interface UserSocketMap {
  [userId: string]: string; // userId -> socketId
}

export const setupSockets = (io: Server): void => {
  const onlineUsers: UserSocketMap = {};

  io.use((socket: Socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;
    if (token && typeof token === 'string') {
      try {
        const decoded = jwt.verify(token, ENV.JWT_SECRET) as { id: string };
        socket.data.userId = decoded.id;
      } catch (err) {
        // Allow unauthenticated guests for public live counts
      }
    }
    next();
  });

  io.on('connection', (socket: Socket) => {
    const userId = socket.data.userId;

    if (userId) {
      onlineUsers[userId] = socket.id;
      socket.join(`user:${userId}`);
      console.log(`🔌 User connected to WebSocket: ${userId}`);
    }

    // Join conversation room
    socket.on('join_conversation', (conversationId: string) => {
      socket.join(`conv:${conversationId}`);
    });

    socket.on('leave_conversation', (conversationId: string) => {
      socket.leave(`conv:${conversationId}`);
    });

    // Real-time message relay
    socket.on('send_message', (data: { conversationId: string; message: any; recipientId: string }) => {
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
    socket.on('typing_start', (data: { conversationId: string; userName: string }) => {
      socket.to(`conv:${data.conversationId}`).emit('user_typing', data);
    });

    socket.on('typing_stop', (data: { conversationId: string }) => {
      socket.to(`conv:${data.conversationId}`).emit('user_stopped_typing', data);
    });

    socket.on('disconnect', () => {
      if (userId && onlineUsers[userId] === socket.id) {
        delete onlineUsers[userId];
      }
    });
  }
);
};
