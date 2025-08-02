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
exports.handlerUserThreads = exports.handlerImageThreads = exports.handlerAddNewThread = exports.handlerThreadsDetail = exports.handlerAllThreads = void 0;
const threads_1 = require("../services/threads");
const app_1 = require("../app");
const imageQueue_1 = require("../queues/imageQueue");
const handlerAllThreads = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user_id = req.session.user.user_id;
        const { limit } = req.query;
        if (!user_id)
            throw new Error("user tidak ditemukan");
        const result = yield (0, threads_1.seeAllTreads)(user_id, limit);
        return res.status(200).json({
            code: 200,
            status: "success",
            message: "Data Threads ditemukan",
            data: result,
        });
    }
    catch (err) {
        return res.status(500).json({
            code: 500,
            status: "error",
            message: err.message || "Threads tidak ditemukan",
        });
    }
    ;
});
exports.handlerAllThreads = handlerAllThreads;
const handlerThreadsDetail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user_id = req.session.user.user_id;
        const threads_id = Number(req.params.id);
        if (!user_id)
            throw new Error("user tidak ditemukan");
        if (!threads_id)
            throw new Error("id Threads tidak ada");
        const result = yield (0, threads_1.ThreadsDetail)(user_id, threads_id);
        return res.status(200).json({
            code: 200,
            status: "success",
            message: "Data Threads ditemukan",
            data: result,
        });
    }
    catch (err) {
        return res.status(500).json({
            code: 500,
            status: "error",
            message: err.message || "Threads tidak ditemukan",
        });
    }
    ;
});
exports.handlerThreadsDetail = handlerThreadsDetail;
const handlerAddNewThread = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const created_by = req.session.user.user_id;
        const { content } = req.body;
        const image = (_b = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path) !== null && _b !== void 0 ? _b : null;
        const result = yield (0, threads_1.addThreads)(created_by, content, image);
        (0, app_1.notifyNewThread)(result);
        if (image) {
            yield (0, imageQueue_1.addImageJob)(image);
        }
        return res.status(200).json({
            code: 200,
            status: "success",
            message: "Berhasil menambahkan threads",
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
exports.handlerAddNewThread = handlerAddNewThread;
const handlerImageThreads = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user_id = req.session.user.user_id;
        if (!user_id)
            throw new Error("user tidak ditemukan");
        const result = yield (0, threads_1.imageThreads)(user_id);
        return res.status(200).json({
            code: 200,
            status: "success",
            message: "Data Image Threads ditemukan",
            data: result,
        });
    }
    catch (err) {
        return res.status(500).json({
            code: 500,
            status: "error",
            message: err.message || "Threads tidak ditemukan",
        });
    }
    ;
});
exports.handlerImageThreads = handlerImageThreads;
const handlerUserThreads = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user_id = req.session.user.user_id;
        if (!user_id)
            throw new Error("user tidak ditemukan");
        const result = yield (0, threads_1.seeUserThreads)(user_id);
        return res.status(200).json({
            code: 200,
            status: "success",
            message: "Data Threads User ditemukan",
            data: result,
        });
    }
    catch (err) {
        return res.status(500).json({
            code: 500,
            status: "error",
            message: err.message || "Threads tidak ditemukan",
        });
    }
    ;
});
exports.handlerUserThreads = handlerUserThreads;
