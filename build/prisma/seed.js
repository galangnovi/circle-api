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
const client_1 = require("./client");
const bcrypt_1 = __importDefault(require("bcrypt"));
function password(pass) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.hash(pass, 10);
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield client_1.prisma.threads.deleteMany();
        yield client_1.prisma.following.deleteMany();
        yield client_1.prisma.likes.deleteMany();
        yield client_1.prisma.replies.deleteMany();
        yield client_1.prisma.users.deleteMany();
        const user1 = yield client_1.prisma.users.create({
            data: { username: "Galang", full_name: "Galang Anggara", email: "galang@gmail.com", password: yield password("123456"), bio: "aku suka makan" },
        });
        const user2 = yield client_1.prisma.users.create({
            data: { username: "Sinta", full_name: "Sinta Arinda", email: "sinta@gmail.com", password: yield password("123456"), bio: "aku suka makan" }
        });
        const user3 = yield client_1.prisma.users.create({
            data: { username: "Priska", full_name: "Priska Utami", email: "priska@gmail.com", password: yield password("123456"), bio: "aku suka makan" }
        });
        const user4 = yield client_1.prisma.users.create({
            data: { username: "Budi", full_name: "Budi Anggara", email: "budi@gmail.com", password: yield password("123456"), bio: "aku suka makan" }
        });
        const user5 = yield client_1.prisma.users.create({
            data: { username: "jhon", full_name: "Jhon Steve", email: "jhon@gmail.com", password: yield password("123456"), bio: "aku suka makan" }
        });
        yield client_1.prisma.following.createMany({
            data: [
                { follower_id: user1.id, following_id: user2.id },
                { follower_id: user2.id, following_id: user1.id },
                { follower_id: user1.id, following_id: user3.id },
                { follower_id: user3.id, following_id: user5.id },
                { follower_id: user5.id, following_id: user2.id },
                { follower_id: user4.id, following_id: user1.id },
                { follower_id: user5.id, following_id: user4.id },
            ]
        });
        const threads1 = yield client_1.prisma.threads.create({
            data: { content: "lagi bingung nih sumpah", number_of_replies: 1, created_by: user1.id }
        });
        const threads2 = yield client_1.prisma.threads.create({
            data: { content: "enaknya ngapain ya", number_of_replies: 0, created_by: user2.id }
        });
        const threads3 = yield client_1.prisma.threads.create({
            data: { content: "bingung banget mau ngapain", number_of_replies: 0, created_by: user3.id }
        });
        const threads4 = yield client_1.prisma.threads.create({
            data: { content: "bingungggggggg........", number_of_replies: 0, created_by: user4.id }
        });
        const threads5 = yield client_1.prisma.threads.create({
            data: { content: "makan enak kali ya", number_of_replies: 0, created_by: user5.id }
        });
        yield client_1.prisma.likes.createMany({
            data: [
                { user_id: user2.id, thread_id: threads1.id, created_by: user1.id },
                { user_id: user2.id, thread_id: threads2.id, created_by: user2.id },
                { user_id: user2.id, thread_id: threads3.id, created_by: user3.id },
                { user_id: user2.id, thread_id: threads4.id, created_by: user4.id },
                { user_id: user2.id, thread_id: threads5.id, created_by: user5.id }
            ]
        });
    });
}
main();
