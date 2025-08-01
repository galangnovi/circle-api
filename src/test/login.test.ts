import request from "supertest";
import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import { handlerLoginUser } from "../controllers/auth-login";

// Jika pakai Prisma, tambahkan juga prisma dan hash password jika diperlukan
import { prisma } from "../prisma/client";
import bcrypt from "bcrypt";

// Buat app manual
const app = express();
app.use(bodyParser.json());
app.use(session({
  secret: "testsecret",
  resave: false,
  saveUninitialized: false,
}));

// Route login manual
app.post("/login", handlerLoginUser);

beforeAll(async () => {
  // Insert user dummy untuk login
  const hashed = await bcrypt.hash("password123", 10);
  await prisma.users.create({
    data: {
      username: "testuser",
      full_name: "Test User",
      email: "test@example.com",
      password: hashed,
    },
  });
});

afterAll(async () => {
  await prisma.users.deleteMany({
    where:{username:"testuser"}
  });
  await prisma.$disconnect();
});

describe("Functional Test: Login (manual app)", () => {
  it("should login successfully with valid credentials", async () => {
    const res = await request(app)
      .post("/login")
      .send({ identifier: "test@example.com", password: "password123" });

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("success");
  });

  it("should return error if password is wrong", async () => {
    const res = await request(app)
      .post("/login")
      .send({ identifier: "test@example.com", password: "wrongpassword" });

    expect(res.statusCode).toBe(500);
    expect(res.body.status).toBe("error");
  });
});
