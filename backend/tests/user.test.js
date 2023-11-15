const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../index");

require("dotenv").config();

/* Connecting to the database before each test. */
beforeEach(async () => {
  await mongoose.connect(process.env.DB_STRING);
});

/* Closing database connection after each test. */
afterEach(async () => {
  await mongoose.connection.close();
});

describe("GET /users/", () => {
  it("Should return all users", async () =>{
    const res = await request(app).get("/users/");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });
});
