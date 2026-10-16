"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireOwner = exports.requireAdmin = exports.requireRole = void 0;
const requireRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Unauthorized. Please log in.' });
            return;
        }
        if (!allowedRoles.includes(req.user.role)) {
            res.status(403).json({
                success: false,
                message: `Access denied. Requires one of: ${allowedRoles.join(', ')}. Your role is: ${req.user.role}`
            });
            return;
        }
        next();
    };
};
exports.requireRole = requireRole;
exports.requireAdmin = (0, exports.requireRole)('admin');
exports.requireOwner = (0, exports.requireRole)('room_owner', 'mess_owner', 'admin');
//# sourceMappingURL=role.js.map