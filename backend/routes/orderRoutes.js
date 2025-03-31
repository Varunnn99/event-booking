import express from "express";
import pool from "../config/db.js";  // ✅ Use ES module import

const router = express.Router();

// Generate Unique Ticket ID
const generateTicketID = () => {
  return "TICKET-" + Math.random().toString(36).substr(2, 9).toUpperCase();
};

// Get User's Purchased Tickets
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const [result] = await pool.query(
      "SELECT event_id, ticket_id, purchase_date FROM orders WHERE user_id = ?",
      [userId]
    );
    res.json(result);
  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Place Order
router.post("/place-order", async (req, res) => {
  try {
    console.log("📥 Received Order Data:", req.body);
    console.log("🔑 Received Headers:", req.headers);

    const { user_id, total_price, events } = req.body;

    // **Check if required fields are present**
    if (!user_id || !total_price || !Array.isArray(events) || events.length === 0) {
      console.error("❌ Missing required fields in request");
      return res.status(400).json({ error: "Missing required fields" });
    }

    // **Check if user exists in database**
    const [user] = await pool.query("SELECT * FROM users WHERE id = ?", [user_id]);
    if (user.length === 0) {
      console.error("❌ User not found in database");
      return res.status(400).json({ error: "User not found" });
    }

    // **Check if all event IDs exist in the database**
    for (const event of events) {
      const [eventExists] = await pool.query("SELECT * FROM events WHERE id = ?", [event.event_id]);
      if (eventExists.length === 0) {
        console.error(`❌ Event ID ${event.event_id} not found in database`);
        return res.status(400).json({ error: `Event with ID ${event.event_id} does not exist` });
      }
    }

    // **Simulate ticket purchase**
    for (const event of events) {
      const ticketId = `TICKET-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      await pool.query(
        "INSERT INTO orders (user_id, event_id, ticket_id) VALUES (?, ?, ?)",
        [user_id, event.event_id, ticketId]
      );
    }

    console.log("✅ Order placed successfully");
    res.json({ message: "Payment successful! Tickets generated." });
  } catch (error) {
    console.error("❌ Order Processing Error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;  
