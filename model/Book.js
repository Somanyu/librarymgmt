const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    ISBN: {
        type: Number,
        required: true,
        min: 5,
        max: 100000000000000
    },
    bookTitle: {
        type: String,
        required: true,
        min: 12,
        max: 40
    },
    author:{
        type: String,
        required: true,
        min: 4,
        max: 30
    },
    language: {
        type: String,
        required: true,
        min: 5,
        max: 20
    },
    publicationId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Publication", 
        required: true, 
    },
    noCopies: {
        type: Number,
        required: true,
        min: 0,
        max: 10
    },
    currentCopies: {
        type: Number,
        required: true,
        min: 0,
        max: 10
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category", 
        required: true, 
    },
    publicationYear: {
        type: Number,
        required: true,
        min: 1947,
        max: 2023
    },
    bookInfo: {
        type: String,
        required: true,
        min: 20,
        max: 250
    },
    bookImage: {
        type: String,
        contentType: String
    }
});

module.exports = mongoose.model('Book', bookSchema);