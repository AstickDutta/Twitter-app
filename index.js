const express = require('express');
const cors = require("cors")
const route = require('./route/router.js');
const mongoose = require('mongoose');
const app = express();
app.use(express.json());
require("dotenv").config();

app.get("/", (req, res) => {
    res.send("hii from server")
})

app.use(express.json());
app.use(cors())


app.use("/", route)

const port = process.env.PORT || 5000;
const uri = process.env.ATLAS_URI;



app.listen(port, (req, res) => {
  console.log(`your server is successfully connected on port : ${port}`);
});

mongoose
.connect(uri, {
  useNewUrlParser: true,
  })
  .then(() => console.log("MongoDB connection establish"))
  .catch((err) => console.log("mongodb connection failed: ", err.message));
  