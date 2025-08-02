"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middlewares/auth");
const likes_1 = require("../controllers/likes");
const router = express_1.default.Router();
router.post('/reply/like/:id', auth_1.authenticate, likes_1.handleLikeReply);
router.post('/thread/like/:id', auth_1.authenticate, likes_1.handleLikeThreads);
router.delete('/thread/unLike/:id', auth_1.authenticate, likes_1.handledeleteLikeThreads);
router.delete('/reply/unLike/:id', auth_1.authenticate, likes_1.handledeleteLikeReply);
exports.default = router;
