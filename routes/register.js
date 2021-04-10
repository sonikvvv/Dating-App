const express = require('express');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('log-reg/register');
});

router.post('/', catchAsync( async (req, res) => {
    const user = new User({ ...req.body.user });
    user.save();
    res.redirect(`/users/${user._id}`);
}));

module.exports = router;
