require('dotenv').config();
const express= require("express");
const pool = require('./db');
const app = express();
app.use(express.json());
app.get("/",(req,res)=>{
 res.send("Url Shortener Backend");
});


app.post("/api/shorten", async (req, res) => {          // added: async, so we can use await below
  console.log("ROUTE WAS HIT");
  console.log(req.body);

  const code = generateShortCode();
  const text = "INSERT INTO urls (original_url, short_url) VALUES ($1, $2)";
  const values = [req.body.url, code];                  // fixed: real data, not hardcoded strings

  try {
    await pool.query(text, values);                     // added: await, so we wait for the insert to finish
    res.json({ shortUrl: code });                        // moved inside try: only responds AFTER a successful insert
  } catch (err) {
    console.error("Query error", err.stack);
    res.status(500).json({ error: "Something went wrong" }); // added: respond on failure too — a route must always respond, one way or the other
  }
});
function generateShortCode() {
  let s = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"; // let, not char
  let ans = "";                                                             // let, not const — it gets reassigned
  for (let i = 0; i < 6; i++) {                                             // let, not int; loop 6 times (your code length), not s.length
    ans += s.charAt(Math.floor(Math.random() * s.length));                  // charAt already gives the character — no .substring() wrapping needed
  }
  return ans;
}

//testing the Node
/* pool.query('SELECT NOW()', (err, res) => {
  console.log(err, res?.rows);
}); */

app.listen(5000,()=>{
    console.log("Congrats Server is running on port 5000");
  
});

