import express  from "express";
import { authenticate } from "../middlewares/auth";
import { limiter } from "../middlewares/limiter";
import { handlerActionFollow, handlerActionUnFollow, handlerGetFollowersOrFollowing } from "../controllers/follows";

const router = express.Router()

router.get("/follows", limiter, authenticate, handlerGetFollowersOrFollowing)
router.post("/follows", limiter, authenticate, handlerActionFollow)
router.delete("/follows", limiter, authenticate, handlerActionUnFollow)

export default router