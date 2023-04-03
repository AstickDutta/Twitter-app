const userModel = require("../models/UserModel");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const randomstring = require("randomstring");

const registerUser = async (req, res) => {
  try {
    let data = req.body;
    let { username, email, password } = data;

    let user = await userModel.findOne({ email });
    if (user)
      return res
        .status(400)
        .send({ message: "Opps user with this email is already exist..." });

    if (!username || !email || !password)
      return res.status(400).send({ message: "All fields are required..." });

    if (!validator.isEmail(email))
      return res
        .status(400)
        .send({ message: "Oh Noo..!! Email must be a valid email..." });

    if (!validator.isStrongPassword(password))
      return res
        .status(400)
        .send({ message: "Oh Noo.! Password must be a strong passsword..." });

    const salt = await bcrypt.genSalt(10);
    data.password = await bcrypt.hash(data.password, salt);

    //now create the user:-
    let savedData = await userModel.create(data);
    return res
      .status(201)
      .send({ status: true, message: "created successfully", data: savedData });
  } catch (error) {
    res.status(500).send({ status: false, message: error.message });
  }
};

const loginUser = async function (req, res) {
  try {
    let data = req.body;
    let { email, password } = data;

    if (!email || !password)
      return res.status(400).send({ message: "All fields are required..." });

    if (!validator.isEmail(email))
      return res
        .status(400)
        .send({ message: "Oh Noo..!! Email must be a valid email..." });

    let checkEmail = await userModel.findOne({ email: email });
    if (!checkEmail) {
      return res
        .status(401)
        .send({ status: false, message: "Email Is incorrect!" });
    }

    if (!validator.isStrongPassword(password))
      return res
        .status(400)
        .send({ message: "Oh Noo.! Password must be a strong passsword..." });

    let encryptPwd = checkEmail.password;

    await bcrypt.compare(password, encryptPwd, function (err, result) {
      if (result) {
        let token = jwt.sign(
          { _id: checkEmail._id.toString() },
          process.env.JWT_SECRET_KEY,
          {
            expiresIn: "72h",
          }
        );
        // res.setHeader("x-api-key", token);

        return res.status(201).send({
          status: true,
          message: "User login successfull",
          data: { userId: checkEmail._id, token: token },
        });
      } else {
        return res
          .status(401)
          .send({ status: false, message: "Invalid password!" });
      }
    });
  } catch (err) {
    res.status(500).send({ staus: false, message: err.message });
  }
};



const getUser = async function (req, res) {
  try {
    const users = await userModel.find();
    return res.status(200).send(users);
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const sendresetPasswordMail = async (name, email, token) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: "astickdutta12@gmail.com",
        pass: "", //please put your own password
      },
    });

    const mailOptions = {
      from: "astickdutta12@gmail.com",
      to: email,
      subject: "For reset password",
      html:
        "<p>  hi " +
        name +
        ' ,please copy the link and <a href="http://127.0.0.1:3000/api/reset-password?token=' +
        token +
        '"> reset your password </a>',
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Mail has been sent :-", info.response);
      }
    });
  } catch (err) {
    return res.status(400).send({ status: false, message: err.message });
  }
};

const forget_password = async (req, res) => {
  try {
    let data = req.body;
    let { email } = data;
    if (Object.keys(data).length == 0)
      return res
        .status(400)
        .send({ status: false, message: "plss put some data in the body" });

        if (!validator.isEmail(email))
        return res
          .status(400)
          .send({ message: "Oh Noo..!! Email must be a valid email..." });

    const userdata = await userModel.findOne({ email });

    if (userdata) {
      const randomString = randomstring.generate();
      const newdata = await userModel.updateOne(
        { email },
        { $set: { token: randomString } }
      );
      sendresetPasswordMail(userdata.Name, userdata.email, randomString);

      res
        .status(200)
        .send({
          status: true,
          message: "please check your email and reset the password",
        });
    } else {
      return res
        .status(404)
        .send({ status: true, message: "this email does not exist" });
    }
  } catch (error) {
    return res.status(400).send({ status: false, message: error.message });
  }
};

const reset_password = async (req, res) => {
  try {
    const token = req.query.token;
    const tokenData = await userModel.findOne({ token: token });
    const password = req.body.password;

    if (!validator.isStrongPassword(password))
      return res
        .status(400)
        .send({ message: "Oh Noo.! Password must be a strong passsword..." });

    if (tokenData) {
      //-------------------password hashing-------------------
      const hashPassword = await bcrypt.hash(password, 10);

      const userData = await userModel.findByIdAndUpdate(
        { _id: tokenData._id },
        { $set: { password: hashPassword, token: "" } },
        { new: true }
      );

      return res
        .status(200)
        .send({
          status: true,
          message: "user password has been reset",
          data: userData,
        });
    } else {
      return res
        .status(400)
        .send({ status: false, message: "this link is wrong or expired" });
    }
  } catch (error) {
    return res.status(400).send({ status: false, message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUser,
  reset_password,
  forget_password,
};
