const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        min: 6,
        max: 30
    },
    lastName: {
        type: String,
        required: true,
        min: 6,
        max: 30
    },
    email: {
        type: String,
        required: true,
        min: 15,
        max: 30
    },
    password: {
        type: String,
        required: true,
        min: 10,
        max: 102
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', staffSchema);