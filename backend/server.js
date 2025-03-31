import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "./config/db.js";
import { authenticateJWT } from "./middleware/authMiddleware.js";
import orderRoutes from "./routes/orderRoutes.js";

//const cors = require("cors");
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

//const orderRoutes = require("./routes/orderRoutes");
app.use("/api/orders", orderRoutes);


// Get all events
app.get("/api/events", async (req, res) => {
  try {
      const [events] = await pool.query("SELECT * FROM events");
      res.json(events);
  } catch (err) {
      console.error("Error fetching events:", err);
      res.status(500).json({ message: "Internal Server Error" });
  }
});

// Add a new event
app.post("/api/events", async (req, res) => {
  const { heading, year, month, location, description, img } = req.body;

  try {
      await pool.query(
          "INSERT INTO events (heading, year, month, location, description, img) VALUES (?, ?, ?, ?, ?, ?)",
          [heading, year, month, location, description, img]
      );
      res.status(201).json({ message: "Event added successfully!" });
  } catch (err) {
      console.error("Error adding event:", err);
      res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get events by month and year
app.get("/api/events/filter", async (req, res) => {
  console.log("Received Request:", req.query);
  const { month, year } = req.query;
  console.log("Filter API hit with:", month, year);

  try {
    const [events] = await pool.query(
      "SELECT * FROM events WHERE month = ? AND year = ?",
      [month, year]
    );

    console.log("Events found:", events); // Debugging log

    if (events.length === 0) {
      return res.status(200).json([]); 
    }

    res.json(events);
  } catch (err) {
    console.error("Error filtering events:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
  
});


// Get a single event by ID
app.get("/api/events/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [event] = await pool.query("SELECT * FROM events WHERE id = ?", [id]);

    if (event.length === 0) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(event[0]);
  } catch (err) {
    console.error("Error fetching event:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});






// Register User
app.post("/api/register", async (req, res) => {
    const { name, email, password } = req.body;
  
    try {
      // Check if the user already exists
      const [existingUsers] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
      if (existingUsers.length > 0) {
        return res.status(400).json({ message: "User already exists" });
      }
  
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Insert user into the database
      await pool.query("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, hashedPassword]);
  
      res.status(201).json({ success: true, message: "User registered successfully!" });
    } catch (err) {
      console.error("Error registering user:", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
  
// Login User
app.post("/api/login", async (req, res) => {
  console.log("Login attempt:", req.body);
  const { email, password } = req.body;
  const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);

  if (users.length === 0) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const isMatch = await bcrypt.compare(password, users[0].password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const user = {
    id: users[0].id,
    name: users[0].name,
    email: users[0].email,
  };

  const token = jwt.sign({ id: users[0].id }, process.env.JWT_SECRET, { expiresIn: "1h" });

  console.log("✅ Login successful. Returning user & token:", { user, token });
  res.json({ user, token });  
});


app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
