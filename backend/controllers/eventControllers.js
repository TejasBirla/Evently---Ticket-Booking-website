import Event from "../models/eventModel.js";
import Booking from "../models/bookingModel.js";
import cloudinary from "../lib/cloudinary.js";

export const getAllEvents = async (req, res) => {
  try {
    const allEvents = await Event.find({}).sort({ date: 1 });
    if (!allEvents || allEvents.length === 0) {
      return res.json({ success: false, message: "No events rights now." });
    }
    return res.status(200).json({
      success: true,
      message: "Events fetched successfully.",
      allEvents,
    });
  } catch (error) {
    console.log("Error in fetching all events: ", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch events.",
    });
  }
};

export const getSingleEvent = async (req, res) => {
  try {
    const eventID = req.params.id;
    const event = await Event.findById(eventID);
    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found." });
    }
    return res
      .status(200)
      .json({ success: true, message: "Event found.", event });
  } catch (error) {
    console.log("Error fetching single event: ", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch event.",
    });
  }
};

//Admin controllers
export const createEvent = async (req, res) => {
  try {
    const { title, description, date, time, venue, price, totalSeats, image } =
      req.body;

    if (!title || !description || !date || !venue || !price || !totalSeats) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    if (
      !Array.isArray(time) ||
      time.length === 0 ||
      time.some((t) => t.trim() === "")
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide at least one valid showtime.",
      });
    }

    // Upload image to Cloudinary
    let uploadedImageUrl = "";
    let uploadedImageID = "";

    if (image) {
      const uploadResult = await cloudinary.uploader.upload(image, {
        folder: "evently",
      });
      uploadedImageUrl = uploadResult.secure_url;
      uploadedImageID = uploadResult.public_id;
    }

    const newEvent = await Event.create({
      title,
      description,
      date,
      time,
      venue,
      price,
      totalSeats,
      image: uploadedImageUrl,
      imagePublicId: uploadedImageID,
      createdBy: req.user._id, // optional to track admin
    });

    return res.status(200).json({
      success: true,
      message: "Event created successfully.",
      newEvent,
    });
  } catch (error) {
    console.log("Error in creating events: ", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to create event.",
    });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const eventID = req.params.id;
    const event = await Event.findByIdAndDelete(eventID);

    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }

    //Delete image from cloudinary
    if (event.imagePublicId) {
      await cloudinary.uploader.destroy(event.imagePublicId);
    }

    await Booking.deleteMany({ event });

    return res.status(200).json({
      success: true,
      message: "Event and all its bookings deleted successfully.",
    });
  } catch (error) {
    console.log("Error in deleting event: ", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Failed to delete event." });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const eventID = req.params.id;
    const updates = req.body;

    const updatedEvent = await Event.findByIdAndUpdate(eventID, updates, {
      new: true, // return the updated document
      runValidators: true, // validate against schema
    });

    if (!updatedEvent) {
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Event updated successfully.",
      event: updatedEvent,
    });
  } catch (error) {
    console.log("Error in updating event: ", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Failed to update event." });
  }
};
