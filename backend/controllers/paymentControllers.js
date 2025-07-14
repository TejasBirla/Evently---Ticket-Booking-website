import Event from "../models/eventModel.js";
import axios from "axios";

export const initiateBookingPayment = async (req, res) => {
  try {
    const { eventID, seats, time } = req.body;
    const user = req.user;

    // Fetch event from DB
    const event = await Event.findById(eventID);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    if (!time) {
      return res.status(400).json({
        success: false,
        message: "Showtime is required for booking.",
      });
    }

    // Check if selected seats are already booked for the selected time
    const bookedSeatsAtTime = event.bookedSeats?.[time] || [];
    const isConflict = seats.some((seat) => bookedSeatsAtTime.includes(seat));
    if (isConflict) {
      return res.status(400).json({
        success: false,
        message: "One or more selected seats are already booked at this time.",
      });
    }

    // Calculate total price
    const totalAmount = seats.length * event.price;

    // Generate unique order ID
    const order_id = new Date().getTime().toString();

    // Create order on Cashfree
    const cashfreeResponse = await axios.post(
      "https://sandbox.cashfree.com/pg/orders",
      {
        order_id,
        order_amount: totalAmount,
        order_currency: "INR",
        customer_details: {
          customer_id: user._id.toString(),
          customer_email: user.email,
          customer_phone: user.phone || "9999999999",
        },
        order_meta: {
          return_url: `${process.env.FRONTEND_URL}/payment-success?order_id=${order_id}`,
        },
        order_note: `Booking for ${event.title}`,
      },
      {
        headers: {
          accept: "application/json",
          "x-api-version": "2023-08-01",
          "x-client-id": process.env.CASHFREE_APP_ID,
          "x-client-secret": process.env.CASHFREE_SECRET_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    // Extract session ID from Cashfree response
    const { payment_session_id } = cashfreeResponse.data;

    // Return response to frontend
    return res.status(200).json({
      success: true,
      paymentSessionId: payment_session_id,
      orderId: order_id,
      eventID,
      seats,
      amount: totalAmount,
      time,
    });
  } catch (error) {
    console.error("Error initiating booking:", error.message);
    return res.status(500).json({
      success: false,
      message: "Could not initiate payment.",
    });
  }
};
