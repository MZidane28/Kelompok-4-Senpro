const express = require('express')
const router = express.Router();
const AuthController = require("./controllers/AuthController")
const AuthMiddleware = require("./middleware/AuthMiddleware")

router.route('/login').post(AuthController.loginUser)
router.route('/logout').put(AuthController.logoutUser)
router.route('/ensure-user').get(AuthMiddleware.MiddlewareEnsureUser, AuthController.ensureUser)
router.route('/register').post(AuthController.registerUser)

router.route('/forget-password').post(AuthController.forgetPasswordSend)
router.route('/forget-password/change').post(AuthController.forgetPasswordChange)

module.exports = router