import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "./EventsCarousel.css";
import { Navigation } from "swiper/modules";
import { AuthContext } from "../../Contexts/AuthContext.jsx";
import { formatDate } from "../../libs/util.js";

export default function EventsCarousel() {
  const { events, getAllEvents } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      await getAllEvents();
      setLoading(false);
    };
    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
        <p>Loading events...</p>
      </div>
    );
  }

  if (!events || events.length === 0) {
    return <p className="no-events-msg">No upcoming events at present.</p>;
  }

  return (
    <div className="carousel-wrapper">
      <h2 className="carousel-heading">Explore Upcoming Events in Bhilwara</h2>
      <Swiper
        slidesPerView={3}
        spaceBetween={30}
        navigation={true}
        modules={[Navigation]}
        className="event-swiper"
        breakpoints={{
          320: { slidesPerView: 1 },
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {events.map((event) => (
          <SwiperSlide key={event._id}>
            <div className="event-card">
              <Link to={`/event/${event._id}`} className="event-link">
                <img
                  src={event.image}
                  alt={event.title}
                  className="event-image"
                />
                <div className="all-event-info">
                  <h3 className="all-event-title">{event.title}</h3>
                  <p className="all-event-date">{formatDate(event.date)}</p>
                  <p className="all-event-location">{event.venue}</p>
                  <p className="all-event-desc">{event.description}</p>
                </div>
              </Link>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
