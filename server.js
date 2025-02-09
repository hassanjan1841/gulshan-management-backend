import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import UserRoute from "./src/routes/userRoutes.js";
import AuthRoute from "./src/routes/authRoutes.js";
import { connectDB } from "./src/config/dbConnect.js";
import CourseRoute from "./src/routes/courseRoutes.js";
import SectionRoute from "./src/routes/sectionRoutes.js";
import BatchRoute from "./src/routes/batchRoutes.js";
import BranchRoute from "./src/routes/branchRoutes.js";
import EmailRoutes from "./src/routes/EmailRoutes.js";
import AssignmentRoute from "./src/routes/assignmentRoutes.js";
import AssignmentSubmissionRoute from "./src/routes/assignmentSubmissionRoutes.js";
import MainQuizRoute from "./src/routes/mainQuizRoute.js";
connectDB();

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3002;

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
app.use("/api/user", UserRoute);
app.use("/api/auth", AuthRoute);
app.use("/api/course", CourseRoute);
app.use("/api/batch", BatchRoute);
app.use("/api/section", SectionRoute);
app.use("/api/branch", BranchRoute);
app.use("/api/assignment", AssignmentRoute);
app.use("/api/assignment-submission", AssignmentSubmissionRoute);
app.use("/api/main-quiz", MainQuizRoute);
app.use("/api/sendEmail", EmailRoutes);
// testing
// app.get("/", function (req, res) {
//   res.send("Hello World");
// });

// port listening

app.listen(PORT, () => {
  console.log("listening on port " + PORT);
});

export default app;
