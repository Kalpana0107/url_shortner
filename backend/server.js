const express= require("express");
const app = express();
app.use(express.json());
app.get("/",(req,res)=>{
 res.send("Url Shortener Backend");
});


app.post("/api/shorten", (req, res) => {
  console.log("ROUTE WAS HIT");
  console.log(req.body);
  res.json({ received: req.body.url });
});
function generateShortCode() {
  let s = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"; // let, not char
  let ans = "";                                                             // let, not const — it gets reassigned
  for (let i = 0; i < 6; i++) {                                             // let, not int; loop 6 times (your code length), not s.length
    ans += s.charAt(Math.floor(Math.random() * s.length));                  // charAt already gives the character — no .substring() wrapping needed
  }
  return ans;
}

app.listen(5000,()=>{
    console.log("Congrats Server is running on port 5000");
    console.log(generateShortCode())
    console.log(generateShortCode())
});
