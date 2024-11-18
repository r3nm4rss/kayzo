"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const passport_1 = __importDefault(require("passport"));
const express_session_1 = __importDefault(require("express-session"));
const path_1 = __importDefault(require("path"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const linkRoutes_1 = __importDefault(require("./routes/linkRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
require("./config/passport");
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));
app.use(express_1.default.json());
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));
app.use(passport_1.default.initialize());
// Serve uploaded files
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
// Routes
app.use('/auth', authRoutes_1.default);
app.use('/api/users', userRoutes_1.default);
app.use('/api/links', linkRoutes_1.default);
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something broke!' });
});
app.listen(3000, () => {
    console.log(`Server is running `);
});
//# sourceMappingURL=index.js.map