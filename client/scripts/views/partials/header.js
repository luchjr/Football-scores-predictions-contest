import Component from '../../views/component';

import { logout } from '../../helpers/utils';


class Header extends Component {
    static async getData() {
        const userId = sessionStorage.getItem('username');
        if (userId) {
            return userId;
        }
    }

    static async render(userId) {
        const page = this.urlParts.page;

        return `
            <header class="header">   
                    <div class="header__menu-wrapper">    
                        <a href="#/" class="header__logo-wrapper">
                            <picture>
                                <source media="(max-width: 700px)" srcset="icons/ball_40.png">
                                <img class="header__logo-minor" src="icons/ball_50.png" alt="logo-minor">
                            </picture>
                            <picture>
                                <source media="(max-width: 990px)" srcset="icons/logoname_20.png">
                                <img class="header__logo-name" src="icons/logoname_25.png" alt="logo text"></img>
                            </picture>
                        </a> 
                        <div class="header__link-wrapper">        
                            <a class="header__link ${!page ? 'active' : ''}" href="#/">
                                About
                            </a>
                            <a class="header__link ${page === 'upcoming-matches' ? 'active' : ''}" href="#/upcoming-matches/${userId}">
                                Matches
                            </a>
                            <a class="header__link ${page === 'archive' ? 'active' : ''}" href="#/archive/${userId}">
                                Archive
                            </a> 
                            <a class="header__link ${page === 'manage-leagues' ? 'active' : ''}" href="#/manage-leagues/${userId}">
                                Leagues
                            </a> 
                            <a class="header__link ${page === 'contest' ? 'active' : ''}" href="#/contest/${userId}">
                                Contest
                            </a>
                        </div>
                    </div>
                    <div class="header__btn-box">${await Header.getUserBtnHTML(userId)}</div>
            </header>

            <div class="modal-window-header modal-window-header__hidden">
                <h3>Logout?</h3>
                <div class="btns-block">
                    <button class="btn accept-header">OK</button>
                    <button class="btn decline-header">Cancel</button>
                </div> 
            </div>
        `;
    }

    static getUserBtnHTML(userId) {
        if (userId) {
            return `<button class="btn header__user-btn">${userId}</button>`;
        } else {
            return '<a class="btn header__user-btn" href="#/login">Sign in</a>';
        }
    }

    static afterRender(userId) {
        userId && Header.setActions();
    }

    static setActions() {
        const userBtn = document.getElementsByClassName('header__user-btn')[0];
        if (userBtn) {
            const username = userBtn.innerText;
            userBtn.onclick = () => Header.showModalWindow();
            userBtn.onmouseover = () => userBtn.innerText = 'Logout';
            userBtn.onmouseout = () => userBtn.innerText = username;
        }
    }

    static showModalWindow() {
        const modalWindow = document.getElementsByClassName('modal-window-header')[0],
            body = document.body,
            modalBG = document.createElement('div');

        modalBG.classList = 'modal-wrapper';
        body.appendChild(modalBG);
        modalWindow.classList.remove('modal-window-header__hidden');

        Header.setModalWindowActions(modalWindow, modalBG);
    }

    static setModalWindowActions(modalWindow, modalBG) {
        const acceptBtn = document.getElementsByClassName('accept-header')[0],
            declineBtn = document.getElementsByClassName('decline-header')[0];

        acceptBtn.onclick = () => {
            logout();
            modalWindow.classList.add('modal-window-header__hidden');
            modalBG.classList.add('modal-wrapper__hidden');
        };

        declineBtn.onclick = () => {
            modalWindow.classList.add('modal-window-header__hidden');
            modalBG.classList.add('modal-wrapper__hidden');
        };
    }

}

export default Header;