const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const authRoute = require("./Routers/authroute");
const postRoute = require("./Routers/postroutes");
const comment = require("./Routers/commentroute");
const follow = require("./Routers/followroute")
const cors = require("cors");

//Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(cors({
  origin:"http://localhost:5173",
  credentials:true
}));

//Routes
app.get("/", (req, res) => {
  res.send("API running 🚀"); 
});

app.use("/auth",authRoute);
app.use("/post",postRoute);
app.use("/comment",comment);
app.use("/follow",follow);

module.exports = app;
