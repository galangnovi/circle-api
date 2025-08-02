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
exports.handlerisuserActive = exports.handlerRecomendation = exports.handlerSearchuser = void 0;
const user_1 = require("../services/user");
const jwt_utils_1 = require("../utils/jwt-utils");
const handlerSearchuser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user_id = req.session.user.user_id;
        const keyword = req.query.keyword;
        if (!user_id)
            throw new Error("user id tidak ditemukan");
        if (!keyword)
            throw new Error("keyword tidak ditemukan");
        const result = yield (0, user_1.searchUser)(user_id, keyword);
        return res.status(200).json({
            code: 200,
            status: "success",
            message: "User Ditemukan",
            data: result,
        });
    }
    catch (err) {
        return res.status(500).json({
            code: 500,
            status: "error",
            message: err.message || "Failed to fetch user data. Please try again later.",
        });
    }
    ;
});
exports.handlerSearchuser = handlerSearchuser;
const handlerRecomendation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user_id = req.session.user.user_id;
        if (!user_id)
            throw new Error("user id tidak ditemukan");
        const result = yield (0, user_1.recomendationUser)(user_id);
        return res.status(200).json({
            code: 200,
            status: "success",
            message: "User Ditemukan",
            data: result,
        });
    }
    catch (err) {
        return res.status(500).json({
            code: 500,
            status: "error",
            message: err.message || "Failed to fetch user data. Please try again later.",
        });
    }
});
exports.handlerRecomendation = handlerRecomendation;
const handlerisuserActive = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = req.cookies.token;
        if (!token)
            return res.json(null);
        const userToken = (0, jwt_utils_1.verifyToken)(token); // asumsi ini tidak throw error jika token valid
        const userSession = (_a = req.session) === null || _a === void 0 ? void 0 : _a.user;
        // Jika session tidak ada atau tidak valid
        if (!userSession || !userSession.user_id) {
            return res.json(null);
        }
        // Bandingkan ID dari token dan session
        const isMatch = userToken.id === userSession.user_id;
        return res.json(isMatch ? token : null);
    }
    catch (error) {
        console.error("Error in handlerisuserActive:", error);
        return res.status(401).json({ message: "Unauthorized" });
    }
});
exports.handlerisuserActive = handlerisuserActive;
