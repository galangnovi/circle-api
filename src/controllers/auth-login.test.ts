import { handlerLoginUser } from "./auth-login";
import { loginUser } from "../services/auth-login";
import httpMocks from "node-mocks-http";

jest.mock("../services/auth-login", () => ({
  loginUser: jest.fn(),
}));

describe("handlerLoginUser", () => {
  it("should login successfully", async () => {
    const req = httpMocks.createRequest({
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

    const res = httpMocks.createResponse();

    (loginUser as jest.Mock).mockResolvedValue(mockUser);

    await handlerLoginUser(req as any, res as any);

    expect(res.statusCode).toBe(200);
    const json = res._getJSONData();
    expect(json.status).toBe("success");
    expect(json.data.username).toBe("testuser");
  });

  it("should return error if already logged in", async () => {
    const req = httpMocks.createRequest({
      method: "POST",
      body: {
        identifier: "testuser",
        password: "password123",
      },
      session: {
        user: { username: "alreadyLoggedIn" },
      },
    });

    const res = httpMocks.createResponse();

    await handlerLoginUser(req as any, res as any);

    expect(res.statusCode).toBe(500);
    const json = res._getJSONData();
    expect(json.message).toMatch(/logout akun anda dahulu/i);
  });

  it("should return error if missing input", async () => {
    const req = httpMocks.createRequest({
      method: "POST",
      body: {
        identifier: "",
        password: "",
      },
      session: {},
    });

    const res = httpMocks.createResponse();

    await handlerLoginUser(req as any, res as any);

    expect(res.statusCode).toBe(500);
    const json = res._getJSONData();
    expect(json.message).toMatch(/user atau password salah/i);
  });
});

// npx jest