var express = require('express');
const authController = require('../controller/authcontroller');
var router = express.Router();

/* POST user register. */
router.post('/register', authController.register);

/* POST user login. */
router.post('/login', authController.login);

/* GET profile logout. */
router.get('/logout', authController.logout);

module.exports = router;