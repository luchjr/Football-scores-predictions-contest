import Component from '../../views/component';

import Users from '../../models/users';

import { showActionMsg } from '../../helpers/utils';

import { getPageTitleHTML } from '../../helpers/utils';

class ManageLeagues extends Component {
    static async getData() {
        const token = sessionStorage.getItem('token');
        let response;
        if (token && this.urlParts.userId) {
            response = await Users.getUserLeaguesIdList(this.urlParts.userId, token);
            return response;
        } else {
            location.hash = '/notsignedin';
        }
    }

    static async render(leaguesIdList) {
        if (Array.isArray(leaguesIdList)) {
            return `
                <div class="wrapper">
                    ${await getPageTitleHTML(this.urlParts.page)}
                    <div class="manage-leagues">
                        <button class="manage-leagues__btn ${ManageLeagues.getLeagueBtnStatus(1, leaguesIdList)}"
                        data-league-id="1">Premier League</button>
                        <button class="manage-leagues__btn ${ManageLeagues.getLeagueBtnStatus(25, leaguesIdList)}"
                        data-league-id="25">Europa League</button>
                        <button class="manage-leagues__btn ${ManageLeagues.getLeagueBtnStatus(24, leaguesIdList)}"
                        data-league-id="24">Champions League</button>
                        <button class="manage-leagues__btn ${ManageLeagues.getLeagueBtnStatus(92, leaguesIdList)}"
                        data-league-id="92">Bundesliga</button>
                        <button class="manage-leagues__btn ${ManageLeagues.getLeagueBtnStatus(93, leaguesIdList)}"
                        data-league-id="93">Serie A</button>
                        <button class="manage-leagues__btn ${ManageLeagues.getLeagueBtnStatus(94, leaguesIdList)}"
                        data-league-id="94">LaLiga</button>
                    </div>
                </div>

                <div class="modal-window modal-window__hidden">
                    <h3>Leave the league?</h3>
                    <div class="btns-block">
                        <button class="btn accept">OK</button>
                        <button class="btn decline">Cancel</button>
                    </div> 
                </div> 
            `;
        }
    }

    static getLeagueBtnStatus(leagueId, leaguesIdList) {
        if (leaguesIdList.find(item => item == leagueId)) {
            return 'manage-leagues__league-added';
        } else {
            return '';
        }
    }

    static afterRender(leaguesIdList) {
        if (Array.isArray(leaguesIdList)) {
            ManageLeagues.setActions();
        }
    }

    static setActions() {
        const manageLeaguesBlock = document.getElementsByClassName('manage-leagues')[0];

        manageLeaguesBlock.onclick = evt => ManageLeagues.subscribeUnsubscrbLeague(evt);

    }

    static setModalWindowActions(target, modalWindow, modalBG,token) {
        const acceptBtn = document.getElementsByClassName('accept')[0],
            declineBtn = document.getElementsByClassName('decline')[0];

        acceptBtn.onclick = () => {
            Users.joinLeftLeague(this.urlParts.userId, target.dataset.leagueId, token);

            modalWindow.classList.add('modal-window__hidden');
            modalBG.classList.add('modal-wrapper__hidden');
            target.classList.remove('manage-leagues__league-added');

            showActionMsg(`You left ${target.innerText}!`, 'choose-league-msg');
        };

        declineBtn.onclick = () => {
            modalWindow.classList.add('modal-window__hidden');
            modalBG.classList.add('modal-wrapper__hidden');
        };
    }

    static showModalWindow(target, token) {
        const modalWindow = document.getElementsByClassName('modal-window')[0],
            body = document.body,
            modalBG = document.createElement('div');

        modalBG.classList = 'modal-wrapper';
        body.appendChild(modalBG);
        modalWindow.classList.remove('modal-window__hidden');

        ManageLeagues.setModalWindowActions(target, modalWindow, modalBG, token);
    }

    static subscribeUnsubscrbLeague(evt) {
        const target = evt.target,
            token = sessionStorage.getItem('token');

        if (target.tagName == 'BUTTON') {
            if (target.classList.contains('manage-leagues__league-added')) {
                ManageLeagues.showModalWindow(target, token);
            } else {
                target.classList.add('manage-leagues__league-added');
                showActionMsg(`You joined ${target.innerText}!`, 'choose-league-msg');
                 Users.joinLeftLeague(this.urlParts.userId, target.dataset.leagueId, token);
            }
        }
    }
}

export default ManageLeagues;
