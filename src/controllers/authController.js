import { User } from "../models/userModel.js";
import { generateAccessToken } from "../helpers/generateToken.js";
// Get a specific user by ID
const login = async (req, res) => {
  try {
    console.log(req.body);
    const { email } = req.body;
    // Find user by ID
    const data = await User.findOne({ email: email })
      .populate({
        path: "section",
        populate: [{ path: "batch" }, { path: "teacher" }, { path: "course" }],
      })
      .populate({
        path: "courses",
        populate:[
          {path:'course'}
        ],
        populate: [
          { path: "batch", populate: [{ path: "course" }, { path: "branch" }] },
        ],
      });

    const user = data;
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    const token = generateAccessToken(user);
    if (!token) {
      return res.status(401).json({ message: "Invalid credentials." });
    }
    console.log("token", token);

    res.status(200).json({ user, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export { login };
