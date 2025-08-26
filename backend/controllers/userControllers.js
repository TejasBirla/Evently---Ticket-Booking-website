import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import Booking from "../models/bookingModel.js";
import transporter from "../lib/nodemailer.js";

//User and admin register
export const registerUser = async (req, res) => {
  const { email, fullName, password, adminCode } = req.body;

  if (!email || !fullName || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required." });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email address.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long.",
      });
    }

    if (adminCode && adminCode !== process.env.ADMIN_SECRET) {
      return res.status(400).json({
        success: false,
        message: "Incorrect Admin Code.",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const isAdmin = adminCode === process.env.ADMIN_SECRET;
    const role = isAdmin ? "admin" : "user"; //This allows normal users too

    const user = await User.create({
      email,
      fullName,
      password: hashedPassword,
      role,
    });

    //JWT token
    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: "Registration successful.",
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Error in registerUser:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

//user and admin login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required." });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Email address not found." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid password." });
    }

    //JWT token
    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Error in loginUser:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

//Subscribe to newsletter
export const newsLetterSubscribe = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email.trim()) {
      return res
        .status(404)
        .json({ success: false, message: "Email address is required" });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Invaild email address" });
    }
    transporter.sendMail({
      from: "Evently Bhilwara <no-reply@evently.com>",
      to: email,
      subject: "Newsletter Subscription for Evently",
      html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
      <h2 style="color: #2c3e50; text-align: center;">Welcome to Evently 🎉</h2>
      <p>Dear Subscriber,</p>
      <p>Thank you for subscribing to <strong>Evently Bhilwara</strong>. We’re delighted to have you with us!</p>
      <p>You’ll now receive the latest updates, event announcements, and exclusive news straight to your inbox.</p>
      <p>If you ever wish to unsubscribe, you can do so anytime by clicking the unsubscribe link in our emails.</p>
      <p style="margin-top: 20px;">Warm regards,<br><strong>Team Evently</strong></p>
    </div>
  `,
    });

    return res.status(200).json({
      success: true,
      message: `Subscription successful!`,
    });
  } catch (error) {
    console.error("Error in newsLetterSubscribe:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

//Fetching all bookings made my loggedIn user
export const getAllBookings = async (req, res) => {
  try {
    const userId = req.user._id; //middleware authentication

    const allBookings = await Booking.find({ user: userId })
      .populate("event", "title date time venue image price")
      .sort({ createdAt: -1 });

    if (!allBookings || allBookings.length === 0) {
      return res.json({ success: false, message: "No bookings yet." });
    }
    return res.status(200).json({
      success: true,
      message: "Booking for all events fetched.",
      allBookings,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch bookings.",
    });
  }
};
