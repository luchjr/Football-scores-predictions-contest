const User = require('./models/User'),
    Role = require('./models/Role'),
    bcrypt = require('bcryptjs'),
    jwt = require('jsonwebtoken'),
    { validationResult } = require('express-validator'),
    dbfunc = require('./usersfunc'),
    { secret } = require("./config");

const generateAccessToken = (id, username, roles) => {
    const payload = {
        id,
        username,
        roles
    };

    return jwt.sign(payload, secret, { expiresIn: "24h" });
};

class authController {
    async registration(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {

                return res.status(400).json({ message: "Registration error", errors });
            }
            const { username, password } = req.body;
            const candidate = await User.findOne({ username });
            if (candidate) {

                return res.json({ message: "A user with the same name already exists" });
            }
            const hashPassword = bcrypt.hashSync(password, 7);
            const userRole = await Role.findOne({ value: "USER" });
            const user = new User({ username, password: hashPassword, roles: [userRole.value] });
            dbfunc.addUserToDB(username);
            await user.save();

            return res.json({ username, message: "You have successfully registered!" });
        } catch (e) {
            console.log(e);
            res.status(400).json({ message: 'Registration error' });
        }
    }

    async login(req, res) {
        try {
            const { username, password } = req.body;
            const user = await User.findOne({ username });
            if (!user) {

                return res.json({ message: `User ${username} is not found` });
            }
            const validPassword = bcrypt.compareSync(password, user.password);
            if (!validPassword) {

                return res.json({ message: `Wrong password entered` });
            }
            const token = generateAccessToken(user._id, user.username, user.roles);

            return res.json({ username, token });
        } catch (e) {
            console.log(e);
            res.status(400).json({ message: 'Login error' });
        }
    }

    async getUsers(req, res) {
        try {
            res.json('server work');
            const users = await User.find();
            res.json(users);
        } catch (e) {
            console.log(e);
        }
    }
}

module.exports = new authController();