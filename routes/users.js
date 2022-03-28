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

  // Checks for the validation.
  const { error } = registerValidation(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  // Check if email exists in DB.
  const emailExist = await User.findOne({ email: email });
  if (emailExist) {
    return res.status(409).send("E-mail already exsits.");
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
    res.send({ user: user._id, firstName: user.firstName, lastName: user.lastName });
  } catch(err) {
    console.log(err);
  }

});


/* POST /api/login listing. */
router.post('/api/login', async(req, res, next) => {
  
  // Checks for the validation.
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Check if email exists in DB.
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(409).send("E-mail doesn't exist.");
  }
  
  // Check if password is correct.
  const validPassword = await bcrypt.compare(req.body.password, user.password)
  if (!validPassword) return res.status(400).send('Invalid Password');

  res.send({ firstName: user.firstName });

});

module.exports = router;
