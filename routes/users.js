const express = require("express");
const User = require("../models/userModel");
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { userSchema } = require('../utils/validationSchemas');
const router = express.Router();

const validateUser = (req, res, next) => {
    const { error } = userSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((el) => el.message).join(', ');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

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

router.put("/:id", validateUser, catchAsync( async (req, res) => {
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