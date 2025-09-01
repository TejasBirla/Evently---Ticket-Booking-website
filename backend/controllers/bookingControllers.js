import Booking from "../models/bookingModel.js";
import Event from "../models/eventModel.js";
import transporter from "../lib/nodemailer.js";
import axios from "axios";

export const finalizePaidBooking = async (req, res) => {
  try {
    const { orderId, eventID, seats, amount, time } = req.body;
    const user = req.user;

    if (!time) {
      return res
        .status(400)
        .json({ success: false, message: "Time is required" });
    }

    const existing = await Booking.findOne({ paymentId: orderId });
    if (existing)
      return res.status(200).json({ success: true, booking: existing });

    //  Verify payment with Cashfree
    const response = await axios.get(
      `https://sandbox.cashfree.com/pg/orders/${orderId}`,
      {
        headers: {
          accept: "application/json",
          "x-api-version": "2023-08-01",
          "x-client-id": process.env.CASHFREE_APP_ID,
          "x-client-secret": process.env.CASHFREE_SECRET_KEY,
        },
      }
    );

    if (response.data.order_status !== "PAID") {
      return res.status(400).json({
        success: false,
        message: "Payment not completed. Booking not created.",
      });
    }

    //  Find event
    const event = await Event.findById(eventID);
    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found." });
    }

    //  Ensure bookedSeats is a proper Map
    if (!event.bookedSeats || typeof event.bookedSeats.get !== "function") {
      event.bookedSeats = new Map(Object.entries(event.bookedSeats || {}));
    }

    //  Check time-specific seat conflicts
    const timeSeats = event.bookedSeats.get(time) || [];
    const isConflict = seats.some((seat) => timeSeats.includes(seat));

    if (isConflict) {
      return res.status(400).json({
        success: false,
        message: "One or more seats are already booked.",
      });
    }

    //  Create booking
    const booking = await Booking.create({
      event: eventID,
      user: user._id,
      seats,
      time,
      totalAmount: amount,
      paymentStatus: "PAID",
      paymentId: orderId,
    });

    //  Update bookedSeats
    const updatedSeats = [...timeSeats, ...seats];
    event.bookedSeats.set(time, updatedSeats);
    await event.save();

    //  Send confirmation mail
    await transporter.sendMail({
      from: '"Evently Bhilwara" <yourmail@gmail.com>',
      to: user.email,
      subject: `🎟️ Ticket Confirmation for ${event.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 24px; background-color: #f9f9f9; border-radius: 12px;">
          <h2 style="text-align: center; color: #2c3e50;">🎉 Ticket Confirmation</h2>
          <p style="font-size: 16px;">Hi <strong>${user.fullName}</strong>,</p>
          <p>Thank you for booking with <strong>Evently Bhilwara</strong>!</p>
          <div style="background-color: #fff; border-radius: 10px; padding: 20px; margin: 20px 0;">
            <h3 style="color: #3838ff;">🎟️ ${event.title}</h3>
            <p><strong>Date:</strong> ${event.date.toDateString()}</p>
            <p><strong>Time:</strong> ${time}</p>
            <p><strong>Venue:</strong> ${event.venue}</p>
            <p><strong>Seats:</strong> ${seats.join(", ")}</p>
            <p><strong>Total Paid:</strong> ₹${amount}</p>
          </div>
          <p>You can show this email at the gate or check your Evently dashboard.</p>
        </div>
      `,
    });

    return res.status(200).json({
      success: true,
      message: "Booking confirmed after payment.",
      booking,
    });
  } catch (error) {
    console.log("Error finalizing booking:", error.message);
    return res.status(500).json({
      success: false,
      message: "Could not finalize booking after payment.",
    });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const { eventID, seats, amount, time } = req.body;

    if (!eventID || !seats || !amount || !time) {
      return res
        .status(400)
        .json({ success: false, message: "Information missing" });
    }

    const user = req.user;
    const event = await Event.findById(eventID);

    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found." });
    }

    // Ensure bookedSeats is a proper Map
    if (!event.bookedSeats || typeof event.bookedSeats.get !== "function") {
      event.bookedSeats = new Map(Object.entries(event.bookedSeats || {}));
    }

    // ✅ Get seats for this time and remove the ones being cancelled
    const bookedSeatsAtTime = event.bookedSeats.get(time) || [];
    const updatedSeats = bookedSeatsAtTime.filter(
      (seat) => !seats.includes(seat)
    );

    //  Update the map
    event.bookedSeats.set(time, updatedSeats);
    await event.save();

    //  Remove booking record(s)
    await Booking.deleteMany({
      event: eventID,
      user: user._id,
      time: time,
    });

    //  Send refund mail
    await transporter.sendMail({
      from: '"Evently Bhilwara"',
      to: user.email,
      subject: `🔄 Refund Initiated for ${event.title}`,
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 24px; background-color: #f9f9f9; border-radius: 12px;">
        <h2 style="text-align: center; color: #e67e22;">🔄 Refund Initiated</h2>
        <p style="font-size: 16px; color: #333;">Hi <strong>${
          user.fullName
        }</strong>,</p>
        <p style="font-size: 16px; color: #333;">We're writing to confirm that your booking for the event <strong>${
          event.title
        }</strong> at <strong>${time}</strong> has been successfully cancelled.</p>
        <div style="background-color: #ffffff; border-radius: 10px; padding: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); margin: 20px 0;">
          <p><strong>Event:</strong> ${event.title}</p>
          <p><strong>Seats Cancelled:</strong> ${seats.join(", ")}</p>
          <p><strong>Total Paid:</strong> ₹${amount}</p>
          <p><strong>Refund Amount (50%):</strong> ₹${(amount * 0.5).toFixed(
            2
          )}</p>
        </div>
        <p style="font-size: 15px; color: #555;">As per our cancellation policy, 50% of the amount has been refunded to your original payment method. Please allow 5–7 business days for the refund to reflect in your account.</p>
        <p style="font-size: 14px; color: #999;">If you have any questions, feel free to contact us at <a href="mailto:support@evently.com">support@evently.com</a>.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
        <p style="font-size: 13px; color: #aaa; text-align: center;">&copy; ${new Date().getFullYear()} Evently Bhilwara. All rights reserved.</p>
      </div>
      `,
    });

    return res.status(200).json({
      success: true,
      message: "Booking cancelled and seats released.",
    });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    return res.status(500).json({
      success: false,
      message: "Could not cancel the booking.",
    });
  }
};
