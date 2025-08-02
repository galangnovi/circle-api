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
exports.seeAllReplies = seeAllReplies;
exports.addreplies = addreplies;
const client_1 = require("../prisma/client");
function seeAllReplies(user_id, thread_id, limit) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const replies = yield client_1.prisma.replies.findMany({
                where: { thread_id },
                orderBy: {
                    created_at: "desc",
                },
                select: {
                    id: true,
                    content: true,
                    image: true,
                    user: {
                        select: {
                            id: true,
                            username: true,
                            full_name: true,
                            photo_profile: true
                        }
                    },
                    created_at: true,
                    likes: {
                        select: { user: { select: {
                                    id: true,
                                } }
                        }
                    }
                },
                take: Number(limit)
            });
            if (!replies)
                throw new Error("tidak ada treads tersedia");
            const result = replies.map((reply) => {
                const isLiked = reply.likes.some((like) => like.user.id === user_id);
                return Object.assign(Object.assign({}, reply), { likes_count: reply.likes.length, isLiked });
            });
            return result;
        }
        catch (err) {
            throw new Error(err.message || "Terjadi kesalahan");
        }
    });
}
function addreplies(user_id, thread_id, content, image) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const imageToSave = image !== null && image !== void 0 ? image : null;
            const replies = yield client_1.prisma.replies.create({
                data: {
                    user_id: user_id,
                    thread_id,
                    content,
                    created_by: user_id,
                    image: imageToSave
                }
            });
            if (!replies)
                throw new Error("invalid threads content");
            yield client_1.prisma.threads.update({
                where: { id: thread_id },
                data: {
                    number_of_replies: { increment: 1 }
                }
            });
            return ({ id: replies.id, user_id, content: replies.content, image: replies.image, timeStamp: replies.created_at });
        }
        catch (err) {
            throw new Error(err.message || "Terjadi kesalahan");
        }
    });
}
