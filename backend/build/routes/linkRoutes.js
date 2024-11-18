"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const linkController_1 = require("../controllers/linkController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.post('/', auth_1.isAuthenticated, linkController_1.createLink);
router.get('/user/:userId', linkController_1.getLinks);
router.put('/:id', auth_1.isAuthenticated, linkController_1.updateLink);
router.delete('/:id', auth_1.isAuthenticated, linkController_1.deleteLink);
router.put('/reorder/:userId', auth_1.isAuthenticated, linkController_1.reorderLinks);
exports.default = router;
//# sourceMappingURL=linkRoutes.js.map