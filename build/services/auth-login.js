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
exports.loginUser = loginUser;
exports.registerUser = registerUser;
const client_1 = require("../prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_account_1 = require("../validations/user-account");
const jwt_utils_1 = require("../utils/jwt-utils");
function loginUser(identifier, password) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const isUser = yield client_1.prisma.users.findFirst({
                where: {
                    OR: [
                        { email: identifier },
                        { username: identifier },
                    ]
                }
            });
            if (!isUser)
                throw new Error("user tidak ditemukan");
            const isMatch = yield bcrypt_1.default.compare(password, isUser.password);
            if (!isMatch)
                throw new Error("password salah");
            const payload = {
                id: isUser.id,
                username: isUser.username,
                name: isUser.full_name,
                email: isUser.email,
            };
            const token = (0, jwt_utils_1.signEncToken)(payload);
            return {
                user_id: isUser.id,
                username: isUser.username,
                name: isUser.full_name,
                email: isUser.email,
                avatar: isUser.photo_profile,
                token
            };
        }
        catch (err) {
            throw new Error(err.message || "Terjadi kesalahan");
        }
    });
}
function registerUser(username, name, email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { error } = user_account_1.registerScema.validate({ email, password });
            if (error)
                throw new Error(error.message);
            const hashed = yield bcrypt_1.default.hash(password, 10);
            const user = yield client_1.prisma.users.create({
                data: {
                    username,
                    full_name: name,
                    email,
                    password: hashed
                }
            });
            const userPayLoad = {
                id: user.id,
                username: user.username,
                name: user.full_name,
                email: user.email,
            };
            const token = (0, jwt_utils_1.signEncToken)(userPayLoad);
            return { id: user.id, username: user.username, full_name: user.full_name, email: user.email, token };
        }
        catch (err) {
            if ((err === null || err === void 0 ? void 0 : err.code) === 'P2002') {
                throw new Error("Email atau username sudah terdaftar.");
            }
            throw new Error(err.message || "Terjadi kesalahan");
        }
    });
}
