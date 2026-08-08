import mongoose from "mongoose";
import config from "../../config/config.js";
import Blog from "../models/blog.model.js";

const run = async () => {
  try {
    // connect to the REAL Atlas database (same one the app uses)
    await mongoose.connect(config.mongoUri);
    console.log("Connected to Atlas:", config.mongoUri);

    // create a test blog so we have visible proof in the database
    const newBlog = await Blog.create({
      title: "TEST - Saul Ramirez",
      content: "This entry confirms the backend successfully writes to MongoDB Atlas.",
      username: "saul_mexico",
    });

    console.log("Blog created successfully:");
    console.log(newBlog);

    // list all blogs currently in the database, for extra proof
    const allBlogs = await Blog.find();
    console.log(`\nTotal blogs in database: ${allBlogs.length}`);
    console.log(allBlogs);

    await mongoose.disconnect();
    console.log("\nDone. Connection closed.");
  } catch (err) {
    console.error("Error:", err);
  }
};

run();