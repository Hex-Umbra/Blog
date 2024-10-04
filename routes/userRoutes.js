const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const token = require("jsonwebtoken");

//Routes
router.post("/register", async (req, res) => {
  try {
    const newUser = req.body;
    const emailExist = await userModel.findOne({ email: newUser.email });
    if (emailExist) {
      console.log(emailExist);

      res
        .status(400)
        .json({ message: `This Email is already in use: ${newUser.email}` });
    } else {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(newUser.password, salt);
      newUser.password = hash;
      await userModel.create(newUser);
      res
        .status(200)
        .json({ message: `All is good ${newUser.username} has been created` });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: `Oops Looks like something went wrong :${error}` });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (user) {
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const cookieToken = token.sign(
        { role: user.role },
        process.env.JWT_SECRET
      );
      res
        .cookie("token", cookieToken, {
          httpOnly: true,
          secure: false,
          sameSite: "none",
          maxAge: 60 * 60 * 1000,
        })
        .json({ message: "Connection Successful" });
    } else res.json({ message: "Email or password incorrect" });
  } else res.status(400).json({ message: "This user does not exist" });
});
router.delete("/user/:id", verifyToken, async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await userModel.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User  not found" });
    } else {
      if(decoded.role === "admin" || decoded.role){
        await userModel.findByIdAndDelete(userId);
        res.status(200)
      } 
    }
  } catch (error) {
    res.status(500).json({ message: `Oops Looks like something went wrong :${error}` });
  }
});

//Functions
function verifyToken(req, res, next) {
  const userToken = req.cookies.token;
  if (!userToken) {
    return res
      .status(401)
      .json({ message: "Please login to access this route" });
  }
  token.verify(userToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = decoded;
    next()
  });
}

module.exports = router;
