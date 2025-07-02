import express from "express";
import {
  finalizePaidBooking,
  cancelBooking,
} from "../controllers/bookingControllers.js";
import { protectRoute } from "../middlewares/auth.js";

const bookingRouter = express.Router();

bookingRouter.post("/finalize/booking", protectRoute, finalizePaidBooking);
bookingRouter.delete("/cancel/booking", protectRoute, cancelBooking);

export default bookingRouter;
