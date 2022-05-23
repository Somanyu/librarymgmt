var express = require('express');
const { requireAuth, checkUser } = require('../middleware/authMiddleware');
const { categoryValidation, publicationValidation, bookValidation } = require('../validation/libraryValidation');
const Category = require('../model/Category');
const Publication = require('../model/Publication');
const Book = require('../model/Book');
var router = express.Router();
const mongo = require('mongodb');
const multer = require('multer')

router.get('*', checkUser);

/* GET Category details after logged in. */
router.get('/category', requireAuth, (req, res) => {

    Promise.all([Category.find().populate('books')]).then(([content]) => {
        console.log(content);
        res.render('categories', {
            title: 'Library | Category',
            contents: content,
            message: req.flash('message')
        });
    }).catch(err => {
        console.log(err);
        res.sendStatus(500);
    })

    // Category.find(function (err, content) {
    //     if (content) {
    //         console.log(content);
    //         res.render('categories', {
    //             title: 'Library | Category',
    //             contents: content,
    //             message: req.flash('message')
    //         });
    //     } else {
    //         console.log(err);
    //     }
    // }).populate("books");
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

    const c = await Category.find().populate('books');
    console.log('Categories: ', c);

});


/* GET Publication details after logged in. */
router.get('/publication', requireAuth, (req, res) => {

    Promise.all([Publication.find().populate('books')]).then(([content]) => {
        console.log(content);
        res.render('publications', {
            title: 'Library | Publication',
            contents: content,
            message: req.flash('message')
        });
    }).catch(err => {
        console.log(err);
        res.sendStatus(500);
    })

    // Publication.find(function (err, content) {
    //     if (content) {
    //         res.render('publications', {
    //             title: 'Library | Publication',
    //             contents: content,
    //             message: req.flash('message')
    //         });
    //     } else {
    //         console.log(err);
    //     }
    // }).populate({
    //     path: "books",
    // });
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

    const p = await Publication.find();
    console.log('Publication: ', p);

});

/* GET Book details after logged in. */
router.get('/books', requireAuth, (req, res) => {
    Promise.all([Category.find(), Publication.find(), Book.find().populate('publicationId').populate('categoryId')]).then(([catResult, pubResult, bookResult]) => {
        // Retrieving data as catResult and pubResult
        // console.log(bookResult);
        // console.log(catResult);
        res.render('library', {
            title: 'Library | Books',
            catResult: catResult,
            pubResult: pubResult,
            bookResult: bookResult,
            message: req.flash('message')
        });
    }).catch(err => {
        console.log(err);
        res.sendStatus(500);
    })
});


// Define storage for images.
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './public/uploads/books');
    },

    // Add file extension to the uploaded image.
    filename: function (req, file, callback) {
        callback(null, Date.now() + file.originalname);
    },
});

// Parameters for multer
const upload = multer({
    storage: storage,
    limits: {
        fieldSize: 1024 * 1024 * 3,
    },
});

/* POST Book details after logged in. */
router.post('/books', requireAuth, upload.single('bookImage'), async (req, res) => {

    const ISBN = req.body.ISBN;
    const bookTitle = req.body.bookTitle;
    const publicationYear = req.body.publicationYear;
    const author = req.body.author
    const categoryId = req.body.categoryId;
    const language = req.body.language;
    const publicationId = req.body.publicationId;
    const noCopies = req.body.noCopies;
    const currentCopies = req.body.currentCopies;
    const bookInfo = req.body.bookInfo;
    const bookImage = req.file.filename;

    const { error } = bookValidation(req.body);
    if (error) {
        req.flash('message', error.details[0].message);
        res.redirect('/library/books')
    }

    const bookExist = await Book.findOne({ ISBN: ISBN });
    if (bookExist) {
        req.flash('message', 'Book with this ISBN already exists.');
        res.redirect('/library/books');
    } else {

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
            author: author,
            publicationYear: publicationYear,
            categoryId: catId._id,
            language: language,
            publicationId: pubId._id,
            noCopies: noCopies,
            currentCopies: currentCopies,
            bookInfo: bookInfo,
            bookImage: bookImage
        });


        try {
            const savedBook = await book.save();

            // Pushing same categories book into array.
            catId.books.push(savedBook)
            await catId.save();

            // Pushing same categories book into array.
            pubId.books.push(savedBook)
            await pubId.save()

            console.log(savedBook);
            res.redirect('/library/books#bookSection');
        } catch (error) {
            console.log(error);
        }

    }

})

/* GET each book details after logged in. */
router.get('/books/:id', requireAuth, async (req, res) => {
    const bookDetails = await Book.findById(req.params.id).populate('publicationId').populate('categoryId')
    console.log(bookDetails);
    res.render('book', {
        bookDetails: bookDetails,
        title: bookDetails.bookTitle
    })
})

/* DELETE a Category from mongoDB Collection. */
router.get('/category/delete/:id', requireAuth, async (req, res) => {

    Promise.all([Category.deleteOne({ _id: new mongo.ObjectId(req.params.id) }).populate('books')]).then(([content]) => {
        console.log(content);
        res.redirect('/library/category');
    }).catch(err => {
        console.log(err);
        res.sendStatus(500);
    })
})

/* DELETE a Publication from mongoDB Collection. */
router.get('/publication/delete/:id', requireAuth, async (req, res) => {

    Promise.all([Publication.deleteOne({ _id: new mongo.ObjectId(req.params.id) }).populate('books')]).then(([content]) => {
        console.log(content);
        res.redirect('/library/publication');
    }).catch(err => {
        console.log(err);
        res.sendStatus(500);
    })
})

/* DELETE a Book from mongoDB Collection. */
router.get('/book/delete/:id', requireAuth, async (req, res) => {

    Promise.all([Book.deleteOne({ _id: new mongo.ObjectId(req.params.id) })]).then(([content]) => {
        console.log(content);
        res.redirect('/library/books#bookSection');
    }).catch(err => {
        console.log(err);
        res.sendStatus(500);
    })

})


/* UPDATE a existing Book. */
router.get('/book/edit/:id', requireAuth, async (req, res) => {

    Promise.all([Category.find(), Publication.find(), Book.findById(req.params.id).populate('publicationId').populate('categoryId')]).then(([catResult, pubResult, bookDetails]) => {
        // Retrieving data as catResult and pubResult
        // console.log(bookDetails);
        // console.log(catResult);
        res.render('bookEdit', {
            title: bookDetails.bookTitle,
            catResult: catResult,
            pubResult: pubResult,
            bookDetails: bookDetails
        });
    }).catch(err => {
        console.log(err);
        res.sendStatus(500);
    })
})

router.post('/book/edit/:id', requireAuth, async (req, res) => {
    const ISBN = req.body.ISBN;
    const bookTitle = req.body.bookTitle;
    const publicationYear = req.body.publicationYear;
    const author = req.body.author
    const categoryId = req.body.categoryId;
    const language = req.body.language;
    const publicationId = req.body.publicationId;
    const noCopies = req.body.noCopies;
    const currentCopies = req.body.currentCopies;
    const bookInfo = req.body.bookInfo;

    const { error } = bookValidation(req.body);
    if (error) {
        req.flash('message', error.details[0].message);
        res.redirect('/library/books')
    } else {

        const catId = await Category.findOne({ categoryId: categoryId });
        const pubId = await Publication.findOne({ publicationId: publicationId });

        const searchQuery = {
            ISBN: ISBN
        }

        const updatedBook = {
            $set: {
                bookTitle: bookTitle,
                publicationYear: publicationYear,
                author: author,
                categoryId: catId._id,
                language: language,
                publicationId: pubId._id,
                noCopies: noCopies,
                currentCopies: currentCopies,
                bookInfo: bookInfo
            }
        }

        Book.updateOne(searchQuery, updatedBook, function (err, res) {
            if (err) throw err;
            console.log("1 Document updated.");
        })
        res.redirect('/library/books')
    }

})


/* Issue a book to borrower. */
router.get('/issue', requireAuth, async (req, res) => {
    Promise.all([Book.find().populate('publicationId').populate('categoryId')]).then(([bookDetails]) => {
        // Retrieving data as catResult and pubResult
        // console.log(bookDetails);
        // console.log(catResult);
        res.render('issue', {
            title: 'Library | Issue',
            bookDetails: bookDetails
        });
    }).catch(err => {
        console.log(err);
        res.sendStatus(500);
    })
})

module.exports = router;