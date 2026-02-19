const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const authRoute = require("./Routers/authroute");
const postRoute = require("./Routers/postroutes");
const comment = require("./Routers/commentroute");
const follow = require("./Routers/followroute")

//Middlewares
app.use(cookieParser());
app.use(express.json());

//Routes
app.get("/", (req, res) => {
  res.send("API running 🚀"); 
});

app.use("/auth",authRoute);
app.use("/post",postRoute);
app.use("/comment",comment);
app.use("/follow",follow);

module.exports = app;
