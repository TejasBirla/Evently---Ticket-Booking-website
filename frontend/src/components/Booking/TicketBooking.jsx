import React, { useContext, useEffect, useState } from "react";
import "./TicketBooking.css";
import { formatDate, formatTime } from "../../libs/util.js";
import { AuthContext } from "../../Contexts/AuthContext";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

export default function TicketBooking() {
  const { initiateBooking, getSingleEvent, singleEvent } =
    useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loader, setLoader] = useState(false);
  const token = localStorage.getItem("token");

  // Fetch event on mount or id change
  useEffect(() => {
    getSingleEvent(id);
  }, [id]);

  console.log(singleEvent);

  // Restore seats/time after login
  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("redirectAfterLogin"));

    if (
      savedData &&
      savedData.path === location.pathname &&
      singleEvent &&
      singleEvent.bookedSeats
    ) {
      const bookedForSavedTime =
        singleEvent.bookedSeats[savedData.selectedShowtime] || [];

      const validSeats = savedData.selectedSeats?.filter(
        (seat) => !bookedForSavedTime.includes(seat)
      );

      if (validSeats.length !== savedData.selectedSeats.length) {
        toast.error(
          "Some of your previously selected seats are already booked."
        );
      }

      setSelectedSeats(validSeats || []);
      if (savedData.selectedShowtime)
        setSelectedShowtime(savedData.selectedShowtime);

      setTimeout(() => {
        localStorage.removeItem("redirectAfterLogin");
      }, 100);
    }
  }, [location.pathname, singleEvent]);

  // Limit seat selection to 5
  const toggleSeat = (seat) => {
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat));
    } else if (selectedSeats.length >= 5) {
      toast.error("You can only select up to 5 seats.");
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const handleBooking = () => {
    if (!selectedShowtime || selectedSeats.length === 0) {
      toast.error("Please select showtime and seats.");
      return;
    }

    // Check for already booked seats
    const bookedSeatsForTime =
      singleEvent?.bookedSeats?.[selectedShowtime] || [];
    const unavailableSeats = selectedSeats.filter((seat) =>
      bookedSeatsForTime.includes(seat)
    );

    if (unavailableSeats.length > 0) {
      toast.error(
        `Seats ${unavailableSeats.join(
          ", "
        )} were just booked. Please reselect.`
      );
      setSelectedSeats((prev) =>
        prev.filter((seat) => !unavailableSeats.includes(seat))
      );
      return;
    }

    setLoader(true);
    const bookingData = {
      eventID: singleEvent._id,
      seats: selectedSeats,
      time: selectedShowtime,
    };
    initiateBooking(bookingData);
  };

  // Handle login redirect if not logged in
  const bookTicket = () => {
    if (token) {
      handleBooking();
    } else {
      localStorage.setItem(
        "redirectAfterLogin",
        JSON.stringify({
          path: location.pathname,
          selectedSeats,
          selectedShowtime,
        })
      );
      toast("Please login to continue.", { icon: "🔒", duration: 1500 });
      setTimeout(() => navigate("/login"), 1000);
    }
  };

  return (
    <div className="ticket-container">
      <div className="ticket-header">
        <h1>{singleEvent?.title}</h1>
        <p className="ticket-meta">
          📍 {singleEvent?.venue} | {formatDate(singleEvent?.date)} |⏰{" "}
          {singleEvent?.time?.map((t, i) => (
            <span key={i}>
              {formatTime(t)}
              {i < singleEvent.time.length - 1 ? ", " : ""}
            </span>
          ))}
        </p>
      </div>
      <div className="ticket-main">
        <div className="ticket-left">
          <div className="ticket-banner">
            <img src={singleEvent?.image} alt={singleEvent?.title} />
          </div>
          <p className="ticket-desc">{singleEvent?.description}</p>
        </div>
        <div className="ticket-right">
          <div className="ticket-section">
            <h3>Choose Showtime</h3>
            <div className="showtime-options">
              {singleEvent?.time?.map((time, idx) => (
                <button
                  key={idx}
                  className={`showtime-btn ${
                    selectedShowtime === time ? "active" : ""
                  }`}
                  onClick={() => {
                    setSelectedShowtime(time);
                    setSelectedSeats([]);
                  }}
                >
                  {formatTime(time)}
                </button>
              ))}
            </div>
          </div>
          <div className="ticket-section">
            <h3>Select Seats</h3>
            <div className="seats-grid">
              {Array.from({ length: 30 }, (_, i) => {
                const seat = `A${i + 1}`;
                const bookedSeatsForTime =
                  singleEvent?.bookedSeats?.[selectedShowtime] || [];
                const isBooked = bookedSeatsForTime.includes(seat);
                return (
                  <div
                    key={seat}
                    className={`seat ${
                      selectedSeats.includes(seat) ? "selected" : ""
                    } ${isBooked ? "booked" : ""}`}
                    onClick={() => !isBooked && toggleSeat(seat)}
                  >
                    {seat}
                  </div>
                );
              })}
            </div>
            <div className="seat-legend">
              <span className="legend available">⬜ Available</span>
              <span className="legend selected">🟦 Selected</span>
              <span className="legend booked">🟥 Booked</span>
            </div>
          </div>
          <div className="ticket-summary">
            <button className="book-btn" onClick={bookTicket} disabled={loader}>
              {loader ? "Redirecting..." : "Proceed to Payment"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
