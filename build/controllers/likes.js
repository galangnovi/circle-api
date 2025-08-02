"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handledeleteLikeReply = exports.handledeleteLikeThreads = exports.handleLikeReply = exports.handleLikeThreads = void 0;
const likes_1 = require("../services/likes");
const handleLikeThreads = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user_id = req.session.user.user_id;
        const thread_id = Number(req.params.id);
        if (!user_id)
            throw new Error("user tidak ditemukan");
        if (!thread_id)
            throw new Error("threads tidak ditemukan");
        yield (0, likes_1.likeThreads)(user_id, thread_id);
        return res.status(200).json({
            code: 200,
            status: "success",
            message: "Sukses Like Thread",
            data: "Sukses Menambah Like Baru",
        });
    }
    catch (err) {
        return res.status(500).json({
            code: 500,
            status: "error",
            message: err.message || "profil tidak ditemukan",
        });
    }
    ;
});
exports.handleLikeThreads = handleLikeThreads;
const handleLikeReply = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user_id = req.session.user.user_id;
        const reply_id = Number(req.params.id);
        if (!user_id)
            throw new Error("user tidak ditemukan");
        if (!reply_id)
            throw new Error("reply tidak ditemukan");
        yield (0, likes_1.likereply)(user_id, reply_id);
        return res.status(200).json({
            code: 200,
            status: "success",
            message: "Sukses Like Reply",
            data: "Sukses Menambah Like Baru",
        });
    }
    catch (err) {
        return res.status(500).json({
            code: 500,
            status: "error",
            message: err.message || "profil tidak ditemukan",
        });
    }
    ;
});
exports.handleLikeReply = handleLikeReply;
const handledeleteLikeThreads = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user_id = req.session.user.user_id;
        const thread_id = Number(req.params.id);
        if (!user_id)
            throw new Error("user tidak ditemukan");
        if (!thread_id)
            throw new Error("threads tidak ditemukan");
        yield (0, likes_1.DeleteLikeThreads)(user_id, thread_id);
        return res.status(200).json({
            code: 200,
            status: "success",
            message: "Sukses Deleting",
            data: "Sukses Menghapus Like Thread",
        });
    }
    catch (err) {
        return res.status(500).json({
            code: 500,
            status: "error",
            message: err.message || "profil tidak ditemukan",
        });
    }
    ;
});
exports.handledeleteLikeThreads = handledeleteLikeThreads;
const handledeleteLikeReply = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user_id = req.session.user.user_id;
        const reply_id = Number(req.params.id);
        if (!user_id)
            throw new Error("user tidak ditemukan");
        if (!reply_id)
            throw new Error("reply tidak ditemukan");
        yield (0, likes_1.DeleteLikeReply)(user_id, reply_id);
        return res.status(200).json({
            code: 200,
            status: "success",
            message: "Sukses Deleting",
            data: "Sukses Menghapus Like Reply",
        });
    }
    catch (err) {
        return res.status(500).json({
            code: 500,
            status: "error",
            message: err.message || "profil tidak ditemukan",
        });
    }
    ;
});
exports.handledeleteLikeReply = handledeleteLikeReply;
