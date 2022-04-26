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
        contents: content
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
    res.render('books', {
      title: 'Library Books',
      error: error.details[0].message,
    });
  }

  // Check if categoryId exists in DB.
  const categoryIdExist = await Category.findOne({ categoryId: categoryId });
  if (categoryIdExist) {
    res.render('books', {
      title: 'Library Books',
      bookError: 'Book with this Category already exists.'
    })
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