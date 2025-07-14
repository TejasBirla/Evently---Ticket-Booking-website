import React, { useContext, useState, useEffect } from "react";
import "./TicketBooking.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../Contexts/AuthContext.jsx";
import { formatTime } from "../../libs/util.js";
import toast from "react-hot-toast";

export default function TicketBooking() {
  const { singleEvent, getSingleEvent, initiateBooking } =
    useContext(AuthContext);
  const token = localStorage.getItem("token");
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    getSingleEvent(id);
  }, [id]);

  const rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
  const seatsPerRow = 6;
  const leftRows = rows.slice(0, 5);
  const rightRows = rows.slice(5);

  const isSeatBooked = (seatId) => {
    return singleEvent?.bookedSeats?.includes(seatId);
  };

  const toggleSeat = (seatId) => {
    if (isSeatBooked(seatId)) return;

    setSelectedSeats((prev) => {
      if (prev.includes(seatId)) {
        return prev.filter((seat) => seat !== seatId);
      } else if (prev.length >= 5) {
        toast.error("You can only select up to 5 seats.");
        return prev;
      } else {
        return [...prev, seatId];
      }
    });
  };

  const handleBooking = () => {
    if (!singleEvent || selectedSeats.length === 0) return;

    if (!selectedTime) {
      toast.error("Please select a showtime.");
      return;
    }

    const unavailableSeats = selectedSeats.filter((seat) =>
      singleEvent.bookedSeats.includes(seat)
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
      time: selectedTime,
    };
    initiateBooking(bookingData);
  };

  const bookTicket = () => {
    if (token) {
      handleBooking();
      return;
    } else {
      localStorage.setItem(
        "redirectAfterLogin",
        JSON.stringify({
          path: location.pathname,
          selectedSeats,
          selectedTime,
        })
      );
      toast("Please login to continue.", {
        icon: "🔒",
        duration: 1500,
      });
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    }
  };

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("redirectAfterLogin"));

    if (
      savedData &&
      savedData.path === location.pathname &&
      singleEvent &&
      singleEvent.bookedSeats
    ) {
      const validSeats = savedData.selectedSeats?.filter(
        (seat) => !singleEvent.bookedSeats.includes(seat)
      );

      if (validSeats.length !== savedData.selectedSeats.length) {
        toast.error(
          "Some of your previously selected seats are already booked."
        );
      }

      setSelectedSeats(validSeats || []);
      if (savedData.selectedTime) setSelectedTime(savedData.selectedTime);

      // Now safe to remove
      setTimeout(() => {
        localStorage.removeItem("redirectAfterLogin");
      }, 100);
    }
  }, [location.pathname, singleEvent]);

  return (
    <div className="booking-container">
      <div className="booking-layout">
        {/* TIME SELECTION - LEFT */}
        <div className="time-selection">
          <h3>Select Showtime:</h3>
          <div className="time-list">
            {singleEvent?.time?.map((t, i) => (
              <div
                key={i}
                className={`time-item ${
                  selectedTime === t ? "selected-time" : ""
                }`}
                onClick={() => setSelectedTime(t)}
              >
                {formatTime(t)}
              </div>
            ))}
          </div>
        </div>

        {/* SEATS SECTION - RIGHT */}
        <div className="seats-section">
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
                        key={i}
                        className={`seat ${
                          isSeatBooked(seatId) ? "booked" : ""
                        } ${selectedSeats.includes(seatId) ? "selected" : ""}`}
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
                        key={i}
                        className={`seat ${
                          isSeatBooked(seatId) ? "booked" : ""
                        } ${selectedSeats.includes(seatId) ? "selected" : ""}`}
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
              onClick={bookTicket}
              disabled={selectedSeats.length === 0 || loader || !selectedTime}
            >
              {loader ? "Redirecting..." : "Book Now"}
            </button>
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
      </div>
    </div>
  );
}
