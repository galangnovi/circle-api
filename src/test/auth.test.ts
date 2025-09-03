import request from "supertest";
import express from "express";
import session from "express-session";
import cookieParser from "cookie-parser";
import { handlerLoginUser, handlerRegisterUser, logout } from "../controllers/auth-login";
import { prisma } from "../prisma/client";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);


app.post("/auth/login", handlerLoginUser);
app.post("/auth/register", handlerRegisterUser);
app.post("/logout", logout);

describe("Integration Test: Auth Routes", () => {
  const testEmail = "integration@test.com";

  beforeAll(async () => {
    await prisma.users.deleteMany({ where: { email: testEmail } });
  });

  afterAll(async () => {
    await prisma.users.deleteMany({ where: { email: testEmail } });
    await prisma.$disconnect();
  });

  it("should register a new user", async () => {
    const res = await request(app).post("/auth/register").send({
      username: "intgrtion",
      name: "Integration Test",
      email: testEmail,
      password: "password123",
    });


    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("success");
  });

  it("should login with registered user", async () => {
    const res = await request(app).post("/auth/login").send({
      identifier: testEmail,
      password: "password123",
    });
    

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("success");
    expect(res.body.data).toHaveProperty("token");
  });
});
