import UpcomingMatches from './upcoming-matches';

import ChooseLeague from '../choose-league';

import Users from '../../../models/users';

import { correctTime } from '../../../helpers/utils';

class Archive extends UpcomingMatches {
    static async getData() {
        const leaguesIdList = await ChooseLeague.getData(),
            matchesData = await Users.getPastMatchesData(this.urlParts.userId, this.urlParts.leagueId);

        return [leaguesIdList, matchesData];
    }

    static getMatchRowHTML(match) {
        correctTime(match);
        const matchDate = match.date.replace(/-/ig, '.'),
            matchTime = match.time,
            matchStatus = match.statusShort,
            homeTeamName = match.homeTeamName,
            awayTeamName = match.awayTeamName,
            homeScore = match.homeScore,
            awayScore = match.awayScore,
            homeScorePrediction = Number.parseInt(match.homeScorePrediction),
            awayScorePrediction = Number.parseInt(match.awayScorePrediction),
            predictionPts = match.predictionPts;

        return ` 
            <tr class="event__match">
                <td class="event__date">${matchStatus === 'P' ? 'Postponed' : `${matchDate}<br>${matchTime}`}</td>
                <td class="event__home-team">${homeTeamName}</td>
                <td class="event__home-score-pred">
                ${Number.isInteger(homeScorePrediction) ? homeScorePrediction : '\u2013'}</td>
                <td class="event__away-score-pred">
                ${Number.isInteger(awayScorePrediction) ? awayScorePrediction : '\u2013'}</td>
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

    static getSaveBtnHTML() { }

    static setRestOfActions() {}
}

export default Archive;