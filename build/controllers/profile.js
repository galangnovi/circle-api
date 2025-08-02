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
exports.handlerEditProfile = exports.handlerMyProfile = void 0;
const profile_1 = require("../services/profile");
const handlerMyProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user_id = req.session.user.user_id;
        if (!user_id)
            throw new Error("user tidak ditemukan");
        const result = yield (0, profile_1.myProfile)(user_id);
        return res.status(200).json({
            code: 200,
            status: "success",
            message: "Data Profile ditemukan",
            data: result
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
exports.handlerMyProfile = handlerMyProfile;
const handlerEditProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    try {
        const user_id = req.session.user.user_id;
        if (!user_id)
            throw new Error("user tidak ditemukan");
        const { email, username, full_name, bio } = req.body;
        const files = req.files;
        const photo_profile = (_c = (_b = (_a = files['photo_profile']) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.path) !== null && _c !== void 0 ? _c : null;
        const cover_Photo = (_f = (_e = (_d = files['cover_Photo']) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.path) !== null && _f !== void 0 ? _f : null;
        const result = yield (0, profile_1.editProfile)(user_id, email, username, full_name, bio, photo_profile, cover_Photo);
        return res.status(200).json({
            code: 200,
            status: "success",
            message: "Data Profile berhasil dirubah",
            data: result,
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
exports.handlerEditProfile = handlerEditProfile;
