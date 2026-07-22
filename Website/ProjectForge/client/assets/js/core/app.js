// Main
import { elements } from '../shared/dom.js';
import { initAuth } from '../features/auth.js';
import { initHomePage } from '../pages/homePage.js';
import { initDashboardPage } from '../pages/dashboardPage.js';
import { initProjectDetailPage } from '../pages/projectDetailPage.js';
import { initAccountPage } from '../pages/accountPage.js';

const init = () => {
    copyRightYear();
    initAuth();
    initHomePage();
    initDashboardPage();
    initProjectDetailPage();
    initAccountPage();
}

const copyRightYear = () => {
    const currentYear = new Date().getFullYear();
    const startYear = 2026;
    elements.year.textContent = currentYear > startYear ? `${startYear} - ${currentYear}` : `${startYear}`;
}

document.addEventListener("DOMContentLoaded", init);