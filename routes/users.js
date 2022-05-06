var express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../model/User');
const Category = require('../model/Category');
const { requireAuth, checkUser } = require('../middleware/authMiddleware');
const { categoryValidation } = require('../validation/userValidation');
var router = express.Router();

router.get('*', checkUser);

/* GET profile details after logged in. */
router.get('/profile', requireAuth, (req, res) => {
  res.render('profile');
})


module.exports = router;