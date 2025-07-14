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
    time: [""],
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
        time: Array.isArray(singleEvent.time)
          ? singleEvent.time
          : [singleEvent.time || ""],
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

  const handleTimeChange = (index, value) => {
    const updatedTimes = [...formData.time];
    updatedTimes[index] = value;
    setFormData((prev) => ({ ...prev, time: updatedTimes }));
  };

  const addTimeField = () => {
    setFormData((prev) => ({ ...prev, time: [...prev.time, ""] }));
  };

  const removeTimeField = (index) => {
    const updatedTimes = formData.time.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, time: updatedTimes }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedEventId) return;
    const cleanTimes = formData.time.filter((t) => t.trim() !== "");
    const uniqueTimes = new Set(cleanTimes);
    if (uniqueTimes.size !== cleanTimes.length) {
      alert("Duplicate showTimes are not allowed");
      return;
    }
    updateEvent(selectedEventId, { ...formData, time: cleanTimes });
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

          <label>Showtimes:</label>
          {formData.time.map((t, index) => (
            <div className="time-input-row" key={index}>
              <input
                type="time"
                required
                value={t}
                onChange={(e) => handleTimeChange(index, e.target.value)}
              />
              {formData.time.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeTimeField(index)}
                  className="remove-btn"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addTimeField}>
            + Add Show Time
          </button>

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
