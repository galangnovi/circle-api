"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signEncToken = signEncToken;
exports.verifyToken = verifyToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_js_1 = __importDefault(require("crypto-js"));
const JWT_SECRET = process.env.JWT_SECRET || "data_aman";
const ENC_SECRET = process.env.ENC_SECRET || "data_terlindungi";
function signEncToken(payload) {
    const encPayload = crypto_js_1.default.AES.encrypt(JSON.stringify(payload), ENC_SECRET).toString();
    return jsonwebtoken_1.default.sign({ data: encPayload }, JWT_SECRET, { expiresIn: "1d" });
}
function verifyToken(token) {
    const verify = jsonwebtoken_1.default.verify(token, JWT_SECRET);
    const decp = crypto_js_1.default.AES.decrypt(verify.data, ENC_SECRET);
    const decrypted = decp.toString(crypto_js_1.default.enc.Utf8);
    return JSON.parse(decrypted);
}
