const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const authRoute = require("./Routers/authroute");
const postRoute = require("./Routers/postroutes");
const comment = require("./Routers/commentroute");
const follow = require("./Routers/followroute")
const cors = require("cors");
const userRoute = require("./Routers/userroute")

//Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(cors({
  origin:process.env.FRONTEND_URL,
  credentials:true
}));

app.set("trust proxy", 1);

//Routes
app.get("/", (req, res) => {
  res.send("API running 🚀"); 
});

app.use("/auth",authRoute);
app.use("/post",postRoute);
app.use("/comment",comment);
app.use("/follow",follow);
app.use("/users",userRoute);

module.exports = app;
