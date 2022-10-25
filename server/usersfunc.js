const express = require('express'),
    dbFilePath = 'users.json',
    fs = require('file-system');

function addUserToDB(username) {
    const users = JSON.parse(fs.readFileSync(dbFilePath, 'utf8'));

    users.usersIdList.push(username);
    users[username] = { leaguesIdList: [] };
    setUserDataToDB(users);
    return users;
}

function setUserDataToDB(users) {
    fs.writeFileSync(dbFilePath, JSON.stringify(users));
}

module.exports = {
    addUserToDB: addUserToDB
};