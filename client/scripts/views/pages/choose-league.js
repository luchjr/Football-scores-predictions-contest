import { convertIdToLeagueName } from '../../helpers/utils';

import { getPageTitleHTML } from '../../helpers/utils';

import Component from '../component';

import Users from '../../models/users';

import NoLeagues from './noleagues';

class ChooseLeague extends Component {
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
        let html;
        if (Array.isArray(leaguesIdList)) {
            if (leaguesIdList.length) {
                html = ` 
                    <div class="wrapper">
                        ${await getPageTitleHTML(this.urlParts.page)}
                        <div class="leagues-tabs">
                        ${leaguesIdList.map(leagueId => ChooseLeague.getLeagueTabHTML(leagueId)).join('\n ')}</div>
                        <div class="content">${await ChooseLeague.renderContent()}</div>
                    </div>
            `;
            } else {
                html = NoLeagues.render();
            }

            return html;
        }
    }

    static getLeagueTabHTML(leagueId) {
        return `
            <div class="leagues-tabs__tab ${this.urlParts.leagueId == leagueId ? 'leagues-tabs__tab-active' : ''}"
            data-id="${leagueId}">${convertIdToLeagueName(leagueId)}</div>
        `;
    }

    static async renderContent() {
        return '<div class="league"><div class="league__msg">Select league</div></div>';
    }

    static afterRender(leaguesIdList) {
        Array.isArray(leaguesIdList) && ChooseLeague.setTabsActions(leaguesIdList);
    }

    static setTabsActions(leaguesIdList) {
        if (leaguesIdList.length != 0) {
            const leaguesTabs = document.getElementsByClassName('leagues-tabs')[0];

            leaguesTabs.onclick = evt => ChooseLeague.toggleLeaguesTabs(evt, this.urlParts.page, this.urlParts.userId);
        }
    }

    static toggleLeaguesTabs(evt, page, userId) {
        const target = evt.target;

        if (target.classList.contains('leagues-tabs__tab')) {
            target.classList.add('leagues-tabs__tab-active');

            if (page == 'contest') {
                location.hash = `#/${page}/${userId}/${target.dataset.id}/users`;
            } else {
                location.hash = `#/${page}/${userId}/${target.dataset.id}`;
            }
        }
    }
}

export default ChooseLeague;