const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRoute = require("./Routers/authroute");
const postRoute = require("./Routers/postroutes");
const comment = require("./Routers/commentroute");
const follow = require("./Routers/followroute");
const userRoute = require("./Routers/userroute");
const gitroute = require("./Routers/git")

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ["GET","POST","PUT","DELETE","PATCH"],
  allowedHeaders: ["Content-Type","Authorization"]
}));

app.use(express.json());
app.use(cookieParser());

// Routes
app.get("/", (req, res) => {
  res.send("API running 🚀");
});

app.use("/auth", authRoute);
app.use("/post", postRoute);
app.use("/comment", comment);
app.use("/follow", follow);
app.use("/users", userRoute);
app.use("/github",gitroute);

module.exports = app;