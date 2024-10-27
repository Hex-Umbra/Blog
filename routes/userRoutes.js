const express = require("express");
const router = express.Router();
const userModel = require("../models/userModel");

//Routes
const isAuthenticated = (req, res, next) => {
  if (req.session.user_id) {
    return next();
  } else {
    res.status(401).json({ message: "Please log in to continue" });
  }
};

//Get route to get all users

//Registering route for a new user, by checking the e-mail address we verify the user doesn't exist in our DB and add it as a new user.
router.post("/register", async (req, res) => {
  try {
    const { username, password, email, role } = req.body;
    const existingUser = await userModel.findOne({
      $or: [{ email }, { username }],
    });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const user = await new userModel({ username, password, role, email });
    await user.save();
    req.session.user_id = user._id;
    res
      .status(200)
      .json({ message: `User ${username} have been created successfully` });
  } catch (error) {
    console.error(`Registration failed : ${error}`);

    res.status(500).json({ message: "Internal Server Error" });
  }
});

//Logging-in Route, if the the user exists in the DB they can login using the e-mail address and their corresponding password.
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }
    const user = await userModel.authenticate(email, password);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    req.session.user_id = user._id;
    res.status(200).json({
      message: `User ${user.username} have been logged in successfully`,
    });
  } catch (error) {
    console.error(`Login failed : ${error}`);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
//Logging-out Route
router.post("/logout", (req, res) => {
  req.session.destroy();
  res.status(200).json({ message: "User logged out successfully" });
});

//Delete route for the user or admin.  This route is protected by a token.
//The user can delete its own profile but not other users profile
//While the admin can delete any user profile
router.delete("/user/:id", async (req, res) => {
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

//
router.get("/profile", isAuthenticated, async (req, res) => {
  try {
    const user = await userModel
      .findById(req.session.user_id)
      .select("-password");
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Functions

module.exports = router;
