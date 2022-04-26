const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET /register listing. */
router.get('/register', function (req, res, next) {
  res.render('register', { title: 'Library MS | Register' });
});

/* GET /login listing. */
router.get('/login', function (req, res, next) {
  res.render('login', { title: 'Library MS | Login' });
});

module.exports = router;
