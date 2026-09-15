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

app.listen(5000,()=>{
    console.log("Congrats Server is running on port 5000");
});