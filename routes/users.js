var express = require('express');
const User = require('../model/User');
var router = express.Router();

/* POST /api/register listing. */
router.post('/api/register',  async(req, res, next) => {
  const user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password
  });

  try {
    const savedUser = await user.save();
    res.send(savedUser);
  } catch (error) {
    next();
  }
  
});

/* POST /api/login listing. */
router.post('/api/login', function(req, res, next) {
  res.send('Login');
});

module.exports = router;
