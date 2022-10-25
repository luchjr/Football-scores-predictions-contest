import { getDateStamp } from '../../../helpers/utils';

import { getNowTime } from '../../../helpers/utils';

import { correctTime } from '../../../helpers/utils';

import { showActionMsg } from '../../../helpers/utils';

import { getPageTitleHTML } from '../../../helpers/utils';

import { convertIdToLeagueName } from '../../../helpers/utils';

import ChooseLeague from '../choose-league';

import Users from '../../../models/users';


class UpcomingMatches extends ChooseLeague {
    static async getData() {
        const leaguesIdList = await ChooseLeague.getData(),
            matchesData = await Users.getUpcomingMatchesData(this.urlParts.userId, this.urlParts.leagueId);

        return [leaguesIdList, matchesData];
    }

    static async render([leaguesIdList, matchesData]) {
        return `
            <div class="wrapper">
                ${await getPageTitleHTML(this.urlParts.page)}
                <div class="leagues-tabs">
                ${leaguesIdList.map(leagueId => ChooseLeague.getLeagueTabHTML(leagueId)).join('\n ')}</div>
                <div class="content">
                ${await this.renderContent(this.urlParts.leagueId, matchesData)}</div>
            </div>
        `;
    }

    static async renderContent(leagueId, matchesData) {
        let html;

        if (matchesData.length == 0) {
            html = '<div class="league"><div class="league__msg">No matches coming soon</div></div>';
        } else {
            html =
                `<table class="event">
                    <caption>${convertIdToLeagueName(leagueId)}</caption>
                    <thead>
                        <tr>
                            <th class="event__date">Match<br>Date | Time</th>
                            <th class="event__home-team">Home Team</th>
                            <th colspan="2">Score Prediction</th>
                            <th colspan="2">Score</th>
                            <th>Away Team</th>
                            <th>Earned Pts.</th>
                        </tr>
                    </thead>
                    <tbody>
                    ${matchesData.map(match => this.getMatchRowHTML(match)).join('\n ')}
                    </tbody>
                </table>

                ${await this.getSaveBtnHTML(leagueId) || ''} 

                <button class="btn up-btn up-btn_hidden">&#10514;</button>
            `;
        }

        return html;
    }

    static async getSaveBtnHTML(leagueId) {
        return `<button class="btn save-predictions-btn" data-league-id="${leagueId}" >Save Predictions</button>`;
    }

    static getMatchRowHTML(match) {
        correctTime(match);
        const matchId = match.matchId,
            matchDate = match.date.replace(/-/ig, '.'),
            matchTime = match.time,
            matchStatus = match.statusShort,
            homeTeamName = match.homeTeamName,
            awayTeamName = match.awayTeamName,
            homeScore = match.homeScore,
            awayScore = match.awayScore,
            homeScorePrediction = Number.parseInt(match.homeScorePrediction),
            awayScorePrediction = Number.parseInt(match.awayScorePrediction),
            predictionPts = match.predictionPts,
            nowTime = getNowTime(),
            matchDateStamp = getDateStamp(match.date, matchTime);

        return ` 
            <tr class="event__match ${UpcomingMatches.checkMatchstatus(matchStatus, nowTime, matchDateStamp)}"
                data-match-id="${matchId}" data-match-datestamp="${matchDateStamp}">
                <td class="event__date">${matchStatus === 'P' ? 'Postponed' : `${matchDate}<br>${matchTime}`}</td>
                <td class="event__home-team">${homeTeamName}</td>
                <td class="event__home-score-pred">
                <input class="event__home-score-input" type="text" placeholder ="\u2013"
                ${nowTime > matchDateStamp && matchStatus != 'P' ? 'disabled' : ''} 
                value="${Number.isInteger(homeScorePrediction) ? homeScorePrediction : ''}"></td>
                <td class="event__away-score-pred">
                <input class="event__away-score-input" type="text" placeholder ="\u2013" 
                ${nowTime > matchDateStamp && matchStatus != 'P' ? 'disabled' : ''}  
                value="${Number.isInteger(awayScorePrediction) ? awayScorePrediction : ''}"></td>
                <td class="event__home-score">${matchStatus == 'FT' ? homeScore : '\u2013'}</td>
                <td class="event__away-score">${matchStatus == 'FT' ? awayScore : '\u2013'}</td>
                <td class="event__away-team">${awayTeamName}</td>
                <td class="event__prediction-points ${predictionPts > 0 ? 'event__earned' : ''}">
                ${(Number.isInteger(homeScore) && Number.isInteger(awayScore) &&
                    Number.isInteger(Number.parseInt(homeScorePrediction)) &&
                    Number.isInteger(Number.parseInt(awayScorePrediction))) ? predictionPts : '\u2013'}</td>
            </tr>
        `;
    }

    static checkMatchstatus(matchStatus, nowTime, matchDateStamp) {
        if (matchStatus == 'FT') {

            return 'event__closed';
        } else if (matchStatus != 'P' && nowTime > matchDateStamp) {

            return 'event__closed event__started';
        } else {

            return 'event__open';
        }
    }

    static afterRender([leaguesIdList, matchesData]) {
        ChooseLeague.setTabsActions(leaguesIdList);
        this.setRestOfActions(matchesData);
        UpcomingMatches.showHideSetUpBtn();
        UpcomingMatches.setUpBtnAction();
    }

    static setRestOfActions(matchesData) {
        if (matchesData != 0) {
            const actualMatches = document.querySelectorAll('.event__open'),
                tbody = document.getElementsByTagName('tbody')[0],
                savePredictionsBtn = document.getElementsByClassName('save-predictions-btn')[0];

            tbody.onkeyup = evt => UpcomingMatches.disableBtn(evt, actualMatches, savePredictionsBtn);
            savePredictionsBtn.onclick = () => UpcomingMatches.savePredictions(actualMatches, savePredictionsBtn, matchesData);
        }
    }

    static disableBtn(evt, actualMatches, savePredictionsBtn) {
        const target = evt.target;

        if (target.tagName == 'INPUT' && !target.disabled) {

            for (let match of actualMatches) {
                let homeScoreInput = match.getElementsByClassName('event__home-score-input')[0],
                    awayScoreInput = match.getElementsByClassName('event__away-score-input')[0],
                    homeValue = homeScoreInput.value.trim(),
                    awayValue = awayScoreInput.value.trim();

                if ((homeValue && awayValue) || (!homeValue && !awayValue)) {
                    savePredictionsBtn.disabled = false;
                }

                if ((homeValue && !awayValue) || (awayValue && !homeValue)) {
                    savePredictionsBtn.disabled = true;
                    break;
                }
            }
        }
    }

    static savePredictions(actualMatches, savePredictionsBtn, matchesData) {
        let homeScorePrediction,
            awayScorePrediction,
            matchStatus;

        if (UpcomingMatches.validateInput(savePredictionsBtn)) {

            for (let match of actualMatches) {
                homeScorePrediction = match.getElementsByClassName('event__home-score-input')[0];
                awayScorePrediction = match.getElementsByClassName('event__away-score-input')[0];
                matchStatus = match.getElementsByClassName('event__date')[0];

                if (getNowTime() < match.dataset.matchDatestamp || matchStatus.innerText == 'Postponed') {

                    for (let item of matchesData) {

                        if (item.matchId == match.dataset.matchId) {
                            item.homeScorePrediction = Number.parseInt(homeScorePrediction.value);
                            item.awayScorePrediction = Number.parseInt(awayScorePrediction.value);
                        }
                    }
                } else {
                    homeScorePrediction.value = '';
                    homeScorePrediction.disabled = true;
                    awayScorePrediction.value = '';
                    awayScorePrediction.disabled = true;
                }
            }

            Users.updateScorePredictions(this.urlParts.userId, this.urlParts.leagueId, matchesData);
            savePredictionsBtn.disabled = true;
            showActionMsg('Predictions saved!', 'action-msg');
        }
    }

    static validateInput(savePredictionsBtn) {
        let inputs = document.querySelectorAll('.event__open input'),
            valueIsCorrect = true;

        for (let input of inputs) {
            let value = input.value.trim();

            if (input.value != '') {
                value = Number.parseInt(value);

                if (value >= 0) {
                    input.classList.remove('event__wrong-input');
                    savePredictionsBtn.disabled = true;
                } else {
                    input.classList.add('event__wrong-input');
                    valueIsCorrect = false;
                }
            }

        }

        if (!valueIsCorrect) {
            showActionMsg('Wrong input data!', 'action-msg_wrong-input');
        }

        return valueIsCorrect;
    }

    static showHideSetUpBtn() {
        const upBtn = document.getElementsByClassName('up-btn')[0];
        window.onscroll = () => {
            if (window.scrollY > 300) {
                upBtn.classList.remove('up-btn_hidden');
            } else {
                upBtn.classList.add('up-btn_hidden');
            }
        };
    }

    static setUpBtnAction() {
        const upBtn = document.getElementsByClassName('up-btn')[0];

        upBtn.onclick = () => {
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: 'smooth'
            });
        };
    }
}

export default UpcomingMatches;