import express from "express";
import { protectRoute } from "../middlewares/auth.js";
import { initiateBookingPayment } from "../controllers/paymentControllers.js";

const paymentRouter = express.Router();

paymentRouter.post("/cashfree/initiate", protectRoute, initiateBookingPayment);

export default paymentRouter;
