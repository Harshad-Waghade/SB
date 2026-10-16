"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const socket_io_1 = require("socket.io");
const env_1 = require("./config/env");
const db_1 = require("./config/db");
const routes_1 = __importDefault(require("./routes"));
const errorHandler_1 = require("./middlewares/errorHandler");
const rateLimiter_1 = require("./middlewares/rateLimiter");
const socketHandler_1 = require("./sockets/socketHandler");
const seed_1 = require("./scripts/seed");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
// Initialize Socket.io
const io = new socket_io_1.Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE']
    }
});
(0, socketHandler_1.setupSockets)(io);
// Middlewares
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: false
}));
app.use((0, cors_1.default)({
    origin: '*',
    credentials: true
}));
app.use((0, morgan_1.default)(env_1.ENV.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express_1.default.json({ limit: '20mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '20mb' }));
// Static uploads directory
const uploadsDir = path_1.default.resolve(__dirname, '../uploads');
app.use('/uploads', express_1.default.static(uploadsDir));
// Rate Limiting
app.use('/api/', rateLimiter_1.apiRateLimiter);
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
app.use('/api/v1', routes_1.default);
// Global Error Handler
app.use(errorHandler_1.errorHandler);
// Start Server
const start = async () => {
    try {
        await (0, db_1.connectDB)();
        await (0, seed_1.seedDatabaseIfEmpty)();
        server.listen(env_1.ENV.PORT, () => {
            console.log(`====================================================`);
            console.log(`🚀 STAYBITE BACKEND API SERVER RUNNING ON PORT ${env_1.ENV.PORT}`);
            console.log(`📍 API Base: http://localhost:${env_1.ENV.PORT}/api/v1`);
            console.log(`⚡ WebSocket Server: Ready for Real-time Connections`);
            console.log(`====================================================`);
        });
    }
    catch (err) {
        console.error('Failed to start StayBite server:', err);
        process.exit(1);
    }
};
start();
//# sourceMappingURL=server.js.map