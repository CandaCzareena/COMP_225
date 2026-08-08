import mongoose from "mongoose";
import config from "../../config/config.js";
import Program from "../models/program.model.js";

const run = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    console.log("Connected to Atlas:", config.mongoUri);

    const newProgram = await Program.create({
      title: "TEST - Saul",
      type: "Diploma",
      description: "This entry confirms the backend successfully writes to MongoDB Atlas.",
    });

    console.log("Program created successfully:");
    console.log(newProgram);

    const allPrograms = await Program.find();
    console.log(`\nTotal programs in database: ${allPrograms.length}`);
    console.log(allPrograms);

    await mongoose.disconnect();
    console.log("\nDone. Connection closed.");
  } catch (err) {
    console.error("Error:", err);
  }
};

run();