import { describe, expect, test, it } from "vitest";
import request from "supertest";
import { app } from "../server";

describe("POST /user/signup", () => {
  it("should return the created user", async () => {
    const res = await request(app).post("/user/signup").send({
      name: "pravinsahu",
      password: "password",
      username: "username",
      email: "pransk@gmail",
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.user).toBe("user created");
  });
});
