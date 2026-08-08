import mongoose from "mongoose";
import config from "../../config/config.js";
import School from "../models/school.model.js";

const run = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    console.log("Connected to Atlas:", config.mongoUri);

    const newSchool = await School.create({
      schoolname: "centennial - School of Engineering",
      campus: "Progress Campus",
      description: "This entry confirms the backend successfully writes to MongoDB Atlas.",
    });

    console.log("School created successfully:");
    console.log(newSchool);

    const allSchools = await School.find();
    console.log(`\nTotal schools in database: ${allSchools.length}`);
    console.log(allSchools);

    await mongoose.disconnect();
    console.log("\nDone. Connection closed.");
  } catch (err) {
    console.error("Error:", err);
  }
};

run();