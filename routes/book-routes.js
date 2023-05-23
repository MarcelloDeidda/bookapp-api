const express = require("express");
const router = express.Router();

const bookControllers = require("../controllers/book-controllers");
const validation = require("../utils/validation");

router.get("/", bookControllers.getAllBooks);
router.post("/", validation.bookValidator(), bookControllers.createBook);
router.get("/:bookId", bookControllers.getBookById);
router.patch("/:bookId", validation.bookValidator(), bookControllers.editBook);
router.delete("/:bookId", bookControllers.deleteBook);

module.exports = router;