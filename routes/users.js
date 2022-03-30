var express = require('express');
const User = require('../model/User');
const verify = require('./verifyToken');
const authController = require('../controller/auth');
var router = express.Router();


/* POST /api/register listing. */
router.post('/api/register', authController.register);

/* POST /api/login listing. */
router.post('/api/login', authController.login);

/* GET profile after logged in. */
router.get('/profile', verify, (req, res) => {
  User.findOne((err, user) => {
    if(!err) {
      console.log(user);
      res.render('profile', {
        user: user
      });
    } else {
      console.log(err);
    }
  })
});

/* GET profile logout. */
router.get('/logout', authController.logout);

module.exports = router;
