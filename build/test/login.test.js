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
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const body_parser_1 = __importDefault(require("body-parser"));
const auth_login_1 = require("../controllers/auth-login");
// Jika pakai Prisma, tambahkan juga prisma dan hash password jika diperlukan
const client_1 = require("../prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
// Buat app manual
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use((0, express_session_1.default)({
    secret: "testsecret",
    resave: false,
    saveUninitialized: false,
}));
// Route login manual
app.post("/login", auth_login_1.handlerLoginUser);
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    // Insert user dummy untuk login
    const hashed = yield bcrypt_1.default.hash("password123", 10);
    yield client_1.prisma.users.create({
        data: {
            username: "testuser",
            full_name: "Test User",
            email: "test@example.com",
            password: hashed,
        },
    });
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield client_1.prisma.users.deleteMany({
        where: { username: "testuser" }
    });
    yield client_1.prisma.$disconnect();
}));
describe("Functional Test: Login (manual app)", () => {
    it("should login successfully with valid credentials", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .post("/login")
            .send({ identifier: "test@example.com", password: "password123" });
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe("success");
    }));
    it("should return error if password is wrong", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app)
            .post("/login")
            .send({ identifier: "test@example.com", password: "wrongpassword" });
        expect(res.statusCode).toBe(500);
        expect(res.body.status).toBe("error");
    }));
});
