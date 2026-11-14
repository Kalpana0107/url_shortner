require('dotenv').config();
const express = require("express");
const pool = require('./db');
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Url Shortener Backend");
});


app.post("/api/shorten", async (req, res) => {
  const { url } = req.body;

  // Check if URL is provided
  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  // Validate URL format
  try {
    new URL(url);
  } catch {
    return res.status(400).json({ error: "Invalid URL format" });
  }

  const code = generateShortCode();

  try {
    await pool.query(
      "INSERT INTO urls (original_url, short_url) VALUES ($1, $2)",
      [url, code]
    );

    res.status(201).json({ shortUrl: code });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});


function generateShortCode() {
  let s = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let ans = "";
  for (let i = 0; i < 6; i++) {
    ans += s.charAt(Math.floor(Math.random() * s.length));
  }
  return ans;
}

app.get("/:shortCode", async (req, res) => {
  const shortCode = req.params.shortCode;

  try {
    const result = await pool.query(
      "SELECT original_url FROM urls WHERE short_url = $1",
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

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Congrats Server is running on port ${PORT}`);
});