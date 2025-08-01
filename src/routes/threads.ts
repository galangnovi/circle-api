import express  from "express";
import { limiter } from "../middlewares/limiter";
import { handlerAddNewThread, handlerAllThreads, handlerImageThreads, handlerThreadsDetail, handlerUserThreads } from "../controllers/threads";
import { authenticate } from "../middlewares/auth";
import { upload } from "../utils/multer";

const router = express.Router()

router.get('/thread', authenticate, limiter,  handlerAllThreads)
router.post('/auth/thread', authenticate, limiter, upload.single("image"),  handlerAddNewThread)
router.get("/thread/image", authenticate, limiter, handlerImageThreads)
router.get("/thread/user", authenticate, limiter, handlerUserThreads)
router.get('/thread/:id', authenticate, limiter,  handlerThreadsDetail)

export default router