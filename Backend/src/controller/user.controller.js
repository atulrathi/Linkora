const User = require("../models/usermodel");
const Post = require("../models/postmodel");

/**
 * GET /users/:username
 *
 * Returns a user's public profile data along with their post count.
 * Sensitive fields (password, googleId, email) are excluded from the response.
 *
 * Response:
 *   - 200 OK        — User found and returned.
 *   - 404 Not Found — No user exists with this username.
 *   - 500 Internal  — An unexpected server error occurred.
 */
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

/**
 * GET /auth/me
 *
 * Returns the currently authenticated user's data.
 * Requires the user to be logged in (auth middleware must set req.user).
 *
 * Response:
 *   - 200 OK        — Authenticated user data returned.
 *   - 401 Unauthorised — No active session found.
 *   - 500 Internal  — An unexpected server error occurred.
 */
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-password -googleId")
      .lean();

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Session is invalid. Please sign in again.",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {
    console.error("[getMe]", error);

    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again.",
    });
  }
};

module.exports = { getUserByUsername, getMe };