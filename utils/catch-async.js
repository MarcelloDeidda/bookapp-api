// catchAsync middleware catches async errors to be handled
module.exports = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next);
    }
}