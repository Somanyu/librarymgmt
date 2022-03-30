const bcrypt = require('bcryptjs');
var express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../model/User');
const verify = require('./verifyToken');
const authController = require('../controller/auth');
const { registerValidation, loginValidation } = require('../validation/validation');
var router = express.Router();


/* POST /api/register listing. */
router.post('/api/register', authController.register);

/* POST /api/login listing. */
router.post('/api/login', authController.login);

/* GET profile after logged in. */
router.get('/profile', verify, (req, res) => {
  User.findOne({_id: req.user})
  res.render('profile')
});

/* GET profile logout. */
router.get('/logout', authController.logout);

module.exports = router;
