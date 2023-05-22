require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.status(201).json({ message: "CIAO!" });
})

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