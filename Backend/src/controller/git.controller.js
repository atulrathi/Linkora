const axios = require("axios");
const User = require("../models/usermodel");
function gitpage(req, res) {
  const githubURL =
    `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=repo user:email`;

  res.redirect(githubURL);
}

async function githubcallback(req, res) {
  const code = req.query.code;
  const userId = req.user._id;

  try {
    const tokenResponse = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_SECRET_ID,
        code,
      },
      {
        headers: { Accept: "application/json" },
      }
    );

    const user = await User.findById(userId);
    if(!user) {
      return res.status(404).send("User not found");
    }
    user.AccessToken = tokenResponse.data.access_token;
    await user.save();
    
    const userResponse = await axios.get(
      "https://api.github.com/user/repos",
      {
        headers: {
          Authorization: `Bearer ${user.AccessToken}`,
        },
      }
    );
    
    res.json(userResponse.data);


  } catch (error) {
    console.log(error.response?.data || error.message);
    res.status(500).send("GitHub authentication failed");
  }
}

async function getRepos(req, res) {
  const userId = req.user._id;

  try{
    const user = await User.findById(userId);
    if(!user || !user.AccessToken) {
      return res.status(404).send("User not found or GitHub not linked");
    }
     const userResponse = await axios.get(
      "https://api.github.com/user/repos",
      {
        headers: {
          Authorization: `Bearer ${user.AccessToken}`,
        },
      }
    );
    
    res.json(userResponse.data); 

  } catch (error) {
    console.log(error);
    res.status(500).send("Error fetching repositories");
  }
}

module.exports = { gitpage, githubcallback , getRepos};
