import React, { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../Contexts/AuthContext.jsx";

export default function ProtectPaymentRoute({ children }) {
  const { authUser } = useContext(AuthContext);
  const [isAllowed, setIsAllowed] = useState(null);

  useEffect(() => {
    const flag = localStorage.getItem("payment_in_progress");
    if (authUser && flag) {
      setIsAllowed(true);
    } else {
      setIsAllowed(false);
    }
  }, [authUser]);

  if (isAllowed === null) return null;

  return isAllowed ? children : <Navigate to="/" />;
}
