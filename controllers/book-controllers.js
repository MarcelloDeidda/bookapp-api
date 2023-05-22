// Importing mongoose models
const Book = require("../models/book");
const User = require("../models/book");

// Importing utils
const categories = require("../utils/categories");
const ExpressError = require("../utils/express-error");

module.exports.getAllBooks = async (req, res) => {
    let books;
    try {
        books = await Book.find({});
    } catch (e) {
        return next(new ExpressError("Couldn't fetch books! Try again later", 500));
    }

    res.status(200).json({ books: books.map(book => book.toObject({ getters: true })) });
}
