const express = require("express");
const router = express.Router();
const User = require("../models/userModel");

router.get("/", async (req, res) => {
    const users = await User.find({});
    res.render("users/users", { users });
});

router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    res.render("users/userPage", { user });
});

router.get("/:id/edit", async (req, res) => {
    const user = await User.findById(req.params.id);
    res.render("users/edit", { user });
});

router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, { ...req.body.user });
    res.render("users/userPage", { user });
});

router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    res.redirect("/users");
});

module.exports = router;