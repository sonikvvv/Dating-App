const express = require("express");
const router = express.Router();
const User = require("../utils/models/userModel");
const catchAsync = require("../utils/catchAsync");
const passport = require("passport");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });
const { isLoggedIn } = require("../utils/middleware");

router.get("/", isLoggedIn, catchAsync(async (req, res) => {
    const user = await User.findById(req.user._id).populate('images');
    res.render("users/settings/settings", { user });
}));

router.get("/filter/edit", isLoggedIn, (req, res) => {
    res.render("users/settings/filter");
});

router.post(
    "/filter",
    isLoggedIn,
    catchAsync(async (req, res) => {
        const user = req.user;
        user.filter = req.body.filter;

        await User.findByIdAndUpdate(user._id, { ...user });
        res.redirect("/users/discover");
    })
);

module.exports = router;
