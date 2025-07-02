import React, { useContext, useEffect, useState } from "react";
import { EventContext } from "../../../Contexts/EventContext.jsx";
import "./UpdateEvent.css";

export default function UpdateEvent() {
  const { events, getAllEvents, getSingleEvent, singleEvent, updateEvent } =
    useContext(EventContext);

  const [selectedEventId, setSelectedEventId] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    venue: "",
    price: "",
    totalSeats: "",
    image: "",
  });

  useEffect(() => {
    getAllEvents();
  }, []);

  // When event is selected, fetch its details and populate form
  const handleEventSelect = async (e) => {
    const eventId = e.target.value;
    setSelectedEventId(eventId);
    getSingleEvent(eventId);
  };

  // When singleEvent updates, sync form data
  useEffect(() => {
    if (singleEvent) {
      setFormData({
        title: singleEvent.title || "",
        description: singleEvent.description || "",
        date: singleEvent.date?.slice(0, 10) || "",
        time: singleEvent.time || "",
        venue: singleEvent.venue || "",
        price: singleEvent.price || "",
        totalSeats: singleEvent.totalSeats || "",
        image: singleEvent.image,
      });
    }
  }, [singleEvent]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(files[0]);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedEventId) return;
    updateEvent(selectedEventId, formData);
  };

  return (
    <div className="update-event-container">
      <h2>Update Event</h2>

      <select value={selectedEventId} onChange={handleEventSelect}>
        <option value="">Select an Event</option>
        {events.map((event) => (
          <option key={event._id} value={event._id}>
            {event.title}
          </option>
        ))}
      </select>

      {selectedEventId && (
        <form className="event-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            value={formData.title}
            placeholder="Title"
            onChange={handleChange}
          />
          <textarea
            name="description"
            value={formData.description}
            placeholder="Description"
            onChange={handleChange}
          />
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
          />
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
          />
          <input
            type="text"
            name="venue"
            value={formData.venue}
            placeholder="Venue"
            onChange={handleChange}
          />
          <input
            type="number"
            name="price"
            value={formData.price}
            placeholder="Price"
            onChange={handleChange}
          />
          <input
            type="number"
            name="totalSeats"
            value={formData.totalSeats}
            placeholder="Total Seats"
            onChange={handleChange}
          />
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
          />
          <button type="submit">Update Event</button>
        </form>
      )}
    </div>
  );
}
