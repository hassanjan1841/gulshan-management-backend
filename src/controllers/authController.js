import User from "../models/userModel.js";
import { generateAccessToken } from "../helpers/generateToken.js";
// Get a specific user by ID
const login = async (req, res) => {
  try {
    // console.log(req.body);
    // Find user by ID
    const data = await User.find({ email: req.body.email });
    const user = data[0];
    const token = generateAccessToken(user);

    console.log("token", token);

    if (!token) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ user, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export { login };
