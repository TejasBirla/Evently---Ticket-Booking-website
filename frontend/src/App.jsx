import { Routes, Route, Navigate } from "react-router-dom";
import React, { useContext } from "react";
import { AuthContext } from "./Contexts/AuthContext.jsx";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar/Navbar.jsx";
import Login from "./components/Login/Login.jsx";
import Signup from "./components/Signup/Signup.jsx";
import Home from "./components/Home/Home.jsx";
import Footer from "./components/Footer/Footer.jsx";
import Events from "./components/Events/Events.jsx";
import SingleEvent from "./components/Events/SingleEvent.jsx";
import TicketBooking from "./components/Booking/TicketBooking.jsx";
import MyBooking from "./components/Booking/MyBooking.jsx";
import PaymentSuccess from "./components/Payment/PaymentSuccess.jsx";
import ProtectPaymentRoute from "./components/Payment/ProtectPaymentRoute.jsx";

export default function App() {
  const { authUser, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>Loading...</div>
    ); //Show while checking localStorage
  }
  return (
    <>
      <Toaster />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={authUser ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path="/signup"
          element={authUser ? <Navigate to="/" /> : <Signup />}
        />
        <Route path="/events" element={<Events />} />
        <Route path="/event/:id" element={<SingleEvent />} />
        <Route path="/book/event/:id/ticket" element={<TicketBooking />} />
        <Route
          path="/mybookings"
          element={authUser ? <MyBooking /> : <Navigate to="/" />}
        />
        <Route
          path="/payment-success"
          element={
            <ProtectPaymentRoute>
              <PaymentSuccess />
            </ProtectPaymentRoute>
          }
        />
      </Routes>
      <Footer />
    </>
  );
}
