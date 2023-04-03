const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: 3,
      maxlength: 20,
    },

    email: {
        type: String,
        required:true,
        unique: true,
    },
    
    password: {
      type: String,
      required: true,
    },

    tweets: [{ type: Schema.Types.ObjectId, ref: "Tweet" }],

    following: [{ type: Schema.Types.ObjectId, ref: "User" }],

    followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);


