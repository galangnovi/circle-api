import express  from "express";
import { limiter } from "../middlewares/limiter";
import { handlerEditProfile, handlerMyProfile } from "../controllers/profile";
import { authenticate } from "../middlewares/auth";
import { upload } from "../utils/multer";

const router = express.Router()

router.get('/myProfile', authenticate, limiter,  handlerMyProfile)
router.put('/myProfile/edit', authenticate, limiter, 
    upload.fields([
        { name: 'photo_profile', maxCount: 1 },
        { name: 'cover_Photo', maxCount: 1 }
    ]), handlerEditProfile)


export default router