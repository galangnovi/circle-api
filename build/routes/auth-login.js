"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_login_1 = require("../controllers/auth-login");
const limiter_1 = require("../middlewares/limiter");
const router = express_1.default.Router();
router.post('/auth/login', limiter_1.limiter, auth_login_1.handlerLoginUser);
router.post('/auth/register', limiter_1.limiter, auth_login_1.handlerRegisterUser);
router.get('/logout', limiter_1.limiter, auth_login_1.logout);
exports.default = router;
