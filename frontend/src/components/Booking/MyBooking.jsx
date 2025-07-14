import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Contexts/AuthContext.jsx";
import { formatTime, formatDate } from "../../libs/util.js";
import ConfirmDialog from "../ConfirmDialog/ConfirmDialog.jsx";
import "./MyBooking.css";

export default function MyBooking() {
  const { allBookings, allBookingDetails, cancelBooking } =
    useContext(AuthContext);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    allBookings();
  });

  const openConfirm = (booking) => {
    setSelectedBooking(booking);
    setShowConfirm(true);
  };

  const handleCancelConfirmed = () => {
    const { eventID, seats, amount, time } = selectedBooking;
    const bookingData = { eventID, seats, amount, time };
    cancelBooking(bookingData);
    setShowConfirm(false);
  };

  const handleCancel = () => setShowConfirm(false);

  if (!allBookingDetails || allBookingDetails.length === 0) {
    return (
      <p className="no-booking-msg">
        You have no bookings yet. Checkout for events and book your tickets now.
      </p>
    );
  }

  const groupedBookings = allBookingDetails.reduce((acc, booking) => {
    const eventId = booking.event?._id;

    if (!acc[eventId]) {
      acc[eventId] = {
        ...booking,
        seats: [...booking.seats],
        totalAmount: booking.totalAmount,
      };
    } else {
      acc[eventId].seats = [...acc[eventId].seats, ...booking.seats];
      acc[eventId].totalAmount += booking.totalAmount;
    }

    return acc;
  }, {});

  const mergedBookings = Object.values(groupedBookings);

  return (
    <div className="my-bookings-container">
      <h2 className="bookings-title">My Bookings</h2>
      {mergedBookings.map((booking) => (
        <div key={booking?._id} className="booking-card">
          <img
            src={booking?.event?.image}
            alt={booking?.event?.title}
            className="booking-image"
          />
          <div className="booking-info">
            <h3 className="event-title">{booking?.event?.title}</h3>
            <p>
              <strong>Date:</strong> {formatDate(booking?.event?.date)}
            </p>
            <p>
              <strong>Time:</strong> {formatTime(booking?.time)}
            </p>
            <p>
              <strong>Venue:</strong> {booking?.event?.venue}
            </p>
            <p>
              <strong>Seats:</strong> {[...new Set(booking?.seats)].join(", ")}
            </p>
            <p>
              <strong>Total Paid:</strong> ₹{booking?.totalAmount}
            </p>
            <button
              className="cancel-button"
              onClick={() =>
                openConfirm({
                  eventID: booking.event._id,
                  seats: booking.seats,
                  time: booking.time,
                  amount: booking.totalAmount,
                })
              }
            >
              Cancel Booking
            </button>
          </div>
        </div>
      ))}

      {/* ✅ Render Confirmation Dialog */}
      {showConfirm && (
        <ConfirmDialog
          title="Cancel Booking?"
          message="Are you sure you want to cancel this booking? You will receive only 50% refund."
          onConfirm={handleCancelConfirmed}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}
