const express = require("express");
const User = require("../models/userModel");
const catchAsync = require('../utils/catchAsync');
const router = express.Router();

router.get("/", catchAsync( async (req, res) => {
    const users = await User.find({});
    res.render("users/users", { users });
}));

router.get("/:id", catchAsync( async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    res.render("users/userPage", { user });
}));

router.get("/:id/edit", catchAsync( async (req, res) => {
    const user = await User.findById(req.params.id);
    res.render("users/edit", { user });
}));

router.put("/:id", catchAsync( async (req, res) => {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, { ...req.body.user });
    res.render("users/userPage", { user });
}));

router.delete("/:id", catchAsync( async (req, res) => {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    res.redirect("/users");
}));

module.exports = router;