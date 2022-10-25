import ChooseLeague from './choose-league';

import { getPageTitleHTML } from '../../helpers/utils';

import { convertIdToLeagueName } from '../../helpers/utils';

import Users from '../../models/users';

class Contest extends ChooseLeague {
    static async getData() {
        const leaguesIdList = await ChooseLeague.getData(),
        selectedUsersData = await Users.getSelectedUsersData(this.urlParts.userId, this.urlParts.leagueId, 'users');

        return [leaguesIdList, selectedUsersData];
    }

    static async render([leaguesIdList, selectedUsersData]) {
        return `
            <div class="wrapper">
                ${await getPageTitleHTML(this.urlParts.page)}
                <div class="leagues-tabs">
                ${leaguesIdList.map(leagueId => ChooseLeague.getLeagueTabHTML(leagueId)).join('\n ')}</div>
                <div class="content">${await Contest.renderContent(this.urlParts.leagueId, selectedUsersData)}</div>
            </div>
        `;
    }

    static async renderContent(leagueId, selectedUsersData) {
        let html;

        if (selectedUsersData.usersIdList.length == 0) {
            html = '<div class="no-matches-msg">no users</div>';
        } else {
            html = `
                <table class="contest">
                    <caption>${convertIdToLeagueName(leagueId)}</caption>
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>User</th>
                            <th>Earned Pts.</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${await Contest.getAllUsersRowHTML(selectedUsersData, leagueId)}
                    </tbody>
                </table>
            `;
        }

        return html;
    }

    static async getAllUsersRowHTML(selectedUsersData, leagueId) {
        let html = '',
            rank = 1;

        for (let user of selectedUsersData.usersIdList) {
            html += `${await Contest.getUserRowHTML(user, selectedUsersData, leagueId, rank)}\n`;
            rank++;
        }
        return html;
    }

    static async getUserRowHTML(user, selectedUsersData, leagueId, rank) {
        const sumOfPredictionPts = selectedUsersData[user][leagueId].sumOfPredictionPts,
        currentUser = sessionStorage.getItem('username');
        return ` 
            <tr class="contest__user ${user == currentUser ? 'contest__current-user' : ''}
            " data-user-id="${selectedUsersData[user]}">
                <td class="contest__rank">${rank}</td>
                <td class="contest__username">
                ${user == currentUser ? user : Contest.getLinkHTMLToRival(user)}</td>
                <td class="contest__prediction-points" title="prediction points">
                ${sumOfPredictionPts ? sumOfPredictionPts : '\u2013'}</td>
            </tr>
        `;
    }

    static getLinkHTMLToRival(user) {
        return  `<a href="#/archive/${this.urlParts.userId}/${this.urlParts.leagueId}/users/${user}">${user}</a>`;
    }
}

export default Contest;