const User = require("../models/usermodel");
const Post = require("../models/postmodel");

const getUserByUsername = async (req, res) => {
  try {
    const id = req.user._id;

    const user = await User.findOne({ _id: id })
      .select("-password -googleId -__v")
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Fetch the user's post count in parallel — no need to load all posts.
    const postCount = await Post.countDocuments({ author: id });

    return res.status(200).json({
      success: true,
      user: {
        _id:          user._id,
        name:         user.name,
        username:     user.username,
        avatar:       user.avatar,
        bio:          user.bio,
        followers:    user.followers.length,
        following:    user.following.length,
        postCount,
        isVerified:   user.isVerified,
        createdAt:    user.createdAt,
        profilePic:   user.profilePic,
        coverPhoto:   user.coverPhoto
      },
    });

  } catch (error) {
    console.error("[getUserByUsername]", error);

    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again.",
    });
  }
};

const uploadProfileImage = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    user.profilePic = req.file.path;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile image uploaded",
      imageUrl: user.profilePic
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const uploadcoverphoto = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    user.coverPhoto = req.file.path;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Cover photo uploaded",
      imageUrl: user.coverPhoto
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getUserByUsername , uploadProfileImage , uploadcoverphoto };