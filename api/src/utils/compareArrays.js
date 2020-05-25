module.exports = (array1, array2) => {
    if (array1.length === array2.length) {
        const sorted1 = array1.sort();
        const sorted2 = array2.sort();

        return sorted1.every((value, index) => value === sorted2[index]);
    }
    return false;
}
