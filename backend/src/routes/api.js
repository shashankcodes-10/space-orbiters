import { Router } from "express";
import { pool } from "../db/pool.js";

const router = Router();

router.get("/health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW() AS time");
    res.json({ status: "ok", database: "connected", time: result.rows[0].time });
  } catch (error) {
    res.status(503).json({ status: "error", database: "disconnected" });
  }
});

router.get("/planets", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, description, created_at FROM planets ORDER BY id"
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch planets" });
  }
});

router.get("/users", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, username, email, created_at FROM users ORDER BY id"
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

router.get("/messages", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        m.id,
        m.message,
        m.created_at,
        u.username
      FROM messages m
      LEFT JOIN users u ON u.id = m.user_id
      ORDER BY m.created_at ASC
      LIMIT 100
    `);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

router.get("/launches", async (req, res) => {
  try {
    const response = await fetch(
      "https://ll.thespacedevs.com/2.2.0/launch/?limit=20&ordering=net"
    );

    if (!response.ok) {
      throw new Error(`Launch API returned ${response.status}`);
    }

    const data = await response.json();
    res.json({ launches: data.results || [] });
  } catch (error) {
    console.error(error);
    res.status(502).json({ error: "Failed to fetch launch data" });
  }
});

export default router;
