import request from "supertest";
import { describe, expect, test, vi } from "vitest";
import { app } from "../server";

vi.mock("../db");
describe("POST /user/signin", () => {
  test("should return 201 and user created!", async () => {
    const res = await request(app).post("/user/signup").send({
      email: "prvnssj@gmail.com",
      username: "jssdflaj222",
      password: "alssdfjsdflk",
      name: "pravsin",
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.user).toBe("user created");
  });
});
