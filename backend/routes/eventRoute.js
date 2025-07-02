import express from "express";
import {
  createEvent,
  deleteEvent,
  getAllEvents,
  getSingleEvent,
  updateEvent,
} from "../controllers/eventControllers.js";
import { protectRoute } from "../middlewares/auth.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const eventsRouter = express.Router();

//Public routes
eventsRouter.get("/allevents", getAllEvents);
eventsRouter.get("/:id", getSingleEvent);

//Admin routes
eventsRouter.post("/create", protectRoute, isAdmin, createEvent);
eventsRouter.delete("/:id", protectRoute, isAdmin, deleteEvent);
eventsRouter.put("/:id", protectRoute, isAdmin, updateEvent);

export default eventsRouter;
