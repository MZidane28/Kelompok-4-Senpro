const express = require('express')
const router = express.Router();

const JournalController = require("./controllers/JournalController")
const JournalMiddleware = require("./middleware/ValidationMiddleware")

const AuthMiddleware = require("../authentication/middleware/AuthMiddleware")

router.route('/session/:id').get(AuthMiddleware.MiddlewareEnsureUser, JournalController.GetJournalById)
router.route('/session/:id').delete(AuthMiddleware.MiddlewareEnsureUser, JournalController.DeleteJournalById)
router.route('/session/:id').patch(AuthMiddleware.MiddlewareEnsureUser, JournalController.PatchJournalById)
router.route('/list').get(AuthMiddleware.MiddlewareEnsureUser, JournalController.GetJournalList)
router.route('/ai/:id').get(AuthMiddleware.MiddlewareEnsureUser, JournalController.GetAIResponseById)
router.route('/').post(AuthMiddleware.MiddlewareEnsureUser, JournalMiddleware.validatePostJournal, JournalController.PostJournal)

module.exports = router