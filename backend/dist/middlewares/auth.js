"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuthenticate = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const User_1 = require("../models/User");
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ success: false, message: 'Authentication required. Please log in.' });
            return;
        }
        const token = authHeader.split(' ')[1];
        const decoded = jsonwebtoken_1.default.verify(token, env_1.ENV.JWT_SECRET);
        const user = await User_1.User.findById(decoded.id);
        if (!user) {
            res.status(401).json({ success: false, message: 'User account not found.' });
            return;
        }
        if (user.isBlocked) {
            res.status(403).json({
                success: false,
                message: `Account is suspended. Reason: ${user.blockedReason || 'Policy violation'}`
            });
            return;
        }
        req.user = user;
        next();
    }
    catch (error) {
        res.status(401).json({ success: false, message: 'Invalid or expired authentication token.' });
    }
};
exports.authenticate = authenticate;
const optionalAuthenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            const decoded = jsonwebtoken_1.default.verify(token, env_1.ENV.JWT_SECRET);
            const user = await User_1.User.findById(decoded.id);
            if (user && !user.isBlocked) {
                req.user = user;
            }
        }
    }
    catch (err) {
        // Ignore error in optional auth
    }
    next();
};
exports.optionalAuthenticate = optionalAuthenticate;
//# sourceMappingURL=auth.js.map