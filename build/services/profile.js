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
exports.myProfile = myProfile;
exports.editProfile = editProfile;
const client_1 = require("../prisma/client");
function myProfile(user_id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const profile = yield client_1.prisma.users.findFirst({
                where: { id: user_id },
                select: {
                    username: true,
                    full_name: true,
                    photo_profile: true,
                    cover_photo: true,
                    bio: true,
                    email: true,
                    following: { select: {
                            following: true,
                            follower: true
                        } }
                }
            });
            if (!profile)
                throw new Error("terjadi kesalahan memuat data profile");
            const followingCount = yield client_1.prisma.following.count({
                where: { follower_id: user_id },
            });
            const followerCount = yield client_1.prisma.following.count({
                where: { following_id: user_id },
            });
            return Object.assign(Object.assign({}, profile), { followingCount,
                followerCount });
        }
        catch (err) {
            throw new Error(err.message || "Terjadi kesalahan");
        }
    });
}
function editProfile(user_id, email, username, full_name, bio, photo_profile, cover_Photo) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const profileData = yield client_1.prisma.users.findFirst({
                where: { id: user_id }
            });
            if (!profileData)
                throw new Error("profile tidak ditemukan");
            let Photo;
            if (!photo_profile) {
                Photo = profileData.photo_profile;
            }
            else {
                Photo = photo_profile;
            }
            let coverPhoto;
            if (!cover_Photo) {
                coverPhoto = profileData.cover_photo;
            }
            else {
                coverPhoto = cover_Photo;
            }
            const editProfile = yield client_1.prisma.users.update({
                where: { id: user_id },
                data: {
                    email,
                    username,
                    full_name,
                    bio,
                    photo_profile: Photo,
                    cover_photo: coverPhoto
                }
            });
            return editProfile;
        }
        catch (err) {
            throw new Error(err.message || "Gagal Edit profile");
        }
    });
}
