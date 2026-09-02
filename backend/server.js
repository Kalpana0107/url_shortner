const express= require("express");
const app = express();

app.get("/",(req,res)=>{
 res.send("Url Shortener Backend");
});

app.listen(5000,()=>{
    console.log("Congrats Server is running on port 5000");
});