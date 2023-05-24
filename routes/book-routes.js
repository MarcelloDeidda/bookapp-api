const express = require("express");
const router = express.Router();

const bookControllers = require("../controllers/book-controllers");
const validation = require("../utils/validation");

router.get("/", bookControllers.getAllBooks);
router.get("/import", bookControllers.importBooks);
router.get("/authors", bookControllers.getAuthors);
router.get("/authors/:author", bookControllers.getBooksByAuthor);
router.get("/categories", bookControllers.getCategories);
router.get("/categories/:category", bookControllers.getBooksByCategory);
router.get("/search", bookControllers.getBooksByKeyword);
router.get("/:bookId", bookControllers.getBookById);

router.post("/", validation.bookValidator(), bookControllers.createBook);

router.patch("/:bookId", validation.bookValidator(), bookControllers.editBook);

router.delete("/:bookId", bookControllers.deleteBook);

module.exports = router;