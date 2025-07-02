import express from "express";
import {
  getAllBookings,
  loginUser,
  registerUser,
} from "../controllers/userControllers.js";
import { protectRoute } from "../middlewares/auth.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/all/bookings", protectRoute, getAllBookings);

export default userRouter;
