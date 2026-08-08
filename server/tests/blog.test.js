// Unit tests for blog.controller.js
// We use a fake in-memory MongoDB so we don't touch the real Atlas database.
// We use Supertest to send fake HTTP requests to our Express app.

import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import app from "../express.js";
import Blog from "../models/blog.model.js";

let mongoServer;

// Runs once before all tests: start the fake DB and connect to it
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

// Runs after every single test: clear the collection
// This keeps tests independent from each other
afterEach(async () => {
  await Blog.deleteMany({});
});

// Runs once after all tests: close everything
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Blog CRUD API", () => {
  // ---------- CREATE ----------
  test("POST /api/blogs creates a new blog", async () => {
    const res = await request(app).post("/api/blogs").send({
      title: "My first post",
      username: "nico",
      content: "Test content",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Blog Created");

    // Check directly in the DB that it was actually saved
    const blogsInDB = await Blog.find();
    expect(blogsInDB.length).toBe(1);
    expect(blogsInDB[0].title).toBe("My first post");
  });

  test("POST /api/blogs fails when required fields are missing", async () => {
    const res = await request(app).post("/api/blogs").send({
      // no title or content here, so validation should fail
      username: "nico",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  // ---------- READ (list) ----------
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

  // ---------- READ (by id) ----------
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

  // ---------- UPDATE ----------
  test("PUT /api/blogs/:blogId updates an existing blog", async () => {
    const blog = await Blog.create({
      title: "Old title",
      username: "nico",
      content: "old content",
    });

    const res = await request(app)
      .put(`/api/blogs/${blog._id}`)
      .send({ title: "Updated title" });

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("Updated title");

    const updatedBlog = await Blog.findById(blog._id);
    expect(updatedBlog.title).toBe("Updated title");
  });

  // ---------- DELETE ----------
  test("DELETE /api/blogs/:blogId removes one blog", async () => {
    const blog = await Blog.create({
      title: "To delete",
      username: "nico",
      content: "content",
    });

    const res = await request(app).delete(`/api/blogs/${blog._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Blog deleted");

    const blogInDB = await Blog.findById(blog._id);
    expect(blogInDB).toBeNull();
  });

  test("DELETE /api/blogs removes all blogs", async () => {
    await Blog.create({ title: "A", username: "nico", content: "a" });
    await Blog.create({ title: "B", username: "nico", content: "b" });

    const res = await request(app).delete("/api/blogs");

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("2 blogs deleted");

    const blogsInDB = await Blog.find();
    expect(blogsInDB.length).toBe(0);
  });
});