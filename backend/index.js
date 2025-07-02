import express from "express";
import "dotenv/config";
import cors from "cors";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoute.js";
import eventsRouter from "./routes/eventRoute.js";
import bookingRouter from "./routes/bookingRoute.js";
import paymentRouter from "./routes/paymentRoute.js";

const app = express();
const PORT = process.env.PORT || 9000;

app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ limit: "15mb", extended: true }));
app.use(cors());

app.use("/api/user", userRouter);
app.use("/api/event", eventsRouter);
app.use("/api/booking", bookingRouter);
app.use("/api/payment", paymentRouter);

//mongodb connection
await connectDB();

app.listen(PORT, () => {
  console.log(`server running on http://localhost:${PORT}`);
});
