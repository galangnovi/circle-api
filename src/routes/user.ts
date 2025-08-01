import express  from "express";
import { limiter } from "../middlewares/limiter";
import { authenticate } from "../middlewares/auth";
import { handlerRecomendation, handlerSearchuser } from "../controllers/user";

const router = express.Router()

router.get("/search", limiter, authenticate, handlerSearchuser)
router.get("/recomendation", limiter, authenticate, handlerRecomendation)

export default router