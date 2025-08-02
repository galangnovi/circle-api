"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const limiter_1 = require("../middlewares/limiter");
const auth_1 = require("../middlewares/auth");
const replies_1 = require("../controllers/replies");
const multer_1 = require("../utils/multer");
const router = express_1.default.Router();
router.post('/reply', auth_1.authenticate, limiter_1.limiter, multer_1.upload.single("image"), replies_1.handlerAddNewReply);
router.get('/reply', auth_1.authenticate, limiter_1.limiter, replies_1.handlerAllReplies);
exports.default = router;
