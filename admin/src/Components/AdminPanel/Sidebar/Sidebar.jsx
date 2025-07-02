import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";
import { EventContext } from "../../../Contexts/EventContext.jsx";

export default function Sidebar() {
  const navigate = useNavigate();
  const { logoutAdmin } = useContext(EventContext);


  return (
    <div className="sidebar">
      <h2>Admin Panel</h2>
      <ul>
        <li onClick={() => navigate("/admin/create")}>Create Event</li>
        <li onClick={() => navigate("/admin/update")}>Update Event</li>
        <li onClick={() => navigate("/admin/delete")}>Delete Event</li>
        <li onClick={logoutAdmin}>Logout</li>
      </ul>
    </div>
  );
}
