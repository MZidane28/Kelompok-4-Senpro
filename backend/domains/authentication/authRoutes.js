const express = require('express')
const router = express.Router();
const AuthController = require("./controllers/AuthController")

router.route('/login').post(AuthController.loginUser)
router.route('/logout').put(AuthController.logoutUser)
router.route('/ensure-user').get(AuthController.ensureUser)
router.route('/register').post(AuthController.registerUser)

module.exports = router