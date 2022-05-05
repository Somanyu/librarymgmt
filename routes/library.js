var express = require('express');
const { requireAuth, checkUser } = require('../middleware/authMiddleware');
const { categoryValidation, publicationValidation } = require('../validation/validation');
const Category = require('../model/Category');
const Publication = require('../model/Publication');
const Book = require('../model/Book');
var router = express.Router();
const mongoose = require('mongoose');

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
    const categoryIdExist = await Category.findOne({ categoryId: categoryId });
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
    const publicationIdExist = await Publication.findOne({ publicationId: publicationId });
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
            res.redirect('/library/publication');
        } catch (error) {
            console.log(error);
        }
    }

});

/* GET Book details after logged in. */
router.get('/books', requireAuth, (req, res) => {
    Promise.all([Category.find(), Publication.find(), Book.find().populate('publicationId').populate('categoryId')]).then(([catResult, pubResult, bookResult]) => {
        // Retrieving data as catResult and pubResult
        console.log(bookResult);
        console.log(catResult);
        res.render('books', {
            title: 'Library | Books',
            catResult: catResult,
            pubResult: pubResult,
            bookResult: bookResult
        });
    }).catch(err => {
        console.log(err);
        res.sendStatus(500);
    })
});

/* POST Book details after logged in. */
router.post('/books', requireAuth, async (req, res) => {

    const ISBN = req.body.ISBN;
    const bookTitle = req.body.bookTitle;
    const publicationYear = req.body.publicationYear;
    const categoryId = req.body.categoryId;
    const language = req.body.language;
    const publicationId = req.body.publicationId;
    const noCopies = req.body.noCopies;
    const currentCopies = req.body.currentCopies;
    const bookInfo = req.body.bookInfo;

    const catId = await Category.findOne({ categoryId: categoryId });
    const pubId = await Publication.findOne({ publicationId: publicationId });

    // console.log("ISBN: " + ISBN);
    // console.log("Book Title: " + bookTitle)
    // console.log("Publication Year: " + publicationYear)
    // console.log("Category: " + catId._id)
    // console.log("Language: " + language)
    // console.log("Publication: " + pubId._id)
    // console.log("Number of Copies: " + noCopies)
    // console.log("Current Copies: " + currentCopies)
    // console.log("Book Info: " + bookInfo);

    
    const book = new Book({
        ISBN: ISBN,
        bookTitle: bookTitle,
        publicationYear: publicationYear,
        categoryId: catId._id,
        language: language,
        publicationId: pubId._id,
        noCopies: noCopies,
        currentCopies: currentCopies,
        bookInfo: bookInfo,
    });


    try {
        const savedBook = await book.save();
        console.log(savedBook);
        res.redirect('/library/books');
    } catch (error) {
        console.log(error);
    }


})

module.exports = router;