// Importing mongoose models
const place = require("../../../../mern/places/backend/models/place");
const { sortBySurname } = require("../utils/utils");
const Book = require("../models/book");
const User = require("../models/book");

// Importing utils
const categories = require("../utils/categories");
const ExpressError = require("../utils/express-error");
const { validateCategory, checkValidation } = require("../utils/validation");

// Importing libraries
const axios = require("axios");

module.exports.getAllBooks = async (req, res, next) => {
    try {
        const books = await Book.find({});

        if (books.length === 0) {
            return res.status(404).json({ message: "Could not find any books!" });
        }

        res.status(200).json({ books: books.map(book => book.toObject({ getters: true })) });
    } catch (e) {
        return next(new ExpressError("Couldn't fetch books! Try again later", 500));
    }
}

module.exports.getBookById = async (req, res, next) => {
    try {
        const { bookId } = req.params;
        const book = await Book.findById(bookId);

        if (!book) {
            return next(new ExpressError("Could not find this book!", 404));
        }

        res.status(200).json({ book: book.toObject({ getters: true }) });
    } catch (e) {
        return next(new ExpressError(e.message, 500));
    }
}

module.exports.getBooksByKeyword = async (req, res, next) => {
    try {
        const { keyword } = req.query;
        const books = await Book.find({ $or: [{ title: { $regex: keyword, $options: "i" } }, { author: { $regex: keyword, $options: "i" } }] });

        if (books.length === 0) {
            return res.status(404).json({ message: "Could not find any books!" });
        }

        res.status(200).json({ books: [...books.map(book => book.toObject({ getters: true }))] });
    } catch (e) {
        return next(new ExpressError(e.message, 500));
    }
}

module.exports.getAuthors = async (req, res, next) => {
    try {
        const books = await Book.find({});
        const authorsList = books.map(book => book.author);

        if (authorsList.length === 0) {
            return res.status(404).json({ message: "Could not find any author!" });
        }

        const [...authors] = sortBySurname(authorsList);
        console.log(authors)
        res.status(200).json({ authors });
    } catch (e) {
        return next(new ExpressError(e.message, 500));
    }
}

module.exports.getBooksByAuthor = async (req, res, next) => {
    try {
        const { author } = req.params;
        const books = await Book.find({ author });

        if (books.length === 0) {
            return res.status(404).json({ message: "Could not find any books!" });
        }

        res.status(200).json({ books: [...books.map(book => book.toObject({ getters: true }))] });
    } catch (e) {
        return next(new ExpressError(e.message, 500));
    }
}

module.exports.getCategories = (req, res, next) => {
    res.status(200).json({ categories });
}

module.exports.getBooksByCategory = async (req, res, next) => {
    try {
        const { category } = req.params;

        const categoryIsValid = categories.some(cat => cat.toLowerCase() === category.toLowerCase());

        if (!categoryIsValid) {
            return res.status(404).json({ message: "Invalid category!" });
        }

        const books = await Book.find({});
        const booksByCategory = books.filter(book => {
            return book.category.some(cat => cat.toLowerCase() === category.toLowerCase());
        });

        if (booksByCategory.length === 0) {
            return res.status(404).json({ message: "Couldnt' find any book!" });
        }

        res.status(200).json({ books: booksByCategory.map(book => book.toObject({ getters: true })) });
    } catch (e) {
        return next(new ExpressError(e.message, 500));
    }
}

module.exports.createBook = async (req, res, next) => {
    try {
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

        await book.save();
        res.status(201).json({ book: book.toObject({ getters: true }) });
    } catch (e) {
        return next(new ExpressError(e.message, 500));
    }
}

module.exports.editBook = async (req, res, next) => {
    try {
        checkValidation(req, next);
        const { bookId } = req.params;
        const { title, author, year, summary, imgUrl, category } = req.body;
        validateCategory(category, next);

        let book;
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

        res.status(200).json({ book: book.toObject({ getters: true }) });
    } catch (e) {
        return next(new ExpressError(e.message, 500));
    }
}

module.exports.deleteBook = async (req, res, next) => {
    try {
        const { bookId } = req.params;
        const book = await Book.findById(bookId);

        if (!book) {
            return next(new ExpressError("Could not find this book!", 404));
        }

        await book.deleteOne();
        res.status(200).json({ message: "Book successfully deleted." });
    } catch (e) {
        return next(new ExpressError(e.message, 500));
    }
}

module.exports.importBooks = async (req, res, next) => {
    try {
        const books = await axios.get("http://localhost:3000/books/import");
        let savedBooks = 0;
        for (let book of books.data.books) {
            const { title, author, year, summary, category, imgUrl } = book;
            const newBook = new Book({ title, author, year, summary, category, imgUrl, createdBy: "Marcello" });
            await newBook.save();
            savedBooks++;
            console.log(`${savedBooks} / ${books.data.books.length}`);
        }
        res.send("Done!")
    } catch (e) {
        return next(new ExpressError(e.message, 500));
    }
}