const express = require('express');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const router = express.Router();

router.get('/', catchAsync( async (req, res) => {
    const users = await User.find({});
    res.render('chats/chatsPage', { users });
}));

module.exports = router;
