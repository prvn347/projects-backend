import request from "supertest";
import { describe, expect, test, vi } from "vitest";
import { app } from "../server";

import fs from "fs/promises";
vi.mock("../db");
vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn().mockReturnValue({
    storage: {
      from: vi.fn().mockReturnValue({
        upload: vi.fn(),
        getPublicUrl: vi.fn(),
        createSignedUrl: vi.fn(),
      }),
    },
  }),
}));
vi.mock("axios", () => ({
  get: vi.fn(),
}));
vi.mock("fs/promises", () => ({
  readFile: vi.fn(),
  unlink: vi.fn(),
}));
// describe("POST /user/signup", () => {
//   test("should return 201 and user created!", async () => {
//     const res = await request(app).post("/user/signup").send({
//       email: "prsdvnsssj@gmail.com",
//       username: "jsfdssdsflaj222",
//       password: "alssdfjsdflk",
//       name: "pravsin",
//     });
//     expect(res.statusCode).toBe(201);
//     expect(res.body.user).toBe("user created");
//   });
// });

// describe("POST /user/signin", () => {
//   test("should return 201 status code and user data", async () => {
//     const res = await request(app).post("/user/signin").send({
//       email: "prainssssssji@gmail.com",
//       password: "passswordsd",
//     });

//     expect(res.statusCode).toBe(201);
//     expect(res.body.user.id).toBe(11);
//   });
// });

describe("POST /image/", () => {
  test("shoudl return 201 and image meta data", async () => {
    const filePath = `${__dirname}/name.png`;

    console.log(filePath);
    const fileContent = await fs.readFile(filePath);
    const res = await request(app).post("/image/").send(3).attach("file", fileContent);

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe("File uploaded successfully");
  });
});
