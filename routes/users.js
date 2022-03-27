var express = require('express');
var router = express.Router();

/* POST /api/register listing. */
router.post('/api/register', function(req, res, next) {
  res.send('Register');
});

/* POST /api/login listing. */
router.post('/api/login', function(req, res, next) {
  res.send('Login');
});

module.exports = router;
