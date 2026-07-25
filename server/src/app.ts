import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

import { initSocket } from './sockets/socketHandler';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import departmentRoutes from './routes/departmentRoutes';
import shiftRoutes from './routes/shiftRoutes';
import rosterRoutes from './routes/rosterRoutes';
import leaveRoutes from './routes/leaveRoutes';
import swapRoutes from './routes/swapRoutes';
import notificationRoutes from './routes/notificationRoutes';
import reportRoutes from './routes/reportRoutes';
import communicationRoutes from './routes/communicationRoutes';
import gameRoutes from './routes/gameRoutes';

dotenv.config();

const app = express();
const server = http.createServer(app);

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (like mobile apps, curl, postman)
      if (!origin) return callback(null, true);
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads fallback
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Socket.IO setup
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  },
});
initSocket(io);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'NurseFlow API', timestamp: new Date() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/shifts', shiftRoutes);
app.use('/api/rosters', rosterRoutes);
app.use('/api/leave-requests', leaveRoutes);
app.use('/api/shift-swaps', swapRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/communication-simulator', communicationRoutes);
app.use('/api/games', gameRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[Error Middleware]:', err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`=================================`);
  console.log(`🏥 NurseFlow Server running on port ${PORT}`);
  console.log(`⚡ Socket.IO initialized`);
  console.log(`=================================`);
});

export default app;
