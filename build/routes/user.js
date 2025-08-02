"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const limiter_1 = require("../middlewares/limiter");
const auth_1 = require("../middlewares/auth");
const user_1 = require("../controllers/user");
const router = express_1.default.Router();
router.get("/search", limiter_1.limiter, auth_1.authenticate, user_1.handlerSearchuser);
router.get("/recomendation", limiter_1.limiter, auth_1.authenticate, user_1.handlerRecomendation);
router.get("/auth", user_1.handlerisuserActive);
exports.default = router;
