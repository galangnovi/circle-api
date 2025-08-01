import express  from "express";
import { limiter } from "../middlewares/limiter";
import { handlerMyProfile } from "../controllers/profile";
import { authenticate } from "../middlewares/auth";
import { handledeleteLikeReply, handledeleteLikeThreads, handleLikeReply, handleLikeThreads } from "../controllers/likes";

const router = express.Router()
router.post('/reply/like/:id', authenticate, handleLikeReply)
router.post('/thread/like/:id', authenticate, handleLikeThreads)
router.delete('/thread/unLike/:id', authenticate, handledeleteLikeThreads)
router.delete('/reply/unLike/:id', authenticate, handledeleteLikeReply)




export default router