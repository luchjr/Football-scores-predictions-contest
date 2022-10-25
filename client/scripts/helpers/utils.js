export const parseCurrentURL = () => {
    const urlParts = {};

    [urlParts.page, urlParts.userId, urlParts.leagueId, urlParts.users, urlParts.rival] = location.hash.slice(2).split('/');

    return urlParts;
};

export const getNowTime = () => Date.parse(new Date());


export const setPeriods = numberOdDays => {
    let startOfPeriod = new Date(),
        endOfPeriod = new Date();

    startOfPeriod.setHours(0, 0, 0, 0);
    startOfPeriod.setDate(startOfPeriod.getDate() - 1);
    startOfPeriod = Date.parse(startOfPeriod);

    endOfPeriod.setHours(0, 0, 0, 0);
    endOfPeriod.setDate(endOfPeriod.getDate() + numberOdDays);
    endOfPeriod = Date.parse(endOfPeriod);

    return [startOfPeriod, endOfPeriod];
};

export const getDateStamp = (matchDate, matchTime) => Date.parse(`${matchDate}T${matchTime}`);

export const correctTime = match => {
    let matchTime = new Date(getDateStamp(match.date, match.time)),
        minutes;

    matchTime.setHours(matchTime.getHours() + -new Date().getTimezoneOffset() / 60 - 1);
    minutes = matchTime.getMinutes().toString();
    minutes = /^(^0)/.test(minutes) ? `${minutes}0` : minutes;
    match.time = `${matchTime.getHours()}:${minutes}`;
};

export const convertIdToLeagueName = leagueId => {
    switch (leagueId) {
        case '1':
            return 'Premier League';
        case '25':
            return 'Europa League';
        case '24':
            return 'Champions League';
        case '92':
            return 'Bundesliga';
        case '93':
            return 'Serie A';
        case '94':
            return 'LaLiga';
        default:
            return `League ${leagueId}`;
    }
};

export const showActionMsg = (text, classname) => {
    const saveMsg = document.createElement('div');

    saveMsg.classList.add('action-msg');
    classname && saveMsg.classList.add(`${classname}`);
    saveMsg.innerText = text;
    const body = document.body;
    body.appendChild(saveMsg);
    setTimeout(() => saveMsg.classList.add('action-msg_hidden'), 5000);
    setTimeout(() => saveMsg.classList.add('action-msg_active'), 5);
    setTimeout(() => saveMsg.remove(), 7300);
};

export const getPageTitleHTML = async(page, rival) => {
    switch (page) {
        case 'upcoming-matches':

            return `
                <h1 class="page-title">Upcoming matches</h1>
                <h3 class="page-subtitle">Make your predictions for matches</h3>
            `;
        case 'archive':

            return `
                <h1 class="page-title">Archive</h1>
                <h3 class="page-subtitle">Past matches and predictions results</h3>
                ${rival ? `<h3 class="page-subtitle rival">${rival}'s archive<h3>` : ''}
            `;
        case 'contest':

            return `
                <h1 class="page-title">Contest</h1>
                <h3 class="page-subtitle">Сompare your results with other participants</h3>
            `;
        case 'manage-leagues':

            return `
                <h1 class="page-title page-title_leagues">Manage leagues</h1>
                <h3 class="page-subtitle page-subtitle_leagues">Subscribe for leagues and start the game</h3>
            `;
        default:
            return;
    }
};

export const disableBtn = (btn, usernameInput, passwordInput) => {
    btn.disabled = !(usernameInput.value.trim() && passwordInput.value.trim());
};

export const validateValues = (btn, usernameInput, passwordInput) => {
    const usernameValue = usernameInput.value,
        passwordValue = passwordInput.value;

    if (!isValidUsernameValue(usernameValue.length)) {
        resetForm([usernameInput]);
        disableBtn(btn, usernameInput, passwordInput);
        showActionMsg('Error. Enter username 4 to 10 char.', 'action-msg_wrong-input');
    }

    if (!isValidPasswordValue(passwordValue.length)) {
        resetForm([passwordInput]);
        disableBtn(btn, usernameInput, passwordInput);
        showActionMsg('Error. Enter password 4 to 10 char.', 'action-msg_wrong-input');
    }

    if (isValidUsernameValue(usernameValue.length) && isValidPasswordValue(passwordValue.length)) {
        return true;
    }
};

const isValidUsernameValue = (value) => value >= 1 && value <= 10;

const isValidPasswordValue = (value) => value >= 4 && value <= 10;

const resetForm = inputs => {
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].value = '';
    }
};

export const logout = () => {
    sessionStorage.clear();
    location.hash = '/';
};

export const sortMatchesList = pastMatchesData => {
    pastMatchesData.sort((matchA, matchB) => {
        let matchADate = Date.parse(matchA.date),
            matchBDate = Date.parse(matchB.date);
        if (matchADate > matchBDate) {
            return -1;
        }
        if (matchADate < matchBDate) {
            return 1;
        }
        if (matchADate == matchBDate) {
            return 0;
        }
    });

    return pastMatchesData;
};