"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const limiter_1 = require("../middlewares/limiter");
const profile_1 = require("../controllers/profile");
const auth_1 = require("../middlewares/auth");
const multer_1 = require("../utils/multer");
const router = express_1.default.Router();
router.get('/myProfile', auth_1.authenticate, limiter_1.limiter, profile_1.handlerMyProfile);
router.put('/myProfile/edit', auth_1.authenticate, limiter_1.limiter, multer_1.upload.fields([
    { name: 'photo_profile', maxCount: 1 },
    { name: 'cover_Photo', maxCount: 1 }
]), profile_1.handlerEditProfile);
exports.default = router;
