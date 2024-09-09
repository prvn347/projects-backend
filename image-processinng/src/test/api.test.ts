import request from "supertest";
import { describe, expect, test, vi } from "vitest";
import { app } from "../server";

vi.mock("../db");
vi.mock("../storage", () => ({
  supabase: {
    storage: {
      from: vi.fn(),
      getPublicUrl: vi.fn(),
      upload: vi.fn(),
      createSignedUrl: vi.fn(),
    },
  },
}));

// describe("POST /user/signup", () => {
//   test("should return 201 and user created!", async () => {
//     const res = await request(app).post("/user/signup").send({
//       email: "psrsdvnnsssj@gmail.com",
//       username: "jssfdssdsflaj222",
//       password: "alssdfjsdflk",
//       name: "pravsin",
//     });
//     expect(res.statusCode).toBe(201);
//     expect(res.body.user).toBe("user created");
//   });
// });

describe("POST /user/signin", () => {
  test("should return 201 status code and user data", async () => {
    const res = await request(app).post("/user/signin").send({
      email: "psrsdvnnsssj@gmail.com",
      password: "alssdfjsdflk",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.user.id).toBe(1);
  });
});

describe(" POST /image/:id/transform", () => {
  test("should return the transform signed url", async () => {
    const res = await request(app)
      .post("/image/1/transform")
      .set(
        "Cookie",
        "token=eyJhbGciOiJIUzI1NiJ9.Nw.LOTqSiU2qyaqXoAZZ3ClHemLdi9RVBNNgRbEZxIMYw4; Path=/; Secure; HttpOnly; Expires=Mon, 09 Sep 2024 08:21:29 GMT;"
      )
      .send({
        resize: {
          width: 400,
          height: 500,
        },
      });
    expect(res.body.result.imageId).toBe(1);
    expect(res.statusCode).toBe(201);
  });
});
