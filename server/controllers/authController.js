const User = require("../models/User");
const authController = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const City = require("../models/City");

const cities = [
  { cityName: "Chennai" },
  { cityName: "Bangalore" },
  { cityName: "Hyderabad" },
  { cityName: "Coimbatore" },
  { cityName: "Mysore" },
];
const CLIENT_URL = "http://http://localhost:3000";

authController.post("/register", async (req, res) => {
  try {
    const { username, email, city, password } = req.body;
    const check = await User.findOne({ email });
    if (check) {
      return res.status(400).json({
        message: "This email already Exist, Try a differetn email address",
      });
    }
    const cryptePassword = await bcrypt.hash(password, 12);
    const user = await new User({
      username,
      email,
      city,
      password: cryptePassword,
    }).save();
    res.send({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
      message: "Register Successfull",
    });
  } catch (error) {
    return res.status(500).json(error.message);
  }
});
authController.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Could not find User",
      });
    }
    const check = await bcrypt.compare(password, user.password);
    if (!check) {
      return res.status(400).json({
        message: "Incorrect Password,Please try again",
      });
    }
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    res.send({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
      token: "Bearer " + token,
      message: "Logged in Successfully",
    });
  } catch (error) {
    return res.status(500).json(error.message);
  }
});
authController.post("/cities", async (req, res) => {
  try {
    await City.deleteMany({});
    const createCities = await City.insertMany(cities);
    res.send({ createCities });
  } catch (error) {
    console.error("Error adding cities:", error);
    res.status(500).send("An error occurred while adding cities.");
  }
});
authController.get("/user/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId).populate("city");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error retrieving user:", error);
    res.status(500).send("An error occurred while retrieving the user.");
  }
});
authController.get("/getAllCities", async (req, res) => {
  try {
    const cities = await City.find({});
    res.status(200).json(cities);
  } catch (error) {
    res.status(500).send("An error occurred while retrieving the Cities.");
  }
});

authController.get("/login/success/:token", (req, res) => {
  const token = req.params.token;

  if (req.user) {
    res.status(200).json({
      error: false,
      message: "Successfully Login",
      user: req.user,
    });
  } else {
    res.status(403).json({ erro: true, message: "Not Authorizes" });
  }
});

authController.get("/login/faild", (req, res) => {
  res.status(401).json({
    error: true,
    message: "failed",
  });
});

authController.get("/callback", passport.authenticate("google"), (req, res) => {
  if (req.user) {
    const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET);
    res.status(200).json({
      error: false,
      message: "Successfully Login",
      user: req.user,
      token: token,
    });
    // res.redirect(`/auth/login/success/${token}`);
  } else {
    res.redirect("/login/faild");
  }
});

authController.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

authController.get("/logout", (req, res) => {
  req.logout();
  res.redirect(CLIENT_URL);
});
module.exports = authController;
