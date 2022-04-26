var express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../model/User');
const { requireAuth, checkUser } = require('../middleware/authMiddleware');
var router = express.Router();

router.get('*', checkUser);

/* GET profile after logged in. */
router.get('/profile', requireAuth, (req, res) => {
  res.render('profile')
});

module.exports = router;