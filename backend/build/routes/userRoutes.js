"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const uploadMiddleware_1 = require("../middleware/uploadMiddleware");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.post('/', auth_1.isAuthenticated, uploadMiddleware_1.upload.fields([
    { name: 'profilePicture', maxCount: 1 },
    { name: 'backgroundMedia', maxCount: 1 }
]), userController_1.createUser);
router.get('/:username', userController_1.getUserByUsername);
router.put('/:username', auth_1.isAuthenticated, uploadMiddleware_1.upload.fields([
    { name: 'profilePicture', maxCount: 1 },
    { name: 'backgroundMedia', maxCount: 1 }
]), userController_1.updateUser);
router.delete('/:username', auth_1.isAuthenticated, userController_1.deleteUser);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map