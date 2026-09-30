require('dotenv').config();
const express = require("express");
const pool = require('./db');
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Url Shortener Backend");
});

app.post("/api/shorten", async (req, res) => {
  console.log("ROUTE WAS HIT");
  console.log(req.body);

  if (!req.body.url) {
    return res.status(400).json({ error: "url is required" });
  }

  const code = generateShortCode();
  const text = "INSERT INTO urls (original_url, short_url) VALUES ($1, $2)";
  const values = [req.body.url, code];

  try {
    await pool.query(text, values);
    res.json({ shortUrl: code });
  } catch (err) {
    console.error("Query error", err.stack);
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Congrats Server is running on port ${PORT}`);
});