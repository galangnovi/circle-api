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
exports.likeThreads = likeThreads;
exports.likereply = likereply;
exports.DeleteLikeThreads = DeleteLikeThreads;
exports.DeleteLikeReply = DeleteLikeReply;
const client_1 = require("../prisma/client");
function likeThreads(user_id, thread_id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const liked = yield client_1.prisma.likes.create({
                data: {
                    user_id,
                    thread_id,
                    created_by: user_id
                }
            });
            if (!liked)
                throw new Error("invalid like content");
            return;
        }
        catch (err) {
            throw new Error(err.message || "Terjadi kesalahan");
        }
    });
}
function likereply(user_id, reply_id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const thread = yield client_1.prisma.replies.findFirst({
                where: { id: reply_id },
                select: {
                    thread_id: true
                }
            });
            if (!thread)
                throw new Error("reply tidak ditemukan");
            const liked = yield client_1.prisma.likes.create({
                data: {
                    user_id,
                    reply_id,
                    created_by: user_id
                }
            });
            if (!liked)
                throw new Error("invalid like content");
            return;
        }
        catch (err) {
            throw new Error(err.message || "Terjadi kesalahan");
        }
    });
}
function DeleteLikeThreads(user_id, thread_id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const liked = yield client_1.prisma.likes.deleteMany({
                where: { user_id,
                    thread_id }
            });
            if (!liked)
                throw new Error("invalid like content");
            return;
        }
        catch (err) {
            throw new Error(err.message || "Terjadi kesalahan");
        }
    });
}
function DeleteLikeReply(user_id, reply_id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const liked = yield client_1.prisma.likes.deleteMany({
                where: { user_id,
                    reply_id }
            });
            if (!liked)
                throw new Error("invalid like content");
            return;
        }
        catch (err) {
            throw new Error(err.message || "Terjadi kesalahan");
        }
    });
}
