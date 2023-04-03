const express = require("express")
const router = express.Router()

const userController = require("../Controllers/UserController");
const twitterController = require("../Controllers/twitterController")
const mid = require("../middlewares/auth");

//====================== user Route =======================================//

router.post("/register",userController.registerUser)
router.post("/login",userController.loginUser)
router.get("/getUser", userController.getUser)
router.post("/forget-password",userController.forget_password)
router.get("/reset-password",userController.reset_password)


//======================= twitter Route ====================================//

router.post("/twitter", mid.authenticate, mid.authorisation,twitterController.createTwitter)
router.get("/gettwitter",twitterController.getTwitter)
router.post("/:userId/follow", mid.authenticate, mid.authorisation,twitterController.followUser)
router.post("/:userId/unfollow", mid.authenticate, mid.authorisation, twitterController.unfollowUser)
router.get("/searchTweets", twitterController.searchUser)
router.get("/paginateTweets", twitterController.paginateTweet)




module.exports = router