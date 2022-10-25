const express = require('express'),
	bodyParser = require('body-parser'),
	morgan = require('morgan'),
	fs = require('file-system'),
	dbFilePath = 'users.json',
	mongoose = require('mongoose'),
	authRouter = require('./authRouter'),
	app = express(),
	authMiddleware = require('./middlewaree/authMiddleware');

app.use(bodyParser.json({ limit: '10mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(morgan('common'));
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
	next();
});
app.use("/auth", authRouter);

const start = async () => {
	try {
		await mongoose.connect(``); //code by request (watch README)
		app.listen(3000, () => console.log('Server has been started...'));
	} catch (e) {
		console.log(e);
	}
};

start();

app.get('/api/:userid', authMiddleware, (req, res) => {
	if (req.user.username == req.params.userid) {
		const users = getUserDataFromDB(),
			userData = users[req.params.userid];
		res.send(userData);
	}
});

app.get('/api/:userid/:leagueid', (req, res) => {
	try {
		const users = getUserDataFromDB(),
			userData = users[req.params.userid],
			league = userData[req.params.leagueid];

		res.send(league);
	} catch (e) {
		console.log(e);
	}
});


app.get('/api/:userid/:leagueid/users', (req, res) => {
	const users = getUserDataFromDB();

	res.send(users);
});

app.put('/api/:userid/:leagueid/users', (req, res) => {
	let users = getUserDataFromDB();

	users = req.body;

	setUserDataToDB(users);

	res.sendStatus(204);
});

app.put('/api/:userid', (req, res) => {
	const users = getUserDataFromDB();

	users[req.params.userid] = req.body;

	setUserDataToDB(users);

	res.sendStatus(204);
});

app.put('/api/:userid/:leagueid', (req, res) => {
	const users = getUserDataFromDB();

	let userData = users[req.params.userid],
		leaguePredictionsData = userData[req.params.leagueid],
		updatedLeaguePredictionsData = req.body;

	leaguePredictionsData = updatedLeaguePredictionsData;
	userData[req.params.leagueid] = leaguePredictionsData;
	users[req.params.userid] = userData;

	setUserDataToDB(users);

	res.sendStatus(204);
});

function getUserDataFromDB() {
	const users = JSON.parse(fs.readFileSync(dbFilePath, 'utf8'));

	return users;
}

function setUserDataToDB(users) {
	fs.writeFileSync(dbFilePath, JSON.stringify(users));
}