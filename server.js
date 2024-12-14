import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { userRoute } from "./src/routes/userRoutes.js";
import { authRoute } from "./src/routes/authRoutes.js";
import { connectDB } from "./src/config/dbConnect.js";
import CourseRoute from "./src/routes/courseRoutes.js";

connectDB();

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3002;
const MONGO_URI = process.env.MONGO_URI;

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  cors({
    origin: "*", // Allow all origins, adjust as needed
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  })
);

// routes
app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/courses", CourseRoute);

// testing
// app.get("/", function (req, res) {
//   res.send("Hello World");
// });

// port listening

app.listen(PORT, () => {
  console.log("listening on port " + PORT);
});

export default app;
