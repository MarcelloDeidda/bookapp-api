module.exports.sortBySurname = names => {
    names.sort((a, b) => {
        var surnameA = a.split(" ")[a.split(" ").length - 1];
        var surnameB = b.split(" ")[b.split(" ").length - 1];
        if (surnameA < surnameB) {
            return -1;
        }
        if (surnameA > surnameB) {
            return 1;
        }
        return 0;
    });
    return new Set(names);
}