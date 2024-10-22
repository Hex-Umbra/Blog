const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const token = require("jsonwebtoken");

//Routes

//Get route to get all users
router.get("/admin/users",async(req,res) =>{
  try {const authHeader
})

//Registering route for a new user, by checking the e-mail address we verify the user doesn't exist in our DB and add it as a new user.
//The password is encrypted by bcrypt with genSalt & hashSync for user security.
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

//Logging-in Route, if the the user exists in the DB they can login using the e-mail address and their corresponding password.
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (user) {
    //After logging in we decrypt the password and compare it with the one the user entered.
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      //If the password is correct we generate a token and send it back to the user.
      const cookieToken = token.sign(
        { role: user.role },
        process.env.JWT_SECRET
      );
      //We send the token into an HTTP cookie, with some security mesures.
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

//Delete route for the user or admin.  This route is protected by a token.
//The user can delete its own profile but not other users profile
//While the admin can delete any user profile
router.delete("/user/:id", verifyToken, async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await userModel.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User  not found" });
    } else {
      if (decoded.role === "admin" || decoded.role) {
        await userModel.findByIdAndDelete(userId);
        res.status(200);
      }
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: `Oops Looks like something went wrong :${error}` });
  }
});

//Functions
//Function to verify who has authorisation by checking the token.
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
    next();
  });
}

module.exports = router;
