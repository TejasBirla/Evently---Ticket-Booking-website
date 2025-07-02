import React, { useContext, useEffect, useState } from "react";
import { EventContext } from "../../../Contexts/EventContext.jsx";
import "./DeleteEvent.css";

export default function DeleteEvent() {
  const { events, getAllEvents, deleteEvent } = useContext(EventContext);
  const [selectedEventId, setSelectedEventId] = useState("");

  useEffect(() => {
    getAllEvents();
  }, [events]);

  const handleDelete = () => {
    if (!selectedEventId) return;
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this event?"
    );
    if (confirmDelete) {
      deleteEvent(selectedEventId);
      setSelectedEventId("");
    }
  };

  return (
    <div className="delete-event-container">
      <h2>Delete Event</h2>

      <select
        value={selectedEventId}
        onChange={(e) => setSelectedEventId(e.target.value)}
      >
        <option value="">Select an Event</option>
        {events.map((event) => (
          <option key={event._id} value={event._id}>
            {event.title}
          </option>
        ))}
      </select>

      <button
        className="delete-button"
        onClick={handleDelete}
        disabled={!selectedEventId}
      >
        Delete Event
      </button>
    </div>
  );
}
