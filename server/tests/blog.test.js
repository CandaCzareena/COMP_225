import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import app from "../express.js";
import Blog from "../models/blog.model.js";
import User from "../models/user.model.js";

let mongoServer;
let authToken;
let adminToken;

beforeAll(async () => {
  process.env.JWT_SECRET = process.env.JWT_SECRET || "test_secret_key";
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  await request(app).post("/api/users").send({
    name: "Test Student",
    email: "student@test.com",
    password: "password123",
    role: "student",
  });

  const studentLogin = await request(app).post("/auth/signin").send({
    email: "student@test.com",
    password: "password123",
  });
  authToken = studentLogin.body.token;

  const admin = new User({
    name: "Test Admin",
    email: "admin@test.com",
    password: "password123",
    role: "admin",
  });
  await admin.save();

  const adminLogin = await request(app).post("/auth/signin").send({
    email: "admin@test.com",
    password: "password123",
  });
  adminToken = adminLogin.body.token;
});

afterEach(async () => {
  await Blog.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Blog CRUD API", () => {
  test("POST /api/blogs creates a new blog when authenticated", async () => {
    const res = await request(app)
      .post("/api/blogs")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        title: "My first post",
        username: "nico",
        content: "Test content",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Blog Created");

    const blogsInDB = await Blog.find();
    expect(blogsInDB.length).toBe(1);
    expect(blogsInDB[0].title).toBe("My first post");
  });

  test("POST /api/blogs fails without auth", async () => {
    const res = await request(app).post("/api/blogs").send({
      title: "No auth",
      username: "nico",
      content: "Nope",
    });
    expect(res.statusCode).toBe(401);
  });

  test("POST /api/blogs fails when required fields are missing", async () => {
    const res = await request(app)
      .post("/api/blogs")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        username: "nico",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  test("GET /api/blogs returns the list of blogs", async () => {
    await Blog.create({
      title: "Post A",
      username: "nico",
      content: "content A",
    });
    await Blog.create({
      title: "Post B",
      username: "nico",
      content: "content B",
    });

    const res = await request(app).get("/api/blogs");

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);
  });

  test("GET /api/blogs/:blogId returns one blog", async () => {
    const blog = await Blog.create({
      title: "Single post",
      username: "nico",
      content: "single content",
    });

    const res = await request(app).get(`/api/blogs/${blog._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("Single post");
  });

  test("GET /api/blogs/:blogId returns 400 if id does not exist", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/blogs/${fakeId}`);

    expect(res.statusCode).toBe(400);
  });

  test("PUT /api/blogs/:blogId updates an existing blog", async () => {
    const blog = await Blog.create({
      title: "Old title",
      username: "nico",
      content: "old content",
    });

    const res = await request(app)
      .put(`/api/blogs/${blog._id}`)
      .set("Authorization", `Bearer ${authToken}`)
      .send({ title: "Updated title" });

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("Updated title");

    const updatedBlog = await Blog.findById(blog._id);
    expect(updatedBlog.title).toBe("Updated title");
  });

  test("DELETE /api/blogs/:blogId removes one blog", async () => {
    const blog = await Blog.create({
      title: "To delete",
      username: "nico",
      content: "content",
    });

    const res = await request(app)
      .delete(`/api/blogs/${blog._id}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Blog deleted");

    const blogInDB = await Blog.findById(blog._id);
    expect(blogInDB).toBeNull();
  });

  test("DELETE /api/blogs removes all blogs for admin", async () => {
    await Blog.create({ title: "A", username: "nico", content: "a" });
    await Blog.create({ title: "B", username: "nico", content: "b" });

    const res = await request(app)
      .delete("/api/blogs")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("2 blogs deleted");

    const blogsInDB = await Blog.find();
    expect(blogsInDB.length).toBe(0);
  });
});
