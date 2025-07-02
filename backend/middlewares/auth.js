import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
  let token;

  // Check for Authorization: Bearer <token>
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET_TOKEN);

      const user = await User.findById(decoded.userId).select("-password");
      if (!user) {
        return res
          .status(401)
          .json({ success: false, message: "User not found." });
      }

      req.user = user; // attach to req object
      next(); // go to next middleware or controller
    } catch (error) {
      console.error("JWT error:", error.message);
      return res
        .status(401)
        .json({ success: false, message: "Invalid token." });
    }
  } else {
    return res
      .status(401)
      .json({ success: false, message: "No token provided." });
  }
};
