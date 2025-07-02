import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, required: true },
    fullName: { type: String, required: true },
    password: { type: String, required: true, minLength: 6 },
    role: { type: String, default: "user", enum: ["user", "admin"] },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
