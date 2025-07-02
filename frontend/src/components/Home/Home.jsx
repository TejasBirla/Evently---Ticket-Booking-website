import React, { useContext, useEffect } from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Contexts/AuthContext.jsx";
import { formatDate } from "../../libs/util.js";
import { toast } from "react-hot-toast";
import { LockIcon } from "lucide-react";

export default function Home() {
  const { authUser, getAllEvents, events } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    getAllEvents();
  }, []);

  const handleBookNow = (event) => {
    if (!authUser) {
      toast("Please login first to book tickets.", {
        icon: <LockIcon />,
        duration: 2000,
        style: {
          background: "#e0f7fa",
          color: "#00796b",
        },
      });

      setTimeout(() => {
        navigate("/login");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 3000);
    } else {
      navigate(`/event/${event._id}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Filter and sort upcoming events
  const upcomingEvents = events
    .filter((event) => {
      const eventDate = new Date(event.date);
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      return eventDate >= currentDate;
    })
    .sort((a, b) => {
      // Sort by date in ascending order
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA - dateB;
    });

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <h1>Welcome to Evently</h1>
        <p>Discover and book tickets for the best events in Bhilwara.</p>
        <button className="hero-btn" onClick={() => navigate("/events")}>
          Explore Events
        </button>
      </section>

      {/* Events Preview */}
      <section className="events-preview">
        <h2>Upcoming Events in your Hometown</h2>
        <div className="event-cards">
          {upcomingEvents.length > 0 ? (
            upcomingEvents.slice(0, 3).map((event) => (
              // Display up to 3 upcoming events
              <div className="event-card">
                <img
                  src={event.image}
                  alt={event.title}
                  className="event-image"
                />
                <div className="all-event-info">
                  <h3 className="all-event-title">{event.title}</h3>
                  <p className="all-event-date">{formatDate(event.date)}</p>
                  <p className="all-event-desc">{event.description}</p>
                  <button onClick={() => handleBookNow(event)}>Book Now</button>
                </div>
              </div>
            ))
          ) : (
            <p>No upcoming events at the moment. Check back soon!</p>
          )}
        </div>
      </section>

      {/* About */}
      <section className="about">
        <h2>Why Choose Evently?</h2>
        <p>
          We bring you the most exciting events with a smooth booking
          experience. From concerts to conferences, we’ve got you covered!
        </p>
      </section>
    </div>
  );
}
