import express  from "express";
import { handlerRegisterUser, handlerLoginUser, logout } from "../controllers/auth-login";
import { limiter } from "../middlewares/limiter";

const router = express.Router()

router.post('/auth/login', limiter,  handlerLoginUser)
router.post('/auth/register', limiter,  handlerRegisterUser)
router.get('/logout', limiter, logout)


export default router

