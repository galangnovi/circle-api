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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.likeThreads = likeThreads;
exports.likereply = likereply;
exports.DeleteLikeThreads = DeleteLikeThreads;
exports.DeleteLikeReply = DeleteLikeReply;
const client_1 = require("../prisma/client");
const redis_1 = __importDefault(require("../utils/redis"));
const getCacheKey = (user_id) => `my_threads:${user_id}`;
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
            const cacheKey = getCacheKey(user_id);
            const cached = yield redis_1.default.get(cacheKey);
            if (cached) {
                const parsed = JSON.parse(cached); // return hasil cache
                const updated = parsed.map((thread) => {
                    if (thread.id === thread_id) {
                        return Object.assign(Object.assign({}, thread), { likes_count: thread.likes_count + 1, isLiked: true });
                    }
                    return thread;
                });
                yield redis_1.default.set(cacheKey, JSON.stringify(updated), "EX", 60);
            }
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
            const cacheKey = getCacheKey(user_id);
            const cached = yield redis_1.default.get(cacheKey);
            if (cached) {
                const parsed = JSON.parse(cached); // return hasil cache
                const updated = parsed.map((thread) => {
                    if (thread.id === thread_id) {
                        return Object.assign(Object.assign({}, thread), { likes_count: Math.max(thread.likes_count - 1, 0), isLiked: false });
                    }
                    return thread;
                });
                yield redis_1.default.set(cacheKey, JSON.stringify(updated), "EX", 60);
            }
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
