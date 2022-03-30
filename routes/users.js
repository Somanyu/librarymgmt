const bcrypt = require('bcryptjs');
var express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../model/User');
const verify = require('./verifyToken');
const { registerValidation, loginValidation } = require('../validation/validation');
var router = express.Router();


/* POST /api/register listing. */
router.post('/api/register',  async(req, res, next) => {

  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  // Checks for the validation.
  const { error } = registerValidation(req.body);
  if(error) {
    return res.render('register', {
      title: 'Library MS | Register',
      error: error.details[0].message
    });
  }
  // Check if email exists in DB.
  const emailExist = await User.findOne({ email: email });
  if (emailExist) {
    return res.render('register', { 
      title: 'Library MS | Register',
      message: 'Email already exists.' 
    })
  } else if (password != confirmPassword) {
    return res.render('register', {
      title: 'Library MS | Register',
      passMessage: 'Passwords should match.'
    })
  }

  // Hash the password
  const hashPassword = await bcrypt.hash(password, 8);

  const user = new User({
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: hashPassword
  });
  try {
    const savedUser = await user.save();
    // res.send({ user: user._id, firstName: user.firstName, lastName: user.lastName });
    res.render('login', {
      title: 'Library MS | Login',
    })
  } catch(err) {
    console.log(err);
  }

});


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
  res.header('auth-token', token).render('profile');

});

module.exports = router;
