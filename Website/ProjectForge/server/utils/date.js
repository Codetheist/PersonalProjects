function isValidDate(date) {
    if (date == null) return true;
    if (!/^[1-2]\d{3}-\d{2}-\d{2}$/.test(date)) return false;
    
    const [year, month, day] = date.split("-").map(Number);
    const dateObj = new Date(year, month - 1, day);
    return (
        dateObj.getFullYear() === year &&
        dateObj.getMonth() === month - 1 &&
        dateObj.getDate() === day
    );
}

module.exports = {
    isValidDate
};