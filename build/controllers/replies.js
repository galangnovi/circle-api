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
exports.handlerAddNewReply = exports.handlerAllReplies = void 0;
const replies_1 = require("../services/replies");
const app_1 = require("../app");
const imageQueue_1 = require("../queues/imageQueue");
const handlerAllReplies = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user_id = req.session.user.user_id;
        const limit = Number(req.query.limit);
        const thread_id = Number(req.query.thread_id);
        if (!user_id)
            throw new Error("user tidak ditemukan");
        if (!thread_id)
            throw new Error("id Threads tidak ada");
        if (!limit)
            throw new Error("atur batas limit dahulu !");
        const result = yield (0, replies_1.seeAllReplies)(user_id, thread_id, limit);
        return res.status(200).json({
            code: 200,
            status: "success",
            message: "Data Replies ditemukan",
            data: result,
        });
    }
    catch (err) {
        return res.status(500).json({
            code: 500,
            status: "error",
            message: err.message || "Replies tidak ditemukan",
        });
    }
    ;
});
exports.handlerAllReplies = handlerAllReplies;
const handlerAddNewReply = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const user_id = req.session.user.user_id;
        if (!user_id)
            throw new Error("user tidak ditemukan");
        const thread_id = Number(req.query.thread_id);
        const content = req.body.content;
        const image = (_b = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path) !== null && _b !== void 0 ? _b : null;
        const result = yield (0, replies_1.addreplies)(user_id, thread_id, content, image);
        (0, app_1.notifyNewReply)(result);
        if (image) {
            yield (0, imageQueue_1.addImageJob)(image);
        }
        return res.status(200).json({
            code: 200,
            status: "success",
            message: "Reply Berhasil Diposting",
            data: result,
        });
    }
    catch (err) {
        return res.status(500).json({
            code: 500,
            status: "error",
            message: err.message || "Gagal menambahkan threads",
        });
    }
    ;
});
exports.handlerAddNewReply = handlerAddNewReply;
