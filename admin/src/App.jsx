import React, { useContext } from "react";
import { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes } from "react-router-dom";
import Signup from "./Components/Signup/Signup.jsx";
import Login from "./Components/Login/Login.jsx";
import Home from "./Components/HomePage/Home.jsx";
import AdminDashboard from "./Components/AdminPanel/AdminDashboard/AdminDashboard.jsx";
import CreateEvent from "./Components/AdminPanel/CreateEvent/CreateEvent.jsx";
import UpdateEvent from "./Components/AdminPanel/UpdateEvent/UpdateEvent.jsx";
import DeleteEvent from "./Components/AdminPanel/DeleteEvent/DeleteEvent.jsx";
import { EventContext } from "./Contexts/EventContext.jsx";

export default function App() {
  const { admin } = useContext(EventContext);
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/signup"
          element={admin ? <Navigate to="/admin" /> : <Signup />}
        />
        <Route
          path="/login"
          element={admin ? <Navigate to="/admin" /> : <Login />}
        />

        <Route
          path="/admin"
          element={admin ? <AdminDashboard /> : <Navigate to="/signup" />}
        >
          <Route path="create" element={<CreateEvent />} />
          <Route path="update" element={<UpdateEvent />} />
          <Route path="delete" element={<DeleteEvent />} />
        </Route>
      </Routes>
    </>
  );
}
