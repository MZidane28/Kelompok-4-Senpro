const { body, validationResult } = require('express-validator');

const validatePostJournal = [
    body('journal_title')
        .isString()
        .withMessage('Journal title must be a string')
        .notEmpty()
        .withMessage('Journal title cannot be empty'),
    body('journal_body')
        .isString()
        .withMessage('Journal body must be a string')
        .notEmpty()
        .withMessage('Journal body cannot be empty'),
    body('mood_level')
        .isString()
        .withMessage('Mood level must be a string')
        .isIn(['excited', 'sad', 'angry', 'normal', 'happy'])
        .withMessage('Mood level must be one of: excited, sad, angry, normal, happy')
        .notEmpty()
        .withMessage('Mood level cannot be empty'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next(); 
    }
];

module.exports = {
    validatePostJournal
}