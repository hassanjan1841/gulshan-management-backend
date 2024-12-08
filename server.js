import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { userRoute } from "./management-system/routes/user.route.js";

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
// app.use("/api/projects", projectRoute);
app.use("/api/user", userRoute);

// testing
// app.get("/", function (req, res) {
//   res.send("Hello World");
// });

// port listening

app.listen(PORT, () => {
  console.log("listening on port " + PORT);
});

mongoose.connect(MONGO_URI).then(() => {
  console.log("connected");
});

export default app;
