import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../Contexts/AuthContext.jsx";
import { formatTime, formatDate } from "../../libs/util.js";
import ConfirmDialog from "../ConfirmDialog/ConfirmDialog.jsx";
import "./MyBooking.css";

export default function MyBooking() {
  const { allBookings, allBookingDetails, cancelBooking, loadingBooking } =
    useContext(AuthContext);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    const fetchAllBokings = async () => {
      await allBookings();
    };
    fetchAllBokings();
  }, []);

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
      {loadingBooking ? (
        <div className="spinner-container">
          <div className="spinner"></div>
          <p>Loading</p>
        </div>
      ) : allBookingDetails.length === 0 ? (
        <p className="no-booking-msg">
          You have no bookings yet. Checkout for events and book your tickets
          now.
        </p>
      ) : (
        mergedBookings.map((booking) => (
          <div key={booking?._id} className="booking-card">
            <Link to={`/event/${booking?.event?._id}`}>
              <img
                src={booking?.event?.image}
                alt={booking?.event?.title}
                className="booking-image"
              />
            </Link>

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
                <strong>Seats:</strong>{" "}
                {[...new Set(booking?.seats)].join(", ")}
              </p>
              <p>
                <strong>Total Paid:</strong> ₹{booking?.totalAmount}
              </p>
              <button
                className="cancel-button"
                onClick={() =>
                  openConfirm({
                    bookingId: booking._id,
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
        ))
      )}

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
