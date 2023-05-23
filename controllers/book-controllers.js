// Importing mongoose models
const place = require("../../../../mern/places/backend/models/place");
const Book = require("../models/book");
const User = require("../models/book");

// Importing utils
const categories = require("../utils/categories");
const ExpressError = require("../utils/express-error");
const { validateCategory, checkValidation } = require("../utils/validation");

module.exports.getAllBooks = async (req, res, next) => {
    let books;
    try {
        books = await Book.find({});
    } catch (e) {
        return next(new ExpressError("Couldn't fetch books! Try again later", 500));
    }

    res.status(200).json({ books: books.map(book => book.toObject({ getters: true })) });
}

module.exports.getBookById = async (req, res, next) => {
    const { bookId } = req.params;

    let book;

    try {
        book = await Book.findById(bookId);

        if (!book) {
            return next(new ExpressError("Could not find this book!", 404));
        }
    } catch (e) {
        return next(new ExpressError(e.message, 500));
    }

    res.status(200).json({ book: book.toObject({ getters: true }) });
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

    res.status(201).json({ book: book.toObject({ getters: true }) });
}

module.exports.editBook = async (req, res, next) => {
    checkValidation(req, next);

    const { bookId } = req.params;
    const { title, author, year, summary, imgUrl, category } = req.body;

    validateCategory(category, next);

    let book;

    try {
        book = await Book.findById(bookId);

        if (!book) {
            return next(new ExpressError("Could not find this book.", 404));
        }

        book.title = title;
        book.author = author;
        book.year = year;
        book.summary = summary;
        book.imgUrl = imgUrl;
        book.category = category;
        await book.save();
    } catch (e) {
        return next(new ExpressError(e.message, 500));
    }

    res.status(200).json({ book: book.toObject({ getters: true }) });
}

module.exports.deleteBook = async (req, res, next) => {
    const { bookId } = req.params;

    let book;

    try {
        book = await Book.findById(bookId);

        if (!book) {
            return next(new ExpressError("Could not find this book!", 404));
        }

        await book.deleteOne();
    } catch (e) {
        return next(new ExpressError(e.message, 500));
    }

    res.status(200).json({ message: "Book successfully deleted." });
}