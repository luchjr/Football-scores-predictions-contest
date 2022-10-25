import '../styles/style';

import { parseCurrentURL } from './helpers/utils';

import Header from './views/partials/header';
import Footer from './views/partials/footer';
import ChooseLeague from './views/pages/choose-league';

import UpcomingMatches from './views/pages/matches/upcoming-matches';
import Archive from './views/pages/matches/archive';
import rivalArchive from './views/pages/matches/rival-archive';
import Contest from './views/pages/contest.js';
import ManageLeagues from './views/pages/manage-leagues';

import Login from './views/pages/login';
import Logout from './views/pages/logout';
import Registration from './views/pages/registration';
import About from './views/pages/about';
import Error404 from './views/pages/error404';
import Notsignedin from './views/pages/notsignedin';

const Routes = {
    '/': About,
    '/about/:userid': About,
    '/login': Login,
    '/logout': Logout,
    '/notsignedin': Notsignedin,
    '/registration': Registration,
    '/contest/:userid': ChooseLeague,
    '/contest/:userid/:leagueid/users': Contest,
    '/upcoming-matches/:userid': ChooseLeague,
    '/upcoming-matches/:userid/:leagueid': UpcomingMatches,
    '/archive/:userid': ChooseLeague,
    '/archive/:userid/:leagueid': Archive,
    '/archive/:userid/:leagueid/users/:rival': rivalArchive,
    '/manage-leagues/:userid': ManageLeagues
};

function router() {
    (async() => {
        const headerContainer = document.getElementsByClassName('header-container')[0],
            contentContainer = document.getElementsByClassName('content-container')[0];

        const urlParts = parseCurrentURL(),
            pagePath = `/${urlParts.page || ''}${urlParts.userId ? '/:userid' : ''}` +
            `${urlParts.leagueId ? '/:leagueid' : ''}${urlParts.users ? '/users' : ''}` +
            `${urlParts.rival ? '/:rival' : ''}`,
            Page = Routes[pagePath] ? Routes[pagePath] : Error404;

        const headerData = await Header.getData();

        headerContainer.innerHTML = await Header.render(headerData);
        Header.afterRender(headerData);

        const pageData = await Page.getData();

        contentContainer.innerHTML = await Page.render(pageData);
        Page.afterRender(pageData);
    })();
}

(async() => {
    const footerContainer = document.getElementsByClassName('footer-container')[0];

    footerContainer.innerHTML = await Footer.render();
})();

window.onload = router;
window.onhashchange = router;