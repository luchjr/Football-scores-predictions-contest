const Router = require('express'),
    router = new Router(),
    controller = require('./authController'),
    { check } = require("express-validator"),
    authMiddleware = require('./middlewaree/authMiddleware'),
    roleMiddleware = require('./middlewaree/roleMiddleware');

router.post('/registration', [
    check('username', "Username cannot be empty").notEmpty(),
    check('password', "Password must be at least 4 and less than 10 characters").isLength({ min: 4, max: 10 })
], controller.registration);
router.post('/login', controller.login);
router.get('/users', roleMiddleware(["ADMIN"]), controller.getUsers);

module.exports = router;