const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('log-reg/login');
});

module.exports = router;