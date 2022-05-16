const mongoose = require('mongoose');

const publicationSchema = new mongoose.Schema({
    publicationId: {
        type: Number,
        required: true,
        min: 1,
        max: 20
    },
    publicationName: {
        type: String,
        required: true,
        min: 10,
        max: 100
    },
    books: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Book'
        }
    ]
});

module.exports = mongoose.model('Publication', publicationSchema);