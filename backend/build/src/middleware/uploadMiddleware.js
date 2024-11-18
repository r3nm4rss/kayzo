"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path_1.default.extname(file.originalname));
    }
});
exports.upload = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.fieldname === 'profilePicture') {
            if (!file.mimetype.startsWith('image/')) {
                return cb(new Error('Only images are allowed for profile picture'));
            }
        }
        else if (file.fieldname === 'backgroundMedia') {
            if (!file.mimetype.startsWith('image/') && !file.mimetype.startsWith('video/')) {
                return cb(new Error('Only images or videos are allowed for background'));
            }
        }
        cb(null, true);
    }
});
//# sourceMappingURL=uploadMiddleware.js.map