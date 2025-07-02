import React, { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../Contexts/AuthContext.jsx";
import "./SingleEvent.css";
import { formatTime, formatDate } from "../../libs/util.js";

import { CalendarDays, Clock, MapPin } from "lucide-react";

export default function SingleEvent() {
  const { id } = useParams();
  const { singleEvent, getSingleEvent } = useContext(AuthContext);

  const navigate = useNavigate();

  useEffect(() => {
    getSingleEvent(id);
  }, [id]);

  if (!singleEvent) {
    return <div className="loading-event">Loading event...</div>;
  }

  return (
    <div className="single-event-container">
      <div className="single-event-banner">
        <img src={singleEvent.image} alt={singleEvent.title} />
      </div>
      <div className="single-event-details">
        <h1>{singleEvent.title}</h1>
        <p className="event-date">
          <CalendarDays size={18} className="icon" />{" "}
          {formatDate(singleEvent.date)}
        </p>
        <p className="event-time">
          <Clock size={18} className="icon" /> {formatTime(singleEvent.time)}
        </p>
        <p className="event-location">
          <MapPin size={18} className="icon" /> {singleEvent.venue}
        </p>
        <p className="event-desc">{singleEvent.description}</p>
        <button
          className="book-now-btn"
          onClick={() => navigate(`/book/event/${singleEvent._id}/ticket`)}
        >
          Book Now
        </button>
      </div>
    </div>
  );
}
