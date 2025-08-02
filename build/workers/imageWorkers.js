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
const bullmq_1 = require("bullmq");
const redis_1 = require("../queues/redis");
const sharp_1 = __importDefault(require("sharp"));
const path_1 = __importDefault(require("path"));
new bullmq_1.Worker('image-processing', (job) => __awaiter(void 0, void 0, void 0, function* () {
    const { imagePath } = job.data;
    console.log('[Worker] Mulai proses:', imagePath);
    try {
        const ext = path_1.default.extname(imagePath);
        const outputPath = imagePath.replace(ext, `_compressed${ext}`);
        yield (0, sharp_1.default)(imagePath)
            .resize({ width: 800 })
            .jpeg({ quality: 80 })
            .toFile(outputPath);
        console.log('[Worker] Berhasil simpan ke:', outputPath);
        // Optional: Hapus original jika perlu
        // fs.unlinkSync(imagePath)
    }
    catch (err) {
        console.error('[Worker] Gagal proses image:', err);
    }
}), { connection: redis_1.connection });
