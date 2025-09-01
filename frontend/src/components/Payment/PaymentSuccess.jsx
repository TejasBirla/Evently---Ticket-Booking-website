import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Contexts/AuthContext.jsx";
import toast from "react-hot-toast";
import "./PaymentSuccess.css";

export default function PaymentSuccess() {
  const { finalizeBooking } = useContext(AuthContext);
  const [status, setStatus] = useState("loading");
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const finalize = async () => {
      try {
        setStatus("loading");

        // Small delay for smoother UX
        await new Promise((res) => setTimeout(res, 1000));

        const result = await finalizeBooking(); // <-- store result

        if (!isMounted) return;

        if (result.success) {
          localStorage.removeItem("payment_in_progress");
          setStatus("success");
          setTimeout(() => navigate("/mybookings"), 3000);
        } else {
          localStorage.removeItem("payment_in_progress");
          setStatus("error");
          toast.error("❌ Payment failed or could not be verified.");
        }
      } catch (err) {
        console.error("Error during finalize:", err.message);
        if (isMounted) {
          setStatus("error");
          localStorage.removeItem("payment_in_progress");
          toast.error("❌ Something went wrong during booking finalization.");
        }
      }
    };

    finalize();

    return () => {
      isMounted = false;
    };
  }, [finalizeBooking, navigate]);

  return (
    <div className="payment-status-page">
      {status === "loading" && (
        <div className="loading-msg">
          <p>⏳ Verifying your payment...</p>
        </div>
      )}
      {status === "success" && (
        <div className="success-msg">
          <h2>✅ Booking Successful</h2>
          <p>Redirecting to your bookings...</p>
        </div>
      )}
      {status === "error" && (
        <div className="error-msg">
          <h2>❌ Booking Failed</h2>
          <p>Please try again or contact support.</p>
        </div>
      )}
    </div>
  );
}
