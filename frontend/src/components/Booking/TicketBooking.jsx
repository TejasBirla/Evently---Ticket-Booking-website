import React, { useContext, useState, useEffect } from "react";
import "./TicketBooking.css";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../Contexts/AuthContext.jsx";

export default function TicketBooking() {
  const { singleEvent, getSingleEvent, initiateBooking } =
    useContext(AuthContext);
  const token = localStorage.getItem("token");
  const { id } = useParams();

  useEffect(() => {
    getSingleEvent(id);
  }, [id]);

  const rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
  const seatsPerRow = 6;
  const leftRows = rows.slice(0, 5);
  const rightRows = rows.slice(5);

  const [error, setError] = useState("");
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loader, setLoader] = useState(false);

  const isSeatBooked = (seatId) => {
    return singleEvent?.bookedSeats?.includes(seatId);
  };

  const toggleSeat = (seatId) => {
    if (isSeatBooked(seatId)) return;

    setSelectedSeats((prev) => {
      if (prev.includes(seatId)) {
        return prev.filter((seat) => seat !== seatId);
      } else if (prev.length >= 5) {
        setError("You can only select up to 5 seats.");
        return prev;
      } else {
        return [...prev, seatId];
      }
    });
  };

  const handleBooking = () => {
    if (!singleEvent || selectedSeats.length === 0) return;
    setLoader(true);

    const bookingData = {
      eventID: singleEvent._id,
      seats: selectedSeats,
    };

    initiateBooking(bookingData); //payment method
  };

  useEffect(() => {
    const timer = setTimeout(() => setError(""), 3000);
    return () => clearTimeout(timer);
  }, [error]);

  return (
    <div className="booking-container">
      <div className="stage">STAGE</div>
      <div className="stage-label">Stage this side</div>

      <div className="seats-layout">
        {/* LEFT SIDE */}
        <div className="seat-side">
          {leftRows.map((row) => (
            <div className="seat-row" key={row}>
              {Array.from({ length: seatsPerRow }, (_, i) => {
                const seatId = `${row}${i + 1}`;
                return (
                  <div
                    className={`seat
                      ${isSeatBooked(seatId) ? "booked" : ""}
                      ${selectedSeats.includes(seatId) ? "selected" : ""}
                    `}
                    key={i}
                    onClick={() => toggleSeat(seatId)}
                  >
                    {seatId}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div className="aisle" />

        {/* RIGHT SIDE */}
        <div className="seat-side">
          {rightRows.map((row) => (
            <div className="seat-row" key={row}>
              {Array.from({ length: seatsPerRow }, (_, i) => {
                const seatId = `${row}${i + 1}`;
                return (
                  <div
                    className={`seat
                      ${isSeatBooked(seatId) ? "booked" : ""}
                      ${selectedSeats.includes(seatId) ? "selected" : ""}
                    `}
                    key={i}
                    onClick={() => toggleSeat(seatId)}
                  >
                    {seatId}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="booking-actions">
        <p>
          Selected Seats:{" "}
          <span>
            {selectedSeats.length > 0 ? selectedSeats.join(", ") : "None"}
          </span>
        </p>
        <button
          className="book-button"
          onClick={
            token
              ? handleBooking
              : () => setError("Please login to book tickets.")
          }
          disabled={selectedSeats.length === 0 || loader}
        >
          {loader ? "Redirecting..." : "Book Now"}
        </button>
        {error && <p className="error">{error}</p>}
      </div>

      <div className="legend">
        <div className="legend-item">
          <div className="legend-box available"></div>
          <span>Available</span>
        </div>
        <div className="legend-item">
          <div className="legend-box selected"></div>
          <span>Selected</span>
        </div>
        <div className="legend-item">
          <div className="legend-box booked"></div>
          <span>Booked</span>
        </div>
      </div>
    </div>
  );
}
