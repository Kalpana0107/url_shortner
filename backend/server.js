require('dotenv').config();
const express = require("express");
const cors = require("cors");
const pool = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

function generateShortCode() {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Fetch all URLs for the dashboard
app.get("/api/urls", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, original_url, short_url, created_at, clicks FROM urls ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch URLs" });
  }
});

// Shorten a new URL
app.post("/api/shorten", async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    new URL(url);
  } catch {
    return res.status(400).json({ error: "Invalid URL format (include http:// or https://)" });
  }

  try {
    let insertedRow = null;
    // Retry if a random 6-char collision occurs
    while (!insertedRow) {
      const code = generateShortCode();
      try {
        const result = await pool.query(
          "INSERT INTO urls (original_url, short_url) VALUES ($1, $2) RETURNING id, original_url, short_url, created_at, clicks",
          [url, code]
        );
        insertedRow = result.rows[0];
      } catch (err) {
        if (err.code !== '23505') throw err;
      }
    }

    res.status(201).json(insertedRow);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Redirect & increment click count
app.get("/:shortCode", async (req, res) => {
  const { shortCode } = req.params;

  try {
    const result = await pool.query(
      "UPDATE urls SET clicks = clicks + 1 WHERE short_url = $1 RETURNING original_url",
      [shortCode]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    res.redirect(result.rows[0].original_url);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = process.env.SERVER_PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});