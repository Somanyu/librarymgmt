var express = require('express');
const User = require('../model/User');
const Joi = require('joi');
var router = express.Router();
const { registerValidation, loginValidation } = require('../validation/validation');


/* POST /api/register listing. */
router.post('/api/register',  async(req, res, next) => {

  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  let email = req.body.email;
  let password = req.body.password;

  const { error } = registerValidation(req.body);
  if(error) return res.status.send(error);

  const user = new User({
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: password
  });
  try {
    const savedUser = await user.save();
    res.send('User saved in database');
  } catch(err) {
    console.log(err);
  }

});

/* POST /api/login listing. */
router.post('/api/login', function(req, res, next) {
  res.send('Login');
});

module.exports = router;
