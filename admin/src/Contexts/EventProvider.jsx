import React, { useEffect, useState } from "react";
import { EventContext } from "./EventContext.jsx";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

export const EventProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [events, setAllEvents] = useState([]);
  const [singleEvent, setSingleEvent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedAdmin = localStorage.getItem("admin");
    const token = localStorage.getItem("adminToken");
    if (storedAdmin && token) {
      setAdmin(JSON.parse(storedAdmin));
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, []);

  const registerAdmin = async (adminData) => {
    try {
      const { data } = await axios.post("/api/user/register", adminData);
      if (data.success) {
        setAdmin(data.user);
        toast.success("Admin registration successful");
        localStorage.setItem("admin", JSON.stringify(data.user));
        localStorage.setItem("adminToken", data.token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
        navigate("/admin");
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.response.data.message);
    }
  };

  const loginAdmin = async (adminData) => {
    try {
      const { data } = await axios.post("/api/user/login", adminData);
      if (data.success) {
        setAdmin(data.user);
        toast.success("Admin login successful");
        localStorage.setItem("admin", JSON.stringify(data.user));
        localStorage.setItem("adminToken", data.token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
        navigate("/admin");
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.response.data.message);
    }
  };
  const logoutAdmin = () => {
    setAdmin(null);
    localStorage.removeItem("admin");
    localStorage.removeItem("adminToken");
    delete axios.defaults.headers.common["Authorization"];
    toast.success("Admin logged out.");
    navigate("/signup");
  };

  const createEvent = async (formData) => {
    try {
      const { data } = await axios.post("/api/event/create", formData);
      if (data.success) {
        toast.success(data.message);
        return true;
      } else {
        toast.error(data.message);
        return false;
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.response.data.message);
      return false;
    }
  };
  const getAllEvents = async () => {
    try {
      const { data } = await axios.get("/api/event/allevents");
      if (data.success) {
        setAllEvents(data.allEvents);
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.response.data.message);
    }
  };

  const getSingleEvent = async (id) => {
    try {
      const { data } = await axios.get(`/api/event/${id}`);
      if (data.success) {
        setSingleEvent(data.event);
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.response.data.message);
    }
  };

  const updateEvent = async (eventID, upateData) => {
    try {
      const { data } = await axios.put(`/api/event/${eventID}`, upateData);
      if (data.success) {
        toast.success(data.message);
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.response.data.message);
    }
  };

  const deleteEvent = async (eventID) => {
    try {
      const { data } = await axios.delete(`/api/event/${eventID}`);
      if (data.success) {
        toast.success(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const value = {
    admin,
    registerAdmin,
    loginAdmin,
    logoutAdmin,
    createEvent,
    getAllEvents,
    events,
    singleEvent,
    getSingleEvent,
    updateEvent,
    deleteEvent,
  };
  return (
    <EventContext.Provider value={value}>{children}</EventContext.Provider>
  );
};
