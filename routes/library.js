var express = require('express');
const { requireAuth, checkUser } = require('../middleware/authMiddleware');
const { categoryValidation, publicationValidation, bookValidation } = require('../validation/libraryValidation');
const Category = require('../model/Category');
const Publication = require('../model/Publication');
const Book = require('../model/Book');
var router = express.Router();
const mongo = require('mongodb');
const multer = require('multer');
const Borrower = require('../model/Borrower');

router.get('*', checkUser);

/* GET Category details after logged in. */
router.get('/category', requireAuth, (req, res) => {

    Promise.all([Category.find().populate('books')]).then(([content]) => {
        // console.log(content);
        res.render('categories', {
            title: 'Library | Category',
            contents: content,
            message: req.flash('message')
        });
    }).catch(err => {
        console.log(err);
        res.sendStatus(500);
    })

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
    // console.log('Categories: ', c);

});


/* GET Publication details after logged in. */
router.get('/publication', requireAuth, (req, res) => {

    Promise.all([Publication.find().populate('books')]).then(([content]) => {
        // console.log(content);
        res.render('publications', {
            title: 'Library | Publication',
            contents: content,
            message: req.flash('message')
        });
    }).catch(err => {
        console.log(err);
        res.sendStatus(500);
    })

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
    // console.log('Publication: ', p);

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

            // console.log(savedBook);
            res.redirect('/library/books#' + bookTitle);
        } catch (error) {
            console.log(error);
        }

    }

})

/* GET each book details after logged in. */
router.get('/books/:id', requireAuth, async (req, res) => {
    const bookDetails = await Book.findById(req.params.id).populate('publicationId').populate('categoryId').populate('borrowers')
    // console.log(bookDetails);
    res.render('book', {
        bookDetails: bookDetails,
        title: bookDetails.bookTitle
    })
})

/* DELETE a Category from mongoDB Collection. */
router.get('/category/delete/:id', requireAuth, async (req, res) => {

    Promise.all([Category.deleteOne({ _id: new mongo.ObjectId(req.params.id) }).populate('books')]).then(([content]) => {
        // console.log(content);
        res.redirect('/library/category');
    }).catch(err => {
        console.log(err);
        res.sendStatus(500);
    })
})

/* DELETE a Publication from mongoDB Collection. */
router.get('/publication/delete/:id', requireAuth, async (req, res) => {

    Promise.all([Publication.deleteOne({ _id: new mongo.ObjectId(req.params.id) }).populate('books')]).then(([content]) => {
        // console.log(content);
        res.redirect('/library/publication');
    }).catch(err => {
        console.log(err);
        res.sendStatus(500);
    })
})

/* DELETE a Book from mongoDB Collection. */
router.get('/book/delete/:id', requireAuth, async (req, res) => {

    Promise.all([Book.deleteOne({ _id: new mongo.ObjectId(req.params.id) })]).then(([content]) => {
        // console.log(content);
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
            console.log("1 Book updated.");
        })
        res.redirect('/library/books#' + bookTitle)
    }

})


/* Issue a book to borrower. */
router.get('/issue', requireAuth, async (req, res) => {
    // Retrieving data for bookDetails
    Promise.all([Book.find().populate('publicationId').populate('categoryId'), Borrower.find().populate('borrowBook')]).then(([bookDetails, borrowerDetails]) => {
        res.render('issue', {
            title: 'Library | Issue',
            bookDetails: bookDetails,
            borrowerDetails: borrowerDetails
        });
    }).catch(err => {
        console.log(err);
        res.sendStatus(500);
    })
})

/* POST details of borrower with book. */
router.post('/issued', requireAuth, async (req, res) => {

    const name = req.body.name;
    const gender = req.body.gender;
    const dob = req.body.dob;
    const contact = req.body.contact;
    const borrowBook = req.body.borrowBook;
    const borrowDate = req.body.borrowDate;
    const returnDate = req.body.returnDate;
    const returnedOn = req.body.returnedOn;
    const issuedBy = req.body.issuedBy;
    const remarks = req.body.remarks;

    const bookId = await Book.findOne({ bookTitle: borrowBook })
    // console.log("\nBook to issue-");
    // console.log(bookId)

    const borrow = new Borrower({
        name: name,
        gender: gender,
        dob: dob,
        contact: contact,
        borrowBook: bookId._id,
        borrowDate: borrowDate,
        returnDate: returnDate,
        returnedOn: returnedOn,
        issuedBy: issuedBy,
        remarks: remarks
    });

    try {
        const savedBorrow = await borrow.save();

        // Pushing borrowers of same book.
        bookId.borrowers.push(savedBorrow)

        const searchQuery = {
            _id: bookId._id
        }

        Book.updateOne(searchQuery, {
            $inc: {
                currentCopies: -1
            }
        }, function (err, res) {
            if (err) throw err;
            console.log("1 Document updated.");
        })

        await bookId.save();

        res.redirect('/library/issue#' + name);
    } catch (error) {
        console.log(error);
    }
})

/* Searching Book with jquery autocomplete. */
router.get('/search', requireAuth, async (req, res) => {

    var regex = new RegExp(req.query["term"], 'i');
    var bookFind = Book.find({ bookTitle: regex }, { 'bookTitle': 1 }).limit(5);

    bookFind.exec(function (err, data) {
        // console.log(data);

        var result = [];

        if (!err) {
            if (data && data.length && data.length > 0) {
                data.forEach(books => {
                    let obj = {
                        // id: books._id,
                        label: books.bookTitle,
                    };
                    result.push(obj);
                });
            }
            // console.log(result);
            res.jsonp(result);
        }
    });

})

/* Redirecting to the searched book. */
router.get('/searchBook', requireAuth, async (req, res) => {
    const bookSearch = req.query.bookSearch;
    // console.log(bookSearch);
    const x = await Book.find({ bookTitle: bookSearch })
    // res.send(x);
    res.redirect('/library/books#' + bookSearch)

})


/* Return the book and increment the currentCopies by 1. */
router.get('/return/:id', requireAuth, async (req, res) => {

    const borrower = await Borrower.findById(req.params.id).populate('borrowBook')
    // console.log("\n"+borrower);
    // console.log("\n"+"Book that is borrowed: "+borrower.borrowBook._id+"\n");

    const bookId = await Book.findById(borrower.borrowBook._id)
    // console.log("\n"+bookId._id);

    try {
        const bookSearchQuery = {
            _id: bookId._id
        }

        Book.updateOne(bookSearchQuery, {
            $inc: {
                currentCopies: 1
            }
        }, function (err, res) {
            if (err) throw err;
            console.log("1 Copy updated.");
        })

        await bookId.save();

        const searchQuery = {
            _id: req.params.id
        }
        const returnedOnDate = {
            $set: {
                returnedOn: Date.now(),
            }
        }
        Borrower.updateOne(searchQuery, returnedOnDate, function (err) {
            if (err) throw err;
            console.log("\n1 Book returned.");
        })

        res.redirect('/library/issue#' + req.params.id);

    } catch (error) {
        console.log(error);
    }

})

/* DELETE a Borrower details from mongoDB Collection. */
router.get('/issue/delete/:id', requireAuth, async (req, res) => {

    const borrower = await Borrower.findById(req.params.id).populate('borrowBook')
    // console.log("\n"+borrower);
    // console.log("\n"+"Book that is borrowed: "+borrower.borrowBook._id+"\n");

    const bookId = await Book.findById(borrower.borrowBook._id)
    // console.log("\n"+bookId._id);

    const bookSearchQuery = {
        _id: bookId._id
    }

    try {
        const bookSearchQuery = {
            _id: bookId._id
        }

        Book.updateOne(bookSearchQuery, {
            $inc: {
                currentCopies: 1
            }
        }, function (err, res) {
            if (err) throw err;
            console.log("1 Copy updated.");
        })

        await bookId.save();

    } catch (error) {
        console.log(error);
    }

    Promise.all([Borrower.deleteOne({ _id: new mongo.ObjectId(req.params.id) }).populate('borrowBook')]).then(([content]) => {
        // console.log(content);
        res.redirect('/library/issue#' + req.params.id);
    }).catch(err => {
        console.log(err);
        res.sendStatus(500);
    })
})

module.exports = router;