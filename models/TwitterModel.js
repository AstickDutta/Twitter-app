const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tweetSchema = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    
    text: {
      type: String,
      required: true,
      maxlength: 280,
    },

    hashtag:{
      type:String
    }
  },
  
  { timestamps: true }
);

module.exports = mongoose.model("Tweet", tweetSchema);


