const bcrypt = require('bcryptjs');
var express = require('express');
const User = require('../model/User');
const { registerValidation, loginValidation } = require('../validation/validation');
var router = express.Router();


/* POST /api/register listing. */
router.post('/api/register',  async(req, res, next) => {

  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  let email = req.body.email;
  let password = req.body.password;

  const { error } = registerValidation(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  const emailExist = await User.findOne({ email: email });
  if (emailExist) {
    return res.status(409).send("E-mail already exsits.");
  }

  const hashPassword = await bcrypt.hash(password, 8);

  const user = new User({
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: hashPassword
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
