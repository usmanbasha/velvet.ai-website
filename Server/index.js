const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const session = require("express-session");
const passport = require("passport");
const userRoutes = require("./routes/userRoutes");
require("./middleware/passportConfig"); // Adjust path if necessary
const bodyParser = require("body-parser");


dotenv.config(); // Load environment variables

const app = express(); // Initialize the Express app
const PORT = process.env.PORT || 5000;

// Middleware for parsing JSON
app.use(bodyParser.json());

// CORS middleware
app.use(
  cors({
    origin: process.env.FRONTEND_PORT || "http://localhost:3000",
    credentials: true,
  })
);

// Middleware for parsing URL-encoded data and JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use("/uploads", express.static("uploads"));

// Session management
app.use(
  session({
    secret: process.env.SESSION_SECRET || "fallbackSecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === "production", // Requires HTTPS in production
      httpOnly: true, // Protects against XSS
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Adjust for dev/prod
    },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Test route to ensure the server is working
app.get("/", (req, res) => {
  res.send("Hello from the backend!");
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

// User Routes (e.g., /api/users/login, /api/users/signup)
app.use("/api/users", userRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
