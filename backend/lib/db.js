import mongoose from "mongoose";

//Database connection
export const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URI}/Evently`);
    console.log("Database connected successfully.");
  } catch (error) {
    console.log("Error in connecting to database: ", error.message);
  }
};
