import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";

export default function AdminDashboard() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div
        style={{
          marginLeft: "220px", 
          padding: "30px",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            maxWidth: "800px",
            margin: "0 auto", 
          }}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
}
