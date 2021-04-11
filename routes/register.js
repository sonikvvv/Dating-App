const express = require('express');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { registerSchema } = require('../utils/validationSchemas');
const router = express.Router();

const validateRegister = (req,res, next) => {
    const { error } = registerSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((el) => el.message).join(', ');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

router.get('/', (req, res) => {
    res.render('log-reg/register');
});

router.post('/', validateRegister, catchAsync( async (req, res) => {
    const user = new User({ ...req.body.user });
    user.save();
    res.redirect(`/users/${user._id}`);
}));

module.exports = router;
