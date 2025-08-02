"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middlewares/auth");
const limiter_1 = require("../middlewares/limiter");
const follows_1 = require("../controllers/follows");
const router = express_1.default.Router();
router.get("/follows", limiter_1.limiter, auth_1.authenticate, follows_1.handlerGetFollowersOrFollowing);
router.post("/follows", limiter_1.limiter, auth_1.authenticate, follows_1.handlerActionFollow);
router.delete("/follows", limiter_1.limiter, auth_1.authenticate, follows_1.handlerActionUnFollow);
exports.default = router;
