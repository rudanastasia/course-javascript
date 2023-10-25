import pages from './pages';
import model from './model';
import profilePage from './profilePage';
import commentsTemplate from './commentsTemplate.html.hbs';
import('./styles.css');


/*const pageNames = ['login', 'main', 'profile'];
document.addEventListener('click', () => {
    const pageName = model.getRandomElement(pageNames);
    pages.openPage(pageName);
});*/
const commentsElements = commentsTemplate({ list: comments });
listElement.appendChild(commentsElements);


import mainPage from './mainPage';
import loginPage from './loginPage';

pages.openPage('login');
loginPage.handleEvents();
mainPage.handleEvents();
profilePage.handleEvents();
