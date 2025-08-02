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
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_login_1 = require("../controllers/auth-login");
const client_1 = require("../prisma/client");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, express_session_1.default)({
    secret: "secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
}));
// Routes manual
app.post("/auth/login", auth_login_1.handlerLoginUser);
app.post("/auth/register", auth_login_1.handlerRegisterUser);
app.post("/logout", auth_login_1.logout);
describe("Integration Test: Auth Routes", () => {
    const testEmail = "integration@test.com";
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield client_1.prisma.users.deleteMany({ where: { email: testEmail } });
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield client_1.prisma.users.deleteMany({ where: { email: testEmail } });
        yield client_1.prisma.$disconnect();
    }));
    it("should register a new user", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).post("/auth/register").send({
            username: "intgrtion",
            name: "Integration Test",
            email: testEmail,
            password: "password123",
        });
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe("success");
    }));
    it("should login with registered user", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).post("/auth/login").send({
            identifier: testEmail,
            password: "password123",
        });
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe("success");
        expect(res.body.data).toHaveProperty("token");
    }));
});
