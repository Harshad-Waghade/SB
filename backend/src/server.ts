import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';
import { Server } from 'socket.io';
import { ENV } from './config/env';
import { connectDB } from './config/db';
import routes from './routes';
import { errorHandler } from './middlewares/errorHandler';
import { apiRateLimiter } from './middlewares/rateLimiter';
import { setupSockets } from './sockets/socketHandler';
import { seedDatabaseIfEmpty } from './scripts/seed';
import { uploadDir } from './middlewares/upload';

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

setupSockets(io);

// Middlewares
app.use(
  helmet({
    crossOriginResourcePolicy: false
  })
);

app.use(
  cors({
    origin: '*',
    credentials: true
  })
);

app.use(morgan(ENV.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Static uploads directory (supports /tmp/uploads on Vercel and local uploads in dev)
app.use('/uploads', express.static(uploadDir));

// Fallback to bundled uploads directory if distinct and existing
const bundledUploadsDir = path.resolve(__dirname, '../uploads');
if (bundledUploadsDir !== uploadDir && fs.existsSync(bundledUploadsDir)) {
  app.use('/uploads', express.static(bundledUploadsDir));
}

// Rate Limiting
app.use('/api/', apiRateLimiter);

// Health Check API
app.get('/health', (_req, res) => {
  res.json({
    status: 'online',
    service: 'StayBite REST API',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API Routes
app.use('/api/v1', routes);

// Global Error Handler
app.use(errorHandler);

// Start Server
const start = async () => {
  try {
    await connectDB();
    await seedDatabaseIfEmpty();

    server.listen(ENV.PORT, () => {
      console.log(`====================================================`);
      console.log(`🚀 STAYBITE BACKEND API SERVER RUNNING ON PORT ${ENV.PORT}`);
      console.log(`📍 API Base: http://localhost:${ENV.PORT}/api/v1`);
      console.log(`⚡ WebSocket Server: Ready for Real-time Connections`);
      console.log(`====================================================`);
    });
  } catch (err) {
    console.error('Failed to start StayBite server:', err);
    process.exit(1);
  }
};

start();

export { app, server };
export default app;
