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
exports.searchUser = searchUser;
exports.recomendationUser = recomendationUser;
const client_1 = require("../prisma/client");
function searchUser(user_id, identifier) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const users = yield client_1.prisma.users.findMany({
                where: {
                    OR: [
                        { username: { contains: identifier, mode: 'insensitive' } },
                        { full_name: { contains: identifier, mode: 'insensitive' } }
                    ]
                },
                select: {
                    id: true,
                    username: true,
                    full_name: true,
                    photo_profile: true,
                    followers: {
                        select: {
                            follower: {
                                select: { id: true }
                            }
                        }
                    },
                    _count: {
                        select: {
                            followers: true
                        }
                    }
                }
            });
            if (users.length === 0) {
                throw new Error("user tidak ditemukan");
            }
            const isFollowing = users.map((user) => {
                const is_following = user.followers.some(f => f.follower.id === user_id); // 🔥 cek apakah user sedang follow
                return {
                    id: user.id,
                    username: user.username,
                    name: user.full_name,
                    avatar: `http://localhost:3000/uploads/${encodeURIComponent(user.photo_profile)}`,
                    follower: user._count.followers,
                    is_following: is_following
                };
            });
            return isFollowing;
        }
        catch (err) {
            throw new Error(err.message || "Terjadi kesalahan");
        }
    });
}
function recomendationUser(user_id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const users = yield client_1.prisma.users.findMany({
                where: {
                    id: {
                        not: user_id,
                    },
                    followers: {
                        none: {
                            follower_id: user_id,
                        },
                    },
                },
                select: {
                    id: true,
                    username: true,
                    full_name: true,
                    photo_profile: true,
                    followers: {
                        select: {
                            follower: {
                                select: {
                                    id: true
                                }
                            }
                        }
                    }
                },
                take: 4,
                orderBy: {
                    id: 'asc',
                },
            });
            const isFollowing = users.map((user) => {
                const is_following = user.followers.some(f => f.follower.id === user_id); // 🔥 cek apakah user sedang follow
                return {
                    id: user.id,
                    username: user.username,
                    name: user.full_name,
                    avatar: `http://localhost:3000/uploads/${encodeURIComponent(user.photo_profile)}`,
                    is_following: is_following
                };
            });
            return isFollowing;
        }
        catch (err) {
            throw new Error(err.message || "Terjadi kesalahan");
        }
    });
}
