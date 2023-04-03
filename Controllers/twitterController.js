const twitterModel = require("../models/TwitterModel");
const userModel = require("../models/UserModel");



//======================================= Create a new tweet ========================================================//

const createTwitter = async function (req, res) {
  try {
    const { author, text, hashtag } = req.body;

    // Check if author exists
    const authorExists = await userModel.findById(author);
    if (!authorExists) {
      return res.status(400).json({ msg: "Author not found" });
    }

    const tweet = new twitterModel({ author, text ,hashtag});
    await tweet.save();

    // Add tweet to user's tweets
    authorExists.tweets.push(tweet._id);
    await authorExists.save();

    res.json(tweet);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

//============================================== Get all tweets =====================================//

const getTwitter = async function (req, res) {
  try {
    const tweets = await twitterModel
      .find()
      .populate("author")
    res.json(tweets);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

//===================================================== Follow a user ======================================//

const followUser = async function (req, res) {
  try {
    const { userId } = req.params;
    const { followerId } = req.body;

    // Check if both users exist
    const user = await userModel.findById(userId);
    const follower = await userModel.findById(followerId);
    if (!user || !follower) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Check if follower is already following user
    if (user.followers.includes(followerId)) {
      return res.status(400).json({ msg: "Already following this user" });
    }

    // Add follower to user's followers and user to follower's following
    user.followers.push(followerId);
    await user.save();
    follower.following.push(userId);
    await follower.save();

    res.json({ msg: "Followed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

// ================================================ Unfollow a user ========================================//

const unfollowUser = async function (req, res) {
  try {
    const { userId } = req.params;
    const { followerId } = req.body;

    // Check if both users exist
    const user = await userModel.findById(userId);
    const follower = await userModel.findById(followerId);
    if (!user || !follower) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Check if follower is already not following user
    if (!user.followers.includes(followerId)) {
      return res.status(400).json({ msg: "Not following this user" });
    }

    // Remove follower from user's followers and user from follower's following
    user.followers = user.followers.filter((f) => f.toString() !== followerId);
    await user.save();
    follower.following = follower.following.filter(
      (f) => f.toString() !== userId
    );
    await follower.save();

    res.json({ msg: "Unfollowed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

//====================================== Search for tweets by keyword or hashtag ================================//

const searchUser = async function (req, res) {
  try {
    const query = req.query.text;
    const hashquery = req.query.hashtag;

    let searchTweet = new RegExp(query, "g");
    let hashtags = new RegExp(hashquery, "g");

    // Search for tweets that match the query
    const tweets = await twitterModel
      .find({ $or: [{ text: searchTweet, hashtag: hashtags }] })
      .sort({ createdAt: -1 });

    res.json(tweets);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};



//========================================= Get paginated tweets ========================================//

const paginateTweet= async function (req, res) {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const tweets = await twitterModel.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json(tweets);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  createTwitter,
  getTwitter,
  followUser,
  unfollowUser,
  searchUser,
  paginateTweet
};
