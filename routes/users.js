var express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../model/User');
const Category = require('../model/Category');
const { requireAuth, checkUser } = require('../middleware/authMiddleware');
const { categoryValidation } = require('../validation/validation');
var router = express.Router();

router.get('*', checkUser);

/* GET profile details after logged in. */
router.get('/profile', requireAuth, (req, res) => {
  res.render('profile');
})

/* GET library details from MongoDB. */
router.get('/library', requireAuth, (req, res) => {
  Category.find(function (err, content) {
    if (content) {
      res.render('books', {
        contents: content,
        message: req.flash('message')
      });
    } else {
      console.log(err);
    }
  });
});

/* POST Category details into MongoDB. */
router.post('/category', requireAuth, async (req, res) => {
  const categoryId = req.body.categoryId;
  const categoryName = req.body.categoryName;

  // Checks for the category validation.
  const { error } = categoryValidation(req.body);
  if (error) {
    req.flash('message', error.details[0].message);
    res.redirect('/users/library');
  }

  // Check if categoryId exists in DB.
  const categoryIdExist = await Category.findOne({ categoryId: categoryId });
  if (categoryIdExist) {
    req.flash('message', 'Book with this Category already exists.');
    res.redirect('/users/library');
  } else {

    const category = new Category({
      categoryId: categoryId,
      categoryName: categoryName
    });

    try {
      const savedCategory = await category.save();
      // res.send({ categoryId: category._id, categoryId: category.categoryId, categoryName: category.categoryName });
      // res.render('profile');
      res.redirect('/users/library');
    } catch (error) {
      console.log(error);
    }
  }


});

module.exports = router;