const express = require('express');
const router = express.Router();
const User = require('../models/userModel');

router.get('/', (req, res) => {
    res.render('discover/discoverPage');
});

router.post('/', (req, res) => {
    res.send(req.body.user);
});

module.exports = router;
