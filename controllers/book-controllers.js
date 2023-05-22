// Importing mongoose models
const Book = require("../models/book");
const User = require("../models/book");

// Importing utils
const categories = require("../utils/categories");
const ExpressError = require("../utils/express-error");
const { validateCategory, checkValidation } = require("../utils/validation");

module.exports.getAllBooks = async (req, res) => {
    let books;
    try {
        books = await Book.find({});
    } catch (e) {
        return next(new ExpressError("Couldn't fetch books! Try again later", 500));
    }

    res.status(200).json({ books: books.map(book => book.toObject({ getters: true })) });
}

module.exports.createBook = async (req, res, next) => {
    checkValidation(req, next);
    
    const { title, author, year, summary, imgUrl, category } = req.body;

    validateCategory(category, next);

    const book = new Book({
        title,
        author,
        year,
        summary,
        imgUrl,
        category,
        createdBy: "111",
        reviews: []
    });

    try {
        await book.save();
    } catch (e) {
        return next(new ExpressError(e.message, 500));
    }

    res.status(201).json({ message: "Book was successfully created!", book: book.toObject({ getters: true }) });
}