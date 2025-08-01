import express  from "express";
import { limiter } from "../middlewares/limiter";
import { authenticate } from "../middlewares/auth";
import { handlerAddNewReply, handlerAllReplies } from "../controllers/replies";
import { upload } from "../utils/multer";

const router = express.Router()


router.post('/reply', authenticate,limiter,upload.single("image"),  handlerAddNewReply);
router.get('/reply', authenticate, limiter,  handlerAllReplies)

export default router