const express = require('express')
const router = express.Router();

const AuthMiddleware = require("../authentication/middleware/AuthMiddleware")
const ChatController = require("./controllers/ChatController")

// TODO :
/*
    - get all chat session 
    - get chat logs in session (with pagination)
    - post new chat ()
*/


router.route('/logs').get(AuthMiddleware.MiddlewareEnsureUser, ChatController.GetChatLogs)
router.route('/sessions').get(AuthMiddleware.MiddlewareEnsureUser, ChatController.GetChatSessions)
router.route('/').post(AuthMiddleware.MiddlewareEnsureUser, ChatController.PostChat)

module.exports = router