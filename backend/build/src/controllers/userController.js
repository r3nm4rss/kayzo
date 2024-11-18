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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getUserByUsername = exports.createUser = void 0;
const database_1 = require("../config/database");
const createUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, name, description } = req.body;
        const files = req.files;
        const [existing] = yield database_1.pool.execute('SELECT id FROM users WHERE username = ?', [username]);
        if (Array.isArray(existing) && existing.length > 0) {
            res.status(400).json({ message: 'Username already taken' });
            return; // Exit early
        }
        const profilePicture = files.profilePicture ? files.profilePicture[0].filename : null;
        const backgroundMedia = files.backgroundMedia ? files.backgroundMedia[0].filename : null;
        const backgroundType = files.backgroundMedia
            ? (files.backgroundMedia[0].mimetype.startsWith('video') ? 'video' : 'image')
            : null;
        yield database_1.pool.execute(`INSERT INTO users (username, name, description, profilePicture, backgroundMedia, backgroundType)
       VALUES (?, ?, ?, ?, ?, ?)`, [username, name, description, profilePicture, backgroundMedia, backgroundType]);
        res.status(201).json({ message: 'User created successfully' });
    }
    catch (error) {
        next(error); // Pass the error to the error handler
    }
});
exports.createUser = createUser;
const getUserByUsername = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username } = req.params;
        const [rows] = yield database_1.pool.execute('SELECT * FROM users WHERE username = ?', [username]);
        if (!Array.isArray(rows) || rows.length === 0) {
            res.status(404).json({ message: 'User not found' });
            return; // Exit early
        }
        res.json(rows[0]);
    }
    catch (error) {
        next(error); // Pass the error to the error handler
    }
});
exports.getUserByUsername = getUserByUsername;
const updateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username } = req.params;
        const { name, description } = req.body;
        const files = req.files;
        const [user] = yield database_1.pool.execute('SELECT id FROM users WHERE username = ?', [username]);
        if (!Array.isArray(user) || user.length === 0) {
            res.status(404).json({ message: 'User not found' });
            return; // Exit early
        }
        const profilePicture = files.profilePicture ? files.profilePicture[0].filename : undefined;
        const backgroundMedia = files.backgroundMedia ? files.backgroundMedia[0].filename : undefined;
        const backgroundType = files.backgroundMedia
            ? (files.backgroundMedia[0].mimetype.startsWith('video') ? 'video' : 'image')
            : undefined;
        let updateQuery = 'UPDATE users SET name = ?, description = ?';
        const params = [name, description];
        if (profilePicture) {
            updateQuery += ', profilePicture = ?';
            params.push(profilePicture);
        }
        if (backgroundMedia) {
            updateQuery += ', backgroundMedia = ?, backgroundType = ?';
            params.push(backgroundMedia, backgroundType);
        }
        updateQuery += ' WHERE username = ?';
        params.push(username);
        yield database_1.pool.execute(updateQuery, params);
        res.json({ message: 'User updated successfully' });
    }
    catch (error) {
        next(error); // Pass the error to the error handler
    }
});
exports.updateUser = updateUser;
const deleteUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username } = req.params;
        const [result] = yield database_1.pool.execute('DELETE FROM users WHERE username = ?', [username]);
        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'User not found' });
            return; // Exit early
        }
        res.json({ message: 'User deleted successfully' });
    }
    catch (error) {
        next(error); // Pass the error to the error handler
    }
});
exports.deleteUser = deleteUser;
//# sourceMappingURL=userController.js.map