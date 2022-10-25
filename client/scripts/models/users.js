import League from '../models/league';

import { setPeriods } from '../helpers/utils';

import { getDateStamp } from '../helpers/utils';

import { sortMatchesList } from '../helpers/utils';

class Users {
    constructor(leagueDataFromDB) {
        this._leagueDataFromDB = leagueDataFromDB;
    }

    static async sendNewUserData(newUser) {
        const response = await fetch('http://localhost:3000/auth/registration', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newUser)
        });
        return await response.json();
    }

    static async sendUserData(user) {
        const response = await fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });

        return await response.json();
    }

    static async getUserDataFromDB(userId, token) {
        try {
            const response = await fetch(`http://localhost:3000/api/${userId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response) {
                return await response.json();
            }
        } catch (ex) {
            alert('Data receiving error');
        }
    }

    static async getLeagueDataFromDB(userId, leagueId) {
        const response = await fetch(`http://localhost:3000/api/${userId}/${leagueId}`);

        return await response.json();
    }

    static async getUserLeaguesIdList(userId, token) {
        const userData = await Users.getUserDataFromDB(userId, token);
        return userData.leaguesIdList;
    }

    static async getUsersAllDataFromDB(userId, leagueId, users) {
        const response = await fetch(`http://localhost:3000/api/${userId}/${leagueId}/${users}`);

        return await response.json();
    }

    static async updateLeagueDataInUserDB(userId, leagueId, leagueData) {
        await fetch(`http://localhost:3000/api/${userId}/${leagueId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(leagueData)
        });
    }

    static async addNewLeagueToUserDB(userId, userData) {
        await fetch(`http://localhost:3000/api/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
    }

    static async updateAllUsersInDB(userId, leagueId, users, allUsersData) {
        await fetch(`http://localhost:3000/api/${userId}/${leagueId}/${users}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(allUsersData)
        });
    }

    static async joinLeftLeague(userId, leagueId, token) {
        const userData = await Users.getUserDataFromDB(userId, token);

        if (!userData.leaguesIdList.length || !userData.leaguesIdList.find(item => item == leagueId)) {
            const leagueNewData = await League.getLeagueNewData(leagueId),
                matchesOfLeagueNewData = leagueNewData['fixtures-results'].matches;
            (userData.leaguesIdList.push(leagueId));
            userData[leagueId] = {};
            userData[leagueId].predictionsData = [];
            for (let match of matchesOfLeagueNewData) {
                userData[leagueId].predictionsData.push(
                    {
                        matchId: match.id,
                        date: match.date,
                        time: match.time,
                        statusShort: match.status.short,
                        homeTeamName: match['home-team'].name,
                        awayTeamName: match['away-team'].name,
                        homeScorePrediction: '',
                        awayScorePrediction: '',
                        homeScore: `${match.status.short == 'FT' ? match['home-team'].score : ''}`,
                        awayScore: `${match.status.short == 'FT' ? match['away-team'].score : ''}`,
                        predictionPts: ''
                    }
                );
            }

            userData[leagueId].sumOfPredictionPts = 0;
        } else if (userData.leaguesIdList.find(item => item == leagueId)) {
            delete userData[leagueId];
            userData.leaguesIdList = userData.leaguesIdList.filter(item => item != leagueId);
        }

        await Users.addNewLeagueToUserDB(userId, userData);
    }

    static async getUpcomingMatchesData(userId, leagueId) {
        const [startOfPeriod, endOfPeriod] = setPeriods(7),
            allLeagueDataFromDB = await Users.getLeagueData(userId, leagueId),
            upcomingMatchesData = allLeagueDataFromDB.predictionsData.filter(match => {
                if (Date.parse(match.date) > startOfPeriod && Date.parse(match.date) < endOfPeriod) {

                    return match;
                }
            });

        return upcomingMatchesData;
    }

    static async getLeagueData(userId, leagueId) {
        const leagueNewData = await League.getLeagueNewData(leagueId),
            matchesOfLeagueNewData = leagueNewData['fixtures-results'].matches;
        this._leagueDataFromDB = await Users.getLeagueDataFromDB(userId, leagueId);

        const leagueData = await Users.updateLeagueData(matchesOfLeagueNewData, this._leagueDataFromDB);

        await Users.updateLeagueDataInUserDB(userId, leagueId, leagueData);
        this._leagueDataFromDB = leagueData;

        return this._leagueDataFromDB;
    }

    static async updateLeagueData(matchesOfLeagueNewData, leagueData) {
        const [, endOfPeriod] = setPeriods(7),
            userMatches = leagueData.predictionsData,
            matchesData = matchesOfLeagueNewData.filter(match => {
                if (getDateStamp(match.date, '00:00') < endOfPeriod) {

                    return match;
                }
            });

        let sumOfPredictionPts = 0;

        for (let userMatch of userMatches) {
            if (getDateStamp(userMatch.date, '00:00') < endOfPeriod) {
                for (let match of matchesData) {
                    if (userMatch.matchId == match.id) {
                        userMatch.homeScore = match['home-team'].score;
                        userMatch.awayScore = match['away-team'].score;
                        userMatch.statusShort = match.status.short;
                        userMatch.date = match.date;
                        userMatch.time = match.time;

                        if (userMatch.statusShort == 'FT' && Number.isInteger(userMatch.homeScorePrediction) &&
                        Number.isInteger(userMatch.awayScorePrediction) && !Number.isInteger(userMatch.predictionPts)) {
                            userMatch.predictionPts = Users.calculatePredictionPts(userMatch.homeScore,
                                userMatch.awayScore, userMatch.homeScorePrediction, userMatch.awayScorePrediction);

                        }
                        if (userMatch.predictionPts) {
                            sumOfPredictionPts += userMatch.predictionPts;
                        }

                        break;
                    }
                }
            }
        }

        leagueData.sumOfPredictionPts = sumOfPredictionPts;
        leagueData.predictionsData = userMatches;

        return leagueData;
    }

    static calculatePredictionPts(homeScore, awayScore, homeScorePrediction, awayScorePrediction) {
        if (homeScorePrediction == homeScore && awayScorePrediction == awayScore) {
            return 10;
        } else if ((homeScorePrediction - awayScorePrediction) == (homeScore - awayScore)) {
            return 5;
        } else if (((homeScorePrediction > awayScorePrediction) && (homeScore > awayScore)) ||
            ((homeScorePrediction < awayScorePrediction) && (homeScore < awayScore))) {
            return 3;
        } else {
            return 0;
        }
    }

    static async updateScorePredictions(userId, leagueId, upcomingMatchesData) {
        for (let match of upcomingMatchesData) {
            for (let matchDB of this._leagueDataFromDB.predictionsData) {
                if (matchDB.matchId == match.matchId) {
                    matchDB.homeScorePrediction = match.homeScorePrediction;
                    matchDB.awayScorePrediction = match.awayScorePrediction;
                }
                break;
            }
        }

        await Users.updateLeagueDataInUserDB(userId, leagueId, this._leagueDataFromDB);
    }

    static async getPastMatchesData(userId, leagueId, rival) {
        const [, endOfPeriod] = setPeriods(0);
        let allLeagueDataFromDB;
        if (rival) {
            allLeagueDataFromDB = await Users.getLeagueData(rival, leagueId);
        } else {
            allLeagueDataFromDB = await Users.getLeagueData(userId, leagueId);
        }
        const pastMatchesData = allLeagueDataFromDB.predictionsData.filter(match => {
            if (Date.parse(match.date) < endOfPeriod) {
                return match;
            }
        });

        return sortMatchesList(pastMatchesData);
    }

    static async getSelectedUsersData(userId, leagueId, users) {
        const allUsersData = await Users.getUsersAllDataFromDB(userId, leagueId, users),
            usersIdList = allUsersData.usersIdList,
            leagueNewData = await League.getLeagueNewData(leagueId),
            matchesOfLeagueNewData = leagueNewData['fixtures-results'].matches,
            selectedUsersData = [],
            sortedUserIdList = [];

        for (let user of usersIdList) {
            for (let item of allUsersData[user].leaguesIdList) {
                if (item == leagueId) {
                    sortedUserIdList.push(user);
                    selectedUsersData[user] = allUsersData[user];
                }
            }
        }

        selectedUsersData.usersIdList = sortedUserIdList;

        for (let user of sortedUserIdList) {
            allUsersData[user][leagueId] =
                await Users.updateLeagueData(matchesOfLeagueNewData, allUsersData[user][leagueId]);
        }

        await Users.updateAllUsersInDB(userId, leagueId, users, allUsersData);

        selectedUsersData.usersIdList.sort((userA, userB) => {
            let userAPts = selectedUsersData[userA][leagueId].sumOfPredictionPts,
                userBPts = selectedUsersData[userB][leagueId].sumOfPredictionPts;

            if (userAPts > userBPts) {
                return -1;
            }

            if (userAPts < userBPts) {
                return 1;
            }

            if (userAPts == userBPts) {
                return 0;
            }
        });

        return selectedUsersData;
    }
}

export default Users;
