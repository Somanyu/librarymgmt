const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    categoryId: {
        type: Number,
        required: true,
        min: 1,
        max: 20
    },
    categoryName: {
        type: String,
        required: true,
        min: 15,
        max: 30
    },
    books: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Book'
        }
    ]
});

module.exports = mongoose.model('Category', categorySchema)