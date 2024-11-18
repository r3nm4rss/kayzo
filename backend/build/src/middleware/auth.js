"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const isAuthenticated = (req, res, next) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!token) {
        res.status(401).json({ message: 'No token provided' });
        return; // Ensure no further code runs
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET); // Assert type
        req.user = decoded; // Attach user to the request object
        next(); // Pass control to the next middleware or route handler
    }
    catch (error) {
        res.status(401).json({ message: 'Invalid token' });
        return; // Ensure no further code runs
    }
};
exports.isAuthenticated = isAuthenticated;
//# sourceMappingURL=auth.js.map