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
exports.reorderLinks = exports.deleteLink = exports.updateLink = exports.getLinks = exports.createLink = void 0;
const database_1 = require("../config/database");
const createLink = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, title, url } = req.body;
        // Get the highest order number for this user
        const [orderResult] = yield database_1.pool.execute('SELECT MAX(`order`) as maxOrder FROM links WHERE userId = ?', [userId]);
        const maxOrder = Array.isArray(orderResult) && orderResult[0] ?
            orderResult[0].maxOrder || 0 : 0;
        const [result] = yield database_1.pool.execute('INSERT INTO links (userId, title, url, `order`) VALUES (?, ?, ?, ?)', [userId, title, url, maxOrder + 1]);
        res.status(201).json({ message: 'Link created successfully', id: result.insertId });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.createLink = createLink;
const getLinks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const [links] = yield database_1.pool.execute('SELECT * FROM links WHERE userId = ? ORDER BY `order` ASC', [userId]);
        res.json(links);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getLinks = getLinks;
const updateLink = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { title, url } = req.body;
        const [result] = yield database_1.pool.execute('UPDATE links SET title = ?, url = ? WHERE id = ? AND userId = ?', [title, url, id, req.user.id]);
        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Link not found or unauthorized' });
            return; // Prevent further execution
        }
        res.json({ message: 'Link updated successfully' });
    }
    catch (error) {
        next(error); // Pass the error to the global error handler
    }
});
exports.updateLink = updateLink;
const deleteLink = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const [result] = yield database_1.pool.execute('DELETE FROM links WHERE id = ? AND userId = ?', [id, req.user.id]);
        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Link not found or unauthorized' });
            return; // Prevent further execution
        }
        res.json({ message: 'Link deleted successfully' });
    }
    catch (error) {
        next(error); // Pass the error to the global error handler
    }
});
exports.deleteLink = deleteLink;
const reorderLinks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const { linkIds } = req.body; // Array of link IDs in new order
        // Start transaction
        const connection = yield database_1.pool.getConnection();
        yield connection.beginTransaction();
        try {
            // Update order for each link
            for (let i = 0; i < linkIds.length; i++) {
                yield connection.execute('UPDATE links SET `order` = ? WHERE id = ? AND userId = ?', [i + 1, linkIds[i], userId]);
            }
            yield connection.commit();
            res.json({ message: 'Links reordered successfully' });
        }
        catch (error) {
            yield connection.rollback();
            throw error;
        }
        finally {
            connection.release();
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.reorderLinks = reorderLinks;
//# sourceMappingURL=linkController.js.map