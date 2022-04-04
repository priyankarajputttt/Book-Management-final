const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;


const bookModel = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        trim: true

    },
    bookCover: {
        type: String,
        required: true,
        default : "Book Cover Not Availabe in that Time"
    },
    excerpt: {
        type: String,
        required: true,
        trim: true
    },
    userId: {
        type: ObjectId,
        required: true,
        refs: "userbook",
        trim: true
    },
    ISBN: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    subcategory: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    reviews: {
        type: Number,
        default: 0,
        required: true


    },
    deletedAt: {
        type: Date,
        default: ""
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    releasedAt: {
        type: Date,
        required: true,

    },
}, { timestamps: true });

module.exports = mongoose.model("Book", bookModel);