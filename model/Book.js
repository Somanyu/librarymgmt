const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    ISBN: {
        type: Number,
        required: true,
        min: 5,
        max: 100000000
    },
    bookTitle: {
        type: String,
        required: true,
        min: 12,
        max: 40
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
        max: 150
    }
});

module.exports = mongoose.model('Book', bookSchema);