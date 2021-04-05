const express = require('express');
const router = express.Router();
const User = require('../models/userModel');

router.get('/', async (req, res) => {
    const users = await User.find({});
    res.render('chats/chatsPage', { users });
});

module.exports = router;
