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
exports.seeAllTreads = seeAllTreads;
exports.ThreadsDetail = ThreadsDetail;
exports.addThreads = addThreads;
exports.imageThreads = imageThreads;
exports.seeUserThreads = seeUserThreads;
const client_1 = require("../prisma/client");
const redis_1 = __importDefault(require("../utils/redis"));
const getCacheKey = (user_id) => `my_threads:${user_id}`;
function seeAllTreads(user_id, limit) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const cacheKey = getCacheKey(user_id);
            const cached = yield redis_1.default.get(cacheKey);
            if (cached) {
                console.log("pakai redis");
                return JSON.parse(cached); // return hasil cache
            }
            console.log("tidak pakai redis");
            const threads = yield client_1.prisma.threads.findMany({
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
                    number_of_replies: true,
                    likes: {
                        select: { user: { select: {
                                    id: true,
                                } }
                        }
                    }
                },
                take: Number(limit)
            });
            if (!threads)
                throw new Error("tidak ada treads tersedia");
            const result = threads.map(thread => {
                const liked = thread.likes.some(like => like.user.id === user_id);
                return Object.assign(Object.assign({}, thread), { likes_count: thread.likes.length, isLiked: liked });
            });
            yield redis_1.default.set(cacheKey, JSON.stringify(result), "EX", 60);
            return result;
        }
        catch (err) {
            throw new Error(err.message || "Terjadi kesalahan");
        }
    });
}
function ThreadsDetail(user_id, threads_id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const threads = yield client_1.prisma.threads.findFirst({
                where: { id: threads_id },
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
                    number_of_replies: true,
                    likes: {
                        select: { user: { select: {
                                    id: true,
                                } }
                        }
                    }
                },
            });
            if (!threads)
                throw new Error("tidak ada treads tersedia");
            const liked = threads.likes.some(like => like.user.id === user_id);
            return Object.assign(Object.assign({}, threads), { likes_count: threads.likes.length, isLiked: liked });
        }
        catch (err) {
            throw new Error(err.message || "Terjadi kesalahan");
        }
    });
}
function addThreads(created_by, content, image) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const imageToSave = image !== null && image !== void 0 ? image : null;
            const threads = yield client_1.prisma.threads.create({
                data: {
                    content,
                    created_by,
                    image: imageToSave
                }
            });
            if (!threads)
                throw new Error("invalid threads content");
            yield redis_1.default.del(`my_threads:${created_by}`);
            return ({ id: threads.id, user_id: threads.created_by, content: threads.content, image: threads.image, timeStamp: threads.created_at });
        }
        catch (err) {
            throw new Error(err.message || "Terjadi kesalahan");
        }
    });
}
function imageThreads(user_id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const threads = yield client_1.prisma.threads.findMany({
                where: { created_by: user_id,
                    image: {
                        not: null,
                        notIn: [""]
                    }
                },
                orderBy: {
                    created_at: "desc",
                },
                select: {
                    user: {
                        select: {
                            id: true,
                            username: true,
                            full_name: true,
                            photo_profile: true
                        }
                    },
                    image: true,
                    likes: {
                        select: { user: true }
                    },
                    number_of_replies: true
                },
            });
            if (threads.length === 0)
                throw new Error("image kosong");
            const threadsWithMeta = threads.map(thread => {
                const liked = thread.likes.some(like => like.user.id === user_id);
                return Object.assign(Object.assign({}, thread), { likes_count: thread.likes.length, isLiked: liked });
            });
            return threadsWithMeta;
        }
        catch (err) {
            throw new Error(err.message || "Terjadi kesalahan");
        }
    });
}
function seeUserThreads(user_id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const threads = yield client_1.prisma.threads.findMany({
                orderBy: {
                    created_at: "desc",
                },
                where: {
                    created_by: user_id,
                    content: {
                        not: ""
                    }
                },
                select: {
                    id: true,
                    content: true,
                    created_at: true,
                    number_of_replies: true,
                    likes: {
                        select: { user: { select: {
                                    id: true,
                                } }
                        }
                    },
                    user: {
                        select: {
                            id: true,
                            username: true,
                            full_name: true,
                            photo_profile: true,
                        }
                    }
                },
            });
            if (!threads)
                throw new Error("tidak ada treads tersedia");
            const result = threads.map(thread => {
                const liked = thread.likes.some(like => like.user.id === user_id);
                return Object.assign(Object.assign({}, thread), { likes_count: thread.likes.length, isLiked: liked });
            });
            return result;
        }
        catch (err) {
            throw new Error(err.message || "Terjadi kesalahan");
        }
    });
}
