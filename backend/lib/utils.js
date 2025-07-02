import jwt from "jsonwebtoken";

//generating jsonwebtoken
export const generateToken = (userId) => {
  const payload = { userId };
  const token = jwt.sign(payload, process.env.JWT_SECRET_TOKEN);
  return token;
};
