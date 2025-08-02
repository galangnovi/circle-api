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
exports.logout = exports.handlerRegisterUser = exports.handlerLoginUser = void 0;
const auth_login_1 = require("../services/auth-login");
const auth_login_2 = require("../services/auth-login");
const handlerLoginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { identifier, password } = req.body;
        if (!identifier || !password)
            throw new Error("user atau password salah");
        const useractive = req.session.user;
        if (useractive)
            throw new Error("logout akun anda dahulu untuk melanjutkan");
        const match = yield (0, auth_login_1.loginUser)(identifier, password);
        req.session.user = {
            user_id: match.user_id,
            username: match.username,
            name: match.name,
            email: match.email,
            avatar: match.avatar,
        };
        res.cookie("token", match.token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 1000 * 60 * 60 * 2,
        });
        console.log("Session disimpan:", req.session.user);
        return res.status(200).json({
            code: 200,
            status: "success",
            message: "Login successful.",
            data: match,
        });
    }
    catch (err) {
        return res.status(500).json({
            code: 500,
            status: "error",
            message: err.message || "Invalid Login",
        });
    }
});
exports.handlerLoginUser = handlerLoginUser;
const handlerRegisterUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, name, email, password } = req.body;
        if (!email || !password)
            throw new Error("email atau password kosong");
        if (!name)
            throw new Error("nama user kosong");
        if (!username)
            throw new Error("nama user name kosong");
        if (username.length > 10)
            throw new Error("Username maksimal 10 karakter");
        const user = yield (0, auth_login_2.registerUser)(username, name, email, password);
        return res.status(200).json({
            code: 200,
            status: "success",
            message: "Registrasi berhasil. Akun berhasil dibuat.",
            data: user,
        });
    }
    catch (err) {
        return res.status(500).json({
            code: 500,
            status: "error",
            message: err.message || "Invalid register",
        });
    }
});
exports.handlerRegisterUser = handlerRegisterUser;
const logout = (req, res) => {
    req.session.destroy(() => {
        res.clearCookie("token");
        res.json({ message: "Logout berhasil" });
    });
};
exports.logout = logout;
