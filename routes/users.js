const bcrypt = require('bcryptjs');
var express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../model/User');
const verify = require('./verifyToken');
const authController = require('../controller/auth');
const { registerValidation, loginValidation } = require('../validation/validation');
var router = express.Router();


/* POST /api/register listing. */
router.post('/api/register',  authController.register); 



/* POST /api/login listing. */
router.post('/api/login', async(req, res, next) => {
  
  // Checks for the validation.
  const { error } = loginValidation(req.body);
  if (error) {
    return res.render('login', {
      title: 'Library MS | Login',
      error: error.details[0].message
    })
  } 
  // Check if email exists in DB.
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.render('login', {
      title: 'Library MS | Login',
      message: 'Email is not registered.'
    })
  }
  
  // Check if password is correct.
  const validPassword = await bcrypt.compare(req.body.password, user.password)
  if (!validPassword) {
    return res.render('login', {
      title: 'Library MS | Login',
      passMessage: 'Inavlid Password or Email.'
    })
  }

  const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET)
  res.header('auth-token', token).redirect('/posts');

});

module.exports = router;
