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
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA - dateB;
    });

  return (
    <div className="home">
      <section className="home-hero">
        <h1>Welcome to Evently</h1>
        <p>Discover and book tickets for the best events in Bhilwara.</p>
        <button className="home-hero-btn" onClick={() => navigate("/events")}>
          Explore Events
        </button>
      </section>
      <section className="home-events-preview">
        <h2>Upcoming Events in your Hometown</h2>
        <div className="home-event-cards">
          {upcomingEvents.length > 0 ? (
            upcomingEvents.slice(0, 3).map((event) => (
              <div className="home-event-card" key={event._id}>
                <img
                  src={event.image}
                  alt={event.title}
                  className="home-event-image"
                />
                <div className="home-event-info">
                  <h3 className="home-event-title">{event.title}</h3>
                  <p className="home-event-date">{formatDate(event.date)}</p>
                  <p className="home-event-desc">{event.description}</p>
                  <button onClick={() => handleBookNow(event)}>Book Now</button>
                </div>
              </div>
            ))
          ) : (
            <p>No upcoming events at the moment. Check back soon!</p>
          )}
        </div>
      </section>

      
      <section className="home-about">
        <h2>Why Choose Evently?</h2>
        <p>
          We bring you the most exciting events with a smooth booking
          experience. From concerts to conferences, we’ve got you covered!
        </p>
      </section>
    </div>
  );
}
