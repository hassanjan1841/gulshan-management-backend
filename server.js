const express = require("express");
const app = express();
const mongoose = require("mongoose");

const cors = require("cors");
const dotenv = require("dotenv").config();

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
// app.use("/api/blogs", blogRoute);

// testing
app.get("/", function (req, res) {
  res.send("Hello World");
});

// port listening

app.listen(PORT, () => {
  console.log("listening on port " + PORT);
});

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("connected");
});

module.exports = app;
