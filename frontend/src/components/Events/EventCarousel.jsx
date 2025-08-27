import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "./EventsCarousel.css";
import { Navigation } from "swiper/modules";
import { AuthContext } from "../../Contexts/AuthContext.jsx";
import { formatDate } from "../../libs/util.js";

export default function EventsCarousel() {
  const { events, loadingEvents } = useContext(AuthContext);

  if (loadingEvents) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
        <p>Loading</p>
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
          320: { slidesPerView: 1, spaceBetween: 15 },
          480: { slidesPerView: 1, spaceBetween: 15 },
          640: { slidesPerView: 2, spaceBetween: 20 },
          768: { slidesPerView: 2, spaceBetween: 25 },
          1024: { slidesPerView: 3, spaceBetween: 30 },
          1280: { slidesPerView: 3, spaceBetween: 30 },
        }}
      >
        {events.map((event) => (
          <SwiperSlide key={event._id}>
            <div className="event-carousel-card">
              <Link to={`/event/${event._id}`} className="event-link">
                <img
                  src={event.image}
                  alt={event.title}
                  className="event-carousel-image"
                />
                <div className="carousel-event-info">
                  <h3 className="carousel-event-title">{event.title}</h3>
                  <p className="carousel-event-date">
                    {formatDate(event.date)}
                  </p>
                  <p className="carousel-event-location">{event.venue}</p>
                  <p className="carousel-event-desc">{event.description}</p>
                </div>
              </Link>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
