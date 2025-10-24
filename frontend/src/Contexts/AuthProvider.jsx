import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import axios from "axios";
import { load } from "@cashfreepayments/cashfree-js";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [events, setAllEvents] = useState([]);
  const [singleEvent, setSingleEvent] = useState(null);
  const [allBookingDetails, setAllBookingDetails] = useState([]);
  const [redirectUrl, setRedirectUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingBooking, setLoadingBookings] = useState(false);

  //navigate to other pages
  const navigate = useNavigate();

  // Load authUser and token from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("authUser");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      setAuthUser(JSON.parse(storedUser));
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (authUser && redirectUrl) {
      setTimeout(() => {
        navigate(redirectUrl);
        setRedirectUrl(null);
      }, 50);
    }
  }, [authUser, redirectUrl, navigate]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await axios.get("/api/event/allevents");
        if (data.success) {
          setAllEvents(data.allEvents);
        }
      } catch (error) {
        console.log(error.message);
        toast.error(error.response?.data?.message || "Failed to fetch events");
      } finally {
        setLoadingEvents(false);
      }
    };

    if (events.length === 0) {
      fetchEvents();
    } else {
      setLoadingEvents(false);
    }
  }, []);

  const signupUser = async (signupData) => {
    try {
      const { data } = await axios.post("/api/user/register", signupData);
      if (data.success) {
        setAuthUser(data.user); //store user detail in state variable
        localStorage.setItem("authUser", JSON.stringify(data.user)); //set authUser in localStorage
        localStorage.setItem("token", data.token); //set token in localStorage

        axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
        toast.success(data.message);
        navigate("/"); // after successful signup navigate to home page
      }
    } catch (error) {
      console.error("Signup Error:", error.message);
      toast.error(error.response.data.message);
    }
  };

  const loginUser = async (loginData) => {
    try {
      const { data } = await axios.post("/api/user/login", loginData);
      if (data.success) {
        setAuthUser(data.user);
        localStorage.setItem("authUser", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

        const redirectData = JSON.parse(
          localStorage.getItem("redirectAfterLogin")
        );
        toast.success(data.message);

        if (redirectData?.path) {
          setRedirectUrl(redirectData.path); //set state, don't navigate yet
        } else {
          navigate("/"); // fallback
        }
      }
    } catch (error) {
      console.error("Login Error:", error.message);
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  const logoutUser = () => {
    setAuthUser(null);
    localStorage.removeItem("authUser");
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    toast.success("Logout successful.");
  };

  const subscribeToNewsLetter = async (email) => {
    try {
      const { data } = await axios.post("/api/user/newsletter", { email });
      if (data.success) {
        toast.success(data.message);
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.response?.data?.message || "Something went wrong.");
    }
  };

  const getSingleEvent = async (id) => {
    try {
      setSingleEvent(null);
      const { data } = await axios.get(`/api/event/${id}`);
      if (data.success) {
        setSingleEvent(data.event);
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.response.data.message);
    }
  };

  const initiateBooking = async (bookingInfo) => {
    try {
      const res = await axios.post(
        "/api/payment/cashfree/initiate",
        bookingInfo
      );
      const { paymentSessionId, orderId, amount } = res.data;

      // Save for finalization
      localStorage.setItem(
        "booking_data",
        JSON.stringify({
          orderId,
          eventID: bookingInfo.eventID,
          seats: bookingInfo.seats,
          time: bookingInfo.time,
          amount,
        })
      );
      localStorage.setItem("payment_in_progress", "true");

      // ✅ Load the SDK dynamically
      const cashfree = await load({
        mode: "sandbox",
      });

      // ✅ Call checkout
      cashfree.checkout({
        paymentSessionId,
        redirectTarget: "_self",
      });
    } catch (error) {
      console.error("❌ Payment initiation error:", error.message);
      toast.error("Payment could not be started. Try again.");
    }
  };

  const finalizeBooking = async () => {
    try {
      const bookingData = JSON.parse(localStorage.getItem("booking_data"));
      if (!bookingData) throw new Error("No booking data found");

      const { data } = await axios.post(
        "/api/booking/finalize/booking",
        bookingData
      );

      // Always clear localStorage to avoid old data issues
      localStorage.removeItem("booking_data");
      localStorage.removeItem("payment_in_progress");

      return { success: data.success };
    } catch (err) {
      console.error("Finalize Booking Error:", err.message);
      localStorage.removeItem("booking_data");
      localStorage.removeItem("payment_in_progress");
      return { success: false };
    }
  };

  const allBookings = async () => {
    try {
      setLoadingBookings(true);
      const { data } = await axios.get("/api/user/all/bookings");
      if (data.success) {
        setAllBookingDetails(data.allBookings);
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.response.data.message);
    } finally {
      setLoadingBookings(false);
    }
  };

  const cancelBooking = async (bookingData) => {
    try {
      const { data } = await axios.delete("/api/booking/cancel/booking", {
        data: bookingData,
      });

      if (data.success) {
        toast.success(data.message);

        setAllBookingDetails((prev) =>
          prev.filter(
            (booking) =>
              !(
                booking.event._id === bookingData.eventID &&
                booking.time === bookingData.time &&
                booking.seats.every((seat) => bookingData.seats.includes(seat))
              )
          )
        );
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.response.data.message);
    }
  };

  const value = {
    //User
    loading,
    authUser,
    loadingEvents,
    signupUser,
    loginUser,
    subscribeToNewsLetter,
    logoutUser,
    allBookingDetails,
    loadingBooking,
    allBookings,

    //Events
    events,
    singleEvent,
    getSingleEvent,

    //Tickets
    initiateBooking,
    finalizeBooking,
    cancelBooking,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
