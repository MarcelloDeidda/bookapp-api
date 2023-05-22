const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    readBooks: [
        {
            type: Schema.Types.ObjectId,
            ref: "Book"
        }
    ],
    favouriteBooks: [
        {
            type: Schema.Types.ObjectId,
            ref: "Book"
        }
    ],
    wishlist: [
        {
            type: Schema.Types.ObjectId,
            ref: "Book"
        }
    ],
    following: [
        {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    followers: [
        {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    ]
});

const User = mongoose.model("User", userSchema);

module.exports = User;