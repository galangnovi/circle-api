"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const limiter_1 = require("../middlewares/limiter");
const threads_1 = require("../controllers/threads");
const auth_1 = require("../middlewares/auth");
const multer_1 = require("../utils/multer");
const router = express_1.default.Router();
router.get('/thread', auth_1.authenticate, limiter_1.limiter, threads_1.handlerAllThreads);
router.post('/auth/thread', auth_1.authenticate, limiter_1.limiter, multer_1.upload.single("image"), threads_1.handlerAddNewThread);
router.get("/thread/image", auth_1.authenticate, limiter_1.limiter, threads_1.handlerImageThreads);
router.get("/thread/user", auth_1.authenticate, limiter_1.limiter, threads_1.handlerUserThreads);
router.get('/thread/:id', auth_1.authenticate, limiter_1.limiter, threads_1.handlerThreadsDetail);
exports.default = router;
