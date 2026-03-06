const init = () => {
    copyRightYear();
}

const copyRightYear = () => {
    const copyRight = document.getElementById("year");
    const currentYear = new Date().getFullYear();
    const startYear = 2026;
    copyRight.textContent = currentYear > startYear ? `${startYear} - ${currentYear}` : `${startYear}`;
}

init();