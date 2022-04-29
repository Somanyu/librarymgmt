var express = require('express');
const { requireAuth, checkUser } = require('../middleware/authMiddleware');
const { categoryValidation, publicationValidation } = require('../validation/validation');
const Category = require('../model/Category');
const Publication = require('../model/Publication');
var router = express.Router();

router.get('*', checkUser);

/* GET Category details after logged in. */
router.get('/category', requireAuth, (req, res) => {
    Category.find(function (err, content) {
        if (content) {
            res.render('categories', {
                title: 'Library | Category',
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
        res.redirect('/library/category');
    }

    // Check if categoryId and categoryName exists in DB.
    const categoryIdExist = await Category.findOne({ categoryId: categoryId, categoryName: categoryName });
    const categoryNameExist = await Category.findOne({ categoryName: categoryName });
    if (categoryIdExist) {
        req.flash('message', 'Book with this Category already exists.');
        res.redirect('/library/category');
    } else if (categoryNameExist) {
        req.flash('message', 'Book with this Category already exists.');
        res.redirect('/library/category');
    }
    else {

        const category = new Category({
            categoryId: categoryId,
            categoryName: categoryName
        });

        try {
            const savedCategory = await category.save();
            // res.send({ categoryId: category._id, categoryId: category.categoryId, categoryName: category.categoryName });
            // res.render('profile');
            res.redirect('/library/category');
        } catch (error) {
            console.log(error);
        }
    }

});


/* GET Publication details after logged in. */
router.get('/publication', requireAuth, (req, res) => {
    Publication.find(function (err, content) {
        if (content) {
            res.render('publications', {
                title: 'Library | Publication',
                contents: content,
                message: req.flash('message')
            });
        } else {
            console.log(err);
        }
    });
});

/* POST Publication details into MongoDB. */
router.post('/publication', requireAuth, async (req, res) => {
    const publicationId = req.body.publicationId;
    const publicationName = req.body.publicationName;

    // Checks for the publication validation.
    const { error } = publicationValidation(req.body);
    if (error) {
        req.flash('message', error.details[0].message);
        res.redirect('/library/publication');
    }

    // Check if publicationId and publicationName exists in DB.
    const publicationIdExist = await Publication.findOne({ publicationId: publicationId, publicationName: publicationName });
    const publicationNameExist = await Publication.findOne({ publicationName: publicationName });
    if (publicationIdExist) {
        req.flash('message', 'Book with this publication already exists.');
        res.redirect('/library/publication');
    } else if (publicationNameExist) {
        req.flash('message', 'Book with this publication already exists.');
        res.redirect('/library/publication');
    }
    else {

        const publication = new Publication({
            publicationId: publicationId,
            publicationName: publicationName
        });

        try {
            const savedPublication = await publication.save();
            // res.send({ categoryId: category._id, categoryId: category.categoryId, categoryName: category.categoryName });
            // res.render('profile');
            res.redirect('/library/publication');
        } catch (error) {
            console.log(error);
        }
    }

});

module.exports = router;