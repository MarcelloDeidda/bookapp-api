require("dotenv").config();

// Importing npm packages
const express = require("express");
const mongoose = require("mongoose");

// Importing utils
const ExpressError = require("./utils/express-error");

// Importing routes
const bookRoutes = require("./routes/book-routes");

// Configuring server
const app = express();
app.use(express.json());

app.use("/api/books", bookRoutes);

app.use((req, res, next) => {
    throw new ExpressError("Could not find this route.", 404);
})

app.use((err, req, res, next) => {
    if (res.headerSent) {
        return next(err);
    }
    res.status(err.statusCode || 500).json({message: err.message || "An unknown error occurred!"});
});

// Connecting database and start listening
mongoose.connect(process.env.DB_URL)
    .then(() => {
        console.log("The connection with the database was established");
        app.listen(5000, () => {
            console.log("App is listening on port 5000!");
        })
    })
    .catch(e => {
        console.log(e);
    });