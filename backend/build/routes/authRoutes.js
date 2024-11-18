"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = require("../config/database");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get('/google', passport_1.default.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport_1.default.authenticate('google', { session: false }), (req, res) => {
    const token = jsonwebtoken_1.default.sign({ id: req.user.id, email: req.user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.redirect(`${process.env.FRONTEND_URL}/auth-callback?token=${token}`);
});
router.get('/me', auth_1.isAuthenticated, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [rows] = yield database_1.pool.execute('SELECT id, username, name, email, profilePicture FROM users WHERE id = ?', [req.user.id] // Adjust `any` to the appropriate type if needed
        );
        if (!Array.isArray(rows) || rows.length === 0) {
            res.status(404).json({ message: 'User not found' });
            return; // Ensure no further code runs
        }
        res.json(rows[0]); // Send the user data
    }
    catch (error) {
        next(error); // Pass errors to the next middleware
    }
}));
exports.default = router;
//# sourceMappingURL=authRoutes.js.map