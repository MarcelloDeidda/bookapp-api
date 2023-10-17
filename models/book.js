const mongoose = require("mongoose");

const categories = require("../utils/categories.js");

const Schema = mongoose.Schema;

const bookSchema = new Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    year: { type: Number, required: true },
    summary: { type: String, required: true },
    imgUrl: { type: String, required: true },
    category: {
        type: [String],
        enum: categories,
        required: true
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    createdBy: /*{
            type: Schema.Types.ObjectId,
            ref: "User"
        }*/ String
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;