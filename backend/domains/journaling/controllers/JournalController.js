const asyncHandler = require('express-async-handler')
const moment = require('moment-timezone');

const JournalQuery = require("../query/JournalQuery")
const FlaskQuery = require("../../chat/query/FlaskReq")


/**
 * GET /journal/list
 * List semua jurnal user
*/
const GetJournalList = asyncHandler(async (req, res, next) => {
    const user_id = req.user.id
    const journalListQuery = await JournalQuery.GetJournalUser(user_id)
    if (journalListQuery.sql_error_message) {
        throw new Error(journalListQuery.sql_error_message);
    }

    return res.status(200).json({ message: "Journals retrieved", list: journalListQuery.SQLResponse.rows })
})


/**
 * PATCH /journal/session/:id
 * Update journal dengan data terbaru berdasarkan id
*/
const PatchJournalById = asyncHandler(async (req, res, next) => {
    const { journal_title, journal_body, mood_level } = req.body
    const journal_id = req.params.id
    const user_id = req.user.id

    const resultUpdateJournal = await JournalQuery.SaveJournal(user_id, journal_title, journal_body, mood_level, journal_id);
    if (resultUpdateJournal.sql_error_message) {
        throw new Error(resultUpdateJournal.sql_error_message);
    }

    return res.status(200).json({ message: "Journal saved", updated_journal: resultUpdateJournal.SQLResponse.rows[0] })
})

/**
 * DELETE /journal/session/:id
 * Hapus jurnal berdasarkan id
*/
const DeleteJournalById = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const user_id = req.user.id

    const DeletJournalResult = await JournalQuery.DeleteJournal(user_id, id)
    if (DeletJournalResult.sql_error_message) {
        throw new Error(DeletJournalResult.sql_error_message);
    } else if (DeletJournalResult.SQLResponse.rowCount == 0) {
        return res.status(404).json({ message: "No Journal here" })
    }

    return res.status(200).json({ message: "Journal deleted", id_journal_deleted: DeletJournalResult.SQLResponse.rows[0] })
})

/**
 * GET /journal/session/:id
 * Dapatkan data jurnal lengkap berdasarkan id
*/
const GetJournalById = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const user_id = req.user.id

    const journalByIdResult = await JournalQuery.GetJournalByIdQuery(user_id, id)
    if (journalByIdResult.sql_error_message) {
        throw new Error(journalByIdResult.sql_error_message);
    } else if (journalByIdResult.SQLResponse.rowCount == 0) {
        return res.status(404).json({ message: "No Journal here" })
    }

    return res.status(200).json({ message: "Journal found", journal: journalByIdResult.SQLResponse.rows[0] })
})

/**
 * GET /journal/ai/:id
 * Dapatkan respon AI dari model berdasarkan id
*/
const GetAIResponseById = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const user_id = req.user.id

    const journalByIdResult = await JournalQuery.GetJournalByIdQuery(user_id, id)
    if (journalByIdResult.sql_error_message) {
        throw new Error(journalByIdResult.sql_error_message);
    } else if (journalByIdResult.SQLResponse.rowCount == 0) {
        return res.status(404).json({ message: "No Journal here" })
    }
    const journal_data = journalByIdResult.SQLResponse.rows[0]
    const journal_prompt = `TITLE:${journal_data.journal_title}\n${journal_data.journal_body}`
    const flask_journal = await FlaskQuery.getJournalResponse(journal_prompt)
    if(flask_journal.is_error) {
        console.log(flask_journal.error_msg)
        console.log("ERROR FULL:", flask_journal.error)
        return res.status(500).json({message: "Error generating journal response"})
    }

    const journalAIResponse = await JournalQuery.SaveJournalAI(user_id, flask_journal.ai_response, journal_data.id)
    if (journalAIResponse.sql_error_message) {
        throw new Error(journalByIdResult.sql_error_message);
    }

    return res.status(200).json({ message: "Journal AI Created", ai_response: flask_journal.ai_response })
})

/**
 * POST /journal/
 * save jurnal baru
*/
const PostJournal = asyncHandler(async (req, res, next) => {
    const { journal_title, journal_body, mood_level } = req.body
    const user_id = req.user.id

    const resultInsertJournal = await JournalQuery.addNewJournal(user_id, journal_title, journal_body, mood_level);
    if (resultInsertJournal.sql_error_message) {
        throw new Error(resultInsertJournal.sql_error_message);
    }

    return res.status(200).json({ message: "Journal saved", new_journal: resultInsertJournal.SQLResponse.rows[0] })
})

module.exports = {
    PostJournal,
    DeleteJournalById,
    GetAIResponseById,
    GetJournalList,
    PatchJournalById,
    PostJournal,
    GetJournalById
}