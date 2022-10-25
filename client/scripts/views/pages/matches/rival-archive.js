import Archive from './archive';

import Users from '../../../models/users';

import { getPageTitleHTML } from '../../../helpers/utils';

class rivalArchive extends Archive {
    static async getData() {
        const matchesData = await Users.getPastMatchesData(this.urlParts.userId, this.urlParts.leagueId, this.urlParts.rival);

        return matchesData;
    }

    static async render(matchesData) {
        return `
            <div class="wrapper">
                ${await getPageTitleHTML(this.urlParts.page, this.urlParts.rival)}
                <div class="content">
                ${await Archive.renderContent(this.urlParts.leagueId, matchesData)}</div>
            </div>
        `;
    }

    static getSaveBtnHTML() { }

    static afterRender() {
        Archive.showHideSetUpBtn();
        Archive.setUpBtnAction();
    }
}

export default rivalArchive;