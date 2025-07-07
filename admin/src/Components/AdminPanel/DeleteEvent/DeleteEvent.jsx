import React, { useContext, useEffect, useState } from "react";
import { EventContext } from "../../../Contexts/EventContext.jsx";
import ConfirmDialog from "../ConfirmDialog/ConfirmDialog.jsx";
import "./DeleteEvent.css";

export default function DeleteEvent() {
  const { events, getAllEvents, deleteEvent } = useContext(EventContext);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    getAllEvents();
  }, [events]);

  const handleDelete = () => {
    if (!selectedEventId) return;
    setShowDialog(true);
  };
  const handleConfirm = () => {
    deleteEvent(selectedEventId);
    setSelectedEventId("");
    setShowDialog(false);
  };

  const handleCancel = () => {
    setShowDialog(false);
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

      {showDialog && (
        <ConfirmDialog
          title="Confirm Deletion"
          message="Are you sure you want to delete this event?"
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}
