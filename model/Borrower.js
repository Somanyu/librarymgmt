const mongoose = require('mongoose');

const borrowerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 6,
        max: 30
    },
    gender: {
        type: String,
        required: true,
        min: 6,
        max: 30
    },
    dob: {
        type: Date,
        required: true,
        min: 15,
        max: 30
    },
    contact: {
        type: String,
        required: true,
        min: 7,
        max: 50
    },
    borrowBook: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book", 
        required: true, 
    },
    borrowDate: {
        type: Date,
        default: Date.now
    },
    returnDate: {
        type: Date,
        default: Date.now
    },
    returnedOn: {
        type: Date,
        default: Date.now
    },
    issuedBy: {
        type: String,
        default: "Admin"
    },
    remarks: {
        type: String,
        required: true,
        min: 0,
        max: 100
    }
});

module.exports = mongoose.model('User', borrowerSchema);