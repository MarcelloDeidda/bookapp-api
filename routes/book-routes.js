const express = require("express");
const router = express.Router();

const bookControllers = require("../controllers/book-controllers");
const validation = require("../utils/validation");

router.get("/", bookControllers.getAllBooks);
router.post("/", validation.createBookValidator(), bookControllers.createBook);

module.exports = router;