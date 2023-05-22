// Importing packages
const { check, validationResult } = require("express-validator");

// Importing utils
const categories = require("./categories");
const ExpressError = require("./express-error");

module.exports.validateCategory = (category, next) => {
    if (!category || category.length === 0) {
        return next(new ExpressError("Please provide at least one category!", 422));
    }

    category.map(cat => {
        if (!categories.includes(cat)) {
            return next(new ExpressError("Some of the categories provided aren't valid!", 422));
        }
    })
};

module.exports.createBookValidator = () => {
    return [
        check("title")
            .not()
            .isEmpty(),
        check("author")
            .not()
            .isEmpty(),
        check("year")
            .not()
            .isAlpha()
            .not()
            .isEmpty(),
        check("summary")
            .not()
            .isEmpty(),
        check("imgUrl")
            .not()
            .isEmpty()
    ]
}

module.exports.checkValidation = (req, next) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        console.log(validationErrors);
        return next(new ExpressError("Invalid inputs", 422));
    }
}