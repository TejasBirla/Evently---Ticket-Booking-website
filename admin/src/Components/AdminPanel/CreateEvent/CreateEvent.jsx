import React, { useContext, useState } from "react";
import "./CreateEvent.css";
import { EventContext } from "../../../Contexts/EventContext.jsx";

export default function CreateEvent() {
  const { createEvent } = useContext(EventContext);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const success = await createEvent(formData);

    // Clear the form fields after successful creation
    if (success) {
      setFormData({
        title: "",
        description: "",
        date: "",
        time: "",
        venue: "",
        price: "",
        totalSeats: "",
        image: "",
      });

      if (document.getElementById("event-image")) {
        document.getElementById("event-image").value = "";
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
        <input
          type="time"
          name="time"
          required
          value={formData.time}
          onChange={handleChange}
        />
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
