const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const db = require("../config/db");

// Create Order & Generate Tickets
router.post("/", async (req, res) => {
    const { user_id, total_price, events } = req.body;

    if (!user_id || !events.length) {
        return res.status(400).json({ error: "Invalid order data" });
    }

    try {
        const [orderResult] = await db.execute(
            "INSERT INTO orders (user_id, total_price) VALUES (?, ?)",
            [user_id, total_price]
        );

        const orderId = orderResult.insertId;

        const ticketQueries = events.map(event => {
            const ticketId = uuidv4();
            return db.execute(
                "INSERT INTO tickets (ticket_id, order_id, event_id) VALUES (?, ?, ?)",
                [ticketId, orderId, event.event_id]
            );
        });

        await Promise.all(ticketQueries);

        res.status(201).json({ message: "Order placed successfully!", orderId });
    } catch (error) {
        console.error("Order creation error:", error);
        res.status(500).json({ error: "Failed to place order" });
    }
});

// Get User's Tickets
router.get("/user/:userId", async (req, res) => {
    const { userId } = req.params;
    try {
        const [tickets] = await db.execute(
            `SELECT tickets.ticket_id, tickets.event_id, orders.purchase_date 
             FROM tickets 
             JOIN orders ON tickets.order_id = orders.order_id 
             WHERE orders.user_id = ?`,
            [userId]
        );

        res.json(tickets);
    } catch (error) {
        console.error("Error fetching tickets:", error);
        res.status(500).json({ error: "Failed to retrieve tickets" });
    }
});

module.exports = router;
