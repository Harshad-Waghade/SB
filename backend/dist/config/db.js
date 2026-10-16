"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectDB = exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongodb_memory_server_1 = require("mongodb-memory-server");
const env_1 = require("./env");
let mongoMemoryServer = null;
const connectDB = async () => {
    try {
        let uri = env_1.ENV.MONGODB_URI;
        if (!uri) {
            console.log('⚡ No MONGODB_URI provided in environment. Initializing high-performance embedded MongoDB...');
            mongoMemoryServer = await mongodb_memory_server_1.MongoMemoryServer.create({
                instance: {
                    dbName: 'staybite_db'
                }
            });
            uri = mongoMemoryServer.getUri();
            console.log(`✅ Embedded MongoDB initialized at: ${uri}`);
        }
        await mongoose_1.default.connect(uri);
        console.log(`🚀 MongoDB Connected Successfully: ${mongoose_1.default.connection.host}/${mongoose_1.default.connection.name}`);
    }
    catch (error) {
        console.error('❌ MongoDB Connection Error:', error);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
const disconnectDB = async () => {
    await mongoose_1.default.disconnect();
    if (mongoMemoryServer) {
        await mongoMemoryServer.stop();
    }
};
exports.disconnectDB = disconnectDB;
//# sourceMappingURL=db.js.map