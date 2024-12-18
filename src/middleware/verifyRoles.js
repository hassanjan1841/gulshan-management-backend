import jwt from "jsonwebtoken";

// Middleware to verify roles
const verifyRoles = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      // Check for JWT token in the Authorization header

      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.split(" ")[1];

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res
          .status(403)
          .json({ message: "Access denied: No token provided" });
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace with your secret

      const user = decoded;
      console.log("user", user);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      console.log("allowedRoles", allowedRoles);
      // Check if user's role is in the allowed roles
      if (!allowedRoles.includes(user.role)) {
        return res
          .status(403)
          .json({ message: "Access denied: Insufficient permissions" });
      }

      // Pass user information to the next middleware
      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
    }
  };
};

export default verifyRoles;
