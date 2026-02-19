const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const authRoute = require("./Routers/authroute");

//Middlewares
app.use(cookieParser());
app.use(express.json());

//Routes
app.get("/", (req, res) => {
  res.send("API running 🚀"); 
});

app.use("/auth",authRoute)

module.exports = app;
