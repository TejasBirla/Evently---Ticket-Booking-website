import React, { useContext, useState } from "react";
import "./CreateEvent.css";
import { EventContext } from "../../../Contexts/EventContext.jsx";

export default function CreateEvent() {
  const { createEvent } = useContext(EventContext);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: [""], // Initialize with one time input
    venue: "",
    price: "",
    totalSeats: "",
    image: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(files[0]);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleTimeChange = (index, value) => {
    const updatedTimes = [...formData.time];
    updatedTimes[index] = value;
    setFormData({ ...formData, time: updatedTimes });
  };

  const addTimeField = () => {
    setFormData({ ...formData, time: [...formData.time, ""] });
  };

  const removeTimeField = (index) => {
    const updatedTimes = formData.time.filter((_, i) => i !== index);
    setFormData({ ...formData, time: updatedTimes });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Make sure no empty time is submitted
    const cleanTimes = formData.time.filter((t) => t.trim() !== "");
    const uniqueTimes = new Set(cleanTimes);
    if (uniqueTimes.size !== cleanTimes.length) {
      alert("Duplicate showTimes are not allowed");
      return;
    }
    const success = await createEvent({ ...formData, time: cleanTimes });

    if (success) {
      setFormData({
        title: "",
        description: "",
        date: "",
        time: [""],
        venue: "",
        price: "",
        totalSeats: "",
        image: "",
      });

      const imageInput = document.getElementById("event-image");
      if (imageInput) {
        imageInput.value = "";
      }
    }
  };

  return (
    <div className="create-event-container">
      <h2>Create New Event</h2>
      <form onSubmit={handleSubmit} className="event-form">
        <input
          type="text"
          name="title"
          placeholder="Title"
          required
          value={formData.title}
          onChange={handleChange}
        />

        <textarea
          name="description"
          placeholder="Description"
          required
          value={formData.description}
          onChange={handleChange}
        />

        <input
          type="date"
          name="date"
          required
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
          placeholder="Venue"
          required
          value={formData.venue}
          onChange={handleChange}
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          required
          value={formData.price}
          onChange={handleChange}
        />

        <input
          type="number"
          name="totalSeats"
          placeholder="Total Seats"
          required
          value={formData.totalSeats}
          onChange={handleChange}
        />

        <input
          type="file"
          name="image"
          accept="image/*"
          id="event-image"
          onChange={handleChange}
        />

        <button type="submit">Create Event</button>
      </form>
    </div>
  );
}
