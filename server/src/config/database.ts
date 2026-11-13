import mongoose from "mongoose";

const connectDB = async () => {
  const url = process.env.DB_URL?.trim();
  if (!url) {
    throw new Error("DB_URL is not set. Add your MongoDB connection string to server/.env.");
  }

  await mongoose.connect(url);
  console.log("MongoDB connected successfully.");
};

export default connectDB;
