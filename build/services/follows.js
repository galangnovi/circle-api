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
exports.getFollower = getFollower;
exports.actionFollow = actionFollow;
exports.getFollowing = getFollowing;
exports.actionUnfollow = actionUnfollow;
const client_1 = require("../prisma/client");
function getFollower(user_id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const followers = yield client_1.prisma.following.findMany({
                where: { following_id: user_id },
                include: { follower: { select: {
                            id: true,
                            username: true,
                            full_name: true,
                            photo_profile: true,
                            followers: {
                                where: {
                                    follower_id: user_id
                                }
                            }
                        } }
                }
            });
            if (!followers)
                throw new Error("Failed to fetch follower data. Please try again later.");
            const formattedFollowers = followers.map((follower) => ({
                id: follower.follower.id,
                username: follower.follower.username,
                name: follower.follower.full_name,
                avatar: follower.follower.photo_profile,
                is_following: follower.follower.followers.length > 0,
            }));
            return formattedFollowers;
        }
        catch (err) {
            throw new Error(err.message || "Terjadi kesalahan");
        }
    });
}
function actionFollow(user_id, followed_id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const isFollowed = yield client_1.prisma.following.findMany({
                where: {
                    follower_id: user_id,
                    following_id: followed_id
                }
            });
            if (isFollowed.length > 0)
                throw new Error("user sudah di follow");
            const follow = yield client_1.prisma.following.create({
                data: {
                    follower_id: user_id,
                    following_id: followed_id
                }
            });
            if (!follow)
                throw new Error("Failed to follow the user. Please try again later.");
            return { user_id: follow.following_id, isFollowing: true };
        }
        catch (err) {
            throw new Error(err.message || "Failed to follow the user. Please try again later.");
        }
    });
}
function getFollowing(user_id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const followings = yield client_1.prisma.following.findMany({
                where: { follower_id: user_id },
                include: { following: { select: {
                            id: true,
                            username: true,
                            full_name: true,
                            photo_profile: true,
                        }
                    } }
            });
            if (!followings)
                throw new Error("Failed to fetch following data. Please try again later.");
            const formattedFollowers = followings.map((following) => ({
                id: following.following.id,
                username: following.following.username,
                name: following.following.full_name,
                avatar: following.following.photo_profile,
                is_following: true
            }));
            return formattedFollowers;
        }
        catch (err) {
            throw new Error(err.message || "Terjadi kesalahan");
        }
    });
}
function actionUnfollow(user_id, followed_id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const isFollowed = yield client_1.prisma.following.findMany({
                where: {
                    follower_id: user_id,
                    following_id: followed_id
                }
            });
            if (!isFollowed)
                throw new Error("kamu belum follow akun tersebut");
            const unfollow = yield client_1.prisma.following.deleteMany({
                where: {
                    follower_id: user_id,
                    following_id: followed_id
                }
            });
            if (!unfollow)
                throw new Error("Failed to unfollow the user. Please try again later.");
            return { user_id: followed_id, isFollowing: false };
        }
        catch (err) {
            throw new Error(err.message || "Terjadi kesalahan");
        }
    });
}
