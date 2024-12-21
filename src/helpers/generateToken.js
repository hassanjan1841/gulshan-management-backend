import jwt from "jsonwebtoken";
export function generateAccessToken(user) {
  // console.log("user in generatetoken", user);
  return jwt.sign({ ...user }, process.env.JWT_SECRET);
}
