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
exports.handlerActionUnFollow = exports.handlerActionFollow = exports.handlerGetFollowersOrFollowing = void 0;
const follows_1 = require("../services/follows");
const handlerGetFollowersOrFollowing = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user_id = req.session.user.user_id;
        const { type } = req.query;
        if (!user_id)
            throw new Error("User tidak ditemukan");
        if (type !== "followers" && type !== "following") {
            return res.status(400).json({
                code: 400,
                status: "error",
                message: "Query 'type' harus terisi : 'followers' atau 'following'",
            });
        }
        const result = type === "followers"
            ? yield (0, follows_1.getFollower)(user_id)
            : yield (0, follows_1.getFollowing)(user_id);
        console.log(result);
        return res.status(200).json({
            code: 200,
            status: "success",
            message: `Sukses menampilkan ${type}`,
            data: result,
        });
    }
    catch (err) {
        return res.status(500).json({
            code: 500,
            status: "error",
            message: err.message || "operasi gagal",
        });
    }
    ;
});
exports.handlerGetFollowersOrFollowing = handlerGetFollowersOrFollowing;
const handlerActionFollow = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user_id = req.session.user.user_id;
        const followed_id = req.body.followed_id;
        if (!user_id)
            throw new Error("user tidak ditemukan");
        if (!followed_id)
            throw new Error("user follower tidak ditemukan");
        const result = yield (0, follows_1.actionFollow)(user_id, followed_id);
        return res.status(200).json({
            code: 200,
            status: "success",
            message: "You have successfully followed the user.",
            data: result,
        });
    }
    catch (err) {
        return res.status(500).json({
            code: 500,
            status: "error",
            message: err.message || "operasi gagal",
        });
    }
    ;
});
exports.handlerActionFollow = handlerActionFollow;
const handlerActionUnFollow = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user_id = req.session.user.user_id;
        const followed_id = req.body.followed_id;
        if (!user_id)
            throw new Error("user tidak ditemukan");
        if (!followed_id)
            throw new Error("Followed user tidak ditemukan");
        const result = yield (0, follows_1.actionUnfollow)(user_id, followed_id);
        return res.status(200).json({
            code: 200,
            status: "success",
            message: "You have successfully unfollowed the user.",
            data: result,
        });
    }
    catch (err) {
        return res.status(500).json({
            code: 500,
            status: "error",
            message: err.message || "operasi gagal",
        });
    }
    ;
});
exports.handlerActionUnFollow = handlerActionUnFollow;
