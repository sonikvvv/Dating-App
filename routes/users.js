const express = require("express");
const { isError } = require("joi"); //? do we use it
const User = require("../models/userModel");
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { userSchema, registerSchema } = require("../utils/validationSchemas");
const router = express.Router();
const passport = require('passport');

const validateUser = (req, res, next) => {
    const { error } = userSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((el) => el.message).join(', ');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

const validateRegister = (req, res, next) => {
    const { error } = registerSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((el) => el.message).join(", ");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

router.get("/", catchAsync( async (req, res) => {
    const users = await User.find({});
    res.render("users/users", { users });
}));

router.get("/login", (req, res) => {
    res.render("log-reg/login");
});

router.post("/login", passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    res.send(req.body.user);
});

router.get("/register", (req, res) => {
    res.render("log-reg/register");
});

router.post(
    "/register",
    validateRegister,
    catchAsync(async (req, res) => { // TODO: wrap with try catch
        try {
            const { email, username, password } = req.body.user;
            const user = new User({ email, username });
            const registeredUser = await User.register(user, password);
            res.redirect(`/users/${user._id}`);
        } catch (e) {
            req.flash('error', e.message);
            res.redirect('users/register');
        }
    })
);

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