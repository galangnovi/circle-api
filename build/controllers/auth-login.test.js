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
const auth_login_1 = require("./auth-login");
const auth_login_2 = require("../services/auth-login");
const node_mocks_http_1 = __importDefault(require("node-mocks-http"));
jest.mock("../services/auth-login", () => ({
    loginUser: jest.fn(),
}));
describe("handlerLoginUser", () => {
    it("should login successfully", () => __awaiter(void 0, void 0, void 0, function* () {
        const req = node_mocks_http_1.default.createRequest({
            method: "POST",
            body: {
                identifier: "testuser",
                password: "password123",
            },
            session: {}, // belum login
        });
        const mockUser = {
            user_id: 1,
            username: "testuser",
            name: "Test User",
            email: "test@example.com",
            avatar: "avatar.png",
            token: "mocked-jwt-token",
        };
        const res = node_mocks_http_1.default.createResponse();
        auth_login_2.loginUser.mockResolvedValue(mockUser);
        yield (0, auth_login_1.handlerLoginUser)(req, res);
        expect(res.statusCode).toBe(200);
        const json = res._getJSONData();
        expect(json.status).toBe("success");
        expect(json.data.username).toBe("testuser");
    }));
    it("should return error if already logged in", () => __awaiter(void 0, void 0, void 0, function* () {
        const req = node_mocks_http_1.default.createRequest({
            method: "POST",
            body: {
                identifier: "testuser",
                password: "password123",
            },
            session: {
                user: { username: "alreadyLoggedIn" },
            },
        });
        const res = node_mocks_http_1.default.createResponse();
        yield (0, auth_login_1.handlerLoginUser)(req, res);
        expect(res.statusCode).toBe(500);
        const json = res._getJSONData();
        expect(json.message).toMatch(/logout akun anda dahulu/i);
    }));
    it("should return error if missing input", () => __awaiter(void 0, void 0, void 0, function* () {
        const req = node_mocks_http_1.default.createRequest({
            method: "POST",
            body: {
                identifier: "",
                password: "",
            },
            session: {},
        });
        const res = node_mocks_http_1.default.createResponse();
        yield (0, auth_login_1.handlerLoginUser)(req, res);
        expect(res.statusCode).toBe(500);
        const json = res._getJSONData();
        expect(json.message).toMatch(/user atau password salah/i);
    }));
});
// npx jest
