import { Server as SocketIOServer, Socket } from 'socket.io';

let ioInstance: SocketIOServer | null = null;

export const initSocket = (io: SocketIOServer) => {
  ioInstance = io;

  io.on('connection', (socket: Socket) => {
    console.log(`[Socket.IO] Client connected: ${socket.id}`);

    socket.on('join', (data: { userId: string; role: string }) => {
      if (data.userId) {
        socket.join(`user:${data.userId}`);
        console.log(`[Socket.IO] User ${data.userId} joined room user:${data.userId}`);
      }
      if (data.role) {
        socket.join(`role:${data.role}`);
        console.log(`[Socket.IO] User joined role room role:${data.role}`);
      }
    });

    socket.on('disconnect', () => {
      console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
    });
  });
};

export const getIO = (): SocketIOServer => {
  if (!ioInstance) {
    throw new Error('Socket.IO not initialized');
  }
  return ioInstance;
};

export const emitToUser = (userId: string, event: string, payload: any) => {
  if (ioInstance) {
    ioInstance.to(`user:${userId}`).emit(event, payload);
  }
};

export const emitToRole = (role: string, event: string, payload: any) => {
  if (ioInstance) {
    ioInstance.to(`role:${role}`).emit(event, payload);
  }
};

export const emitToAll = (event: string, payload: any) => {
  if (ioInstance) {
    ioInstance.emit(event, payload);
  }
};
