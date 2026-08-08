import mongoose from "mongoose";
import config from "../../config/config.js";
import User from "../models/user.model.js";

const run = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    console.log("Connected to Atlas:", config.mongoUri);

    // note: we send "password" (not "hashed_password") because
    // the User model has a virtual field that encrypts it automatically
    const newUser = await User.create({
      name: "aul Ramirez",
      email: `saulramirez@centennialcollege.ca`,
      password: "centennial123",
    });

    console.log("User created successfully:");
    console.log(newUser);

    const allUsers = await User.find();
    console.log(`\nTotal users in database: ${allUsers.length}`);
    console.log(allUsers);

    await mongoose.disconnect();
    console.log("\nDone. Connection closed.");
  } catch (err) {
    console.error("Error:", err);
  }
};

run();