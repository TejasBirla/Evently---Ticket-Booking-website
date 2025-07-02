import Booking from "../models/bookingModel.js";
import Event from "../models/eventModel.js";
import transporter from "../lib/nodemailer.js";
import axios from "axios";

export const finalizePaidBooking = async (req, res) => {
  try {
    const { orderId, eventID, seats, amount } = req.body;
    const user = req.user;

    //Verify payment with Cashfree
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

    //Get event
    const event = await Event.findById(eventID);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    // Check seat availability again
    const isConflict = seats.some((seat) => event.bookedSeats.includes(seat));
    if (isConflict) {
      return res.status(400).json({
        success: false,
        message: "One or more seats are already booked.",
      });
    }

    //Create booking in DB
    const booking = await Booking.create({
      event: eventID,
      user: user._id,
      seats,
      totalAmount: amount,
      paymentStatus: "PAID",
      paymentId: orderId,
    });

    event.bookedSeats.push(...seats);
    await event.save();

    //Send confirmation email
    await transporter.sendMail({
      from: '"Evently Bhilwara" <yourmail@gmail.com>',
      to: user.email,
      subject: `🎟️ Ticket Confirmation for ${event.title}`,
      html: `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 24px; background-color: #f9f9f9; border-radius: 12px;">
    <h2 style="text-align: center; color: #2c3e50;">🎉 Ticket Confirmation</h2>

    <p style="font-size: 16px; color: #333;">Hi <strong>${
      user.fullName
    }</strong>,</p>
    <p style="font-size: 16px; color: #333;">Thank you for booking with <strong>Evently Bhilwara</strong>!</p>

    <div style="background-color: #ffffff; border-radius: 10px; padding: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); margin: 20px 0;">
      <h3 style="color: #3838ff; margin-top: 0;">🎟️ ${event.title}</h3>
      <p><strong>Date:</strong> ${event.date.toDateString()}</p>
      <p><strong>Venue:</strong> ${event.venue}</p>
      <p><strong>Seats:</strong> ${seats.join(", ")}</p>
      <p><strong>Total Paid:</strong> ₹${amount}</p>
    </div>

    <p style="font-size: 15px; color: #555;">This email confirms that your payment was successful and your seats have been reserved. You can show this email at the entry gate or access your ticket from your Evently dashboard.</p>

    <p style="font-size: 14px; color: #999;">If you have any questions, feel free to contact us at <a href="mailto:support@evently.com">support@evently.com</a>.</p>

    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />

    <p style="font-size: 13px; color: #aaa; text-align: center;">&copy; ${new Date().getFullYear()} Evently Bhilwara. All rights reserved.</p>
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
    const { eventID, seats, amount } = req.body;
    if (!eventID || !seats || !amount) {
      return res.json({ success: false, message: "Information missing" });
    }
    const user = req.user;
    const event = await Event.findById(eventID);
    if (!event) {
      return res.json({ success: false, message: "Event not found." });
    }

    event.bookedSeats = event.bookedSeats.filter(
      (seat) => !seats.includes(seat)
    );
    await event.save();

    await Booking.deleteMany({
      event: eventID,
      user: user._id,
    });
    

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
        }</strong> has been successfully cancelled.</p>
    
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
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Could not cancel the booking.",
    });
  }
};
