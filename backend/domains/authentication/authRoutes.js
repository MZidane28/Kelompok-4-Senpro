const express = require('express')
const router = express.Router();
const AuthController = require("./controllers/AuthController")
const AuthMiddleware = require("./middleware/AuthMiddleware")

router.route('/login').post(AuthController.loginUser)
router.route('/send-mail').get(AuthController.sendMail)
router.route('/logout').patch(AuthController.logoutUser)
router.route('/ensure-user').get(AuthMiddleware.MiddlewareEnsureUser, AuthController.ensureUser)
router.route('/register').post(AuthController.registerUser)
router.route('/activate/:token').patch(AuthController.activateAccount)
router.route('/user-info').get(AuthMiddleware.MiddlewareEnsureUser, AuthController.getUserInformation)

router.route('/forget-password').post(AuthController.forgetPasswordSend)
router.route('/forget-password/change').post(AuthController.forgetPasswordChange)

module.exports = router