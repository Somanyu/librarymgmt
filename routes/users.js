var express = require('express');
var router = express.Router();

/* GET /register listing. */
router.get('/api/register', function(req, res, next) {
  res.render('register', { title: 'Library MS | Register' });
});

module.exports = router;
