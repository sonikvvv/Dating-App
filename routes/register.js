const express = require('express');
const router = express.Router();
const User = require('../models/userModel');

router.get('/', (req, res) => {
    res.render('log-reg/register');
});

router.post('/', async (req, res) => {
    const user = new User({ ...req.body.user });
    user.save();
    res.redirect(`/users/${user._id}`);
});

module.exports = router;
