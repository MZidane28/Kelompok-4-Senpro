const db = require("../../../configs/dbConfig")
const moment = require("moment-timezone")

/**
 * @brief isnert journal baru
 */
const addNewJournal = async (user_id, journal_title, journal_body, mood_level) => {
    const client = await db.connect();
    try {
        const insertNewJournal = `
            INSERT INTO journal_session (journal_title, journal_body, user_id, mood_level) VALUES
            ($1, $2, $3, $4) RETURNING *;
            ;
        `
        const resultSession = await client.query(insertNewJournal, [journal_title, journal_body, user_id, mood_level]);
        return {
            is_error: false,
            SQLResponse: resultSession,
            error_message: null,
            error: null,
        }
    } catch (error) {

        return {
            is_error: true,
            SQLResponse: null,
            other_error_message: null,
            sql_error_message: error.message,
            error: error,
        }
    } finally {
        client.release()
    }
}

/**
 * @brief update journal baru by id
 */
const SaveJournal = async (user_id, journal_title, journal_body, mood_level, journal_id) => {
    const client = await db.connect();
    try {
        const queryText = `
                UPDATE journal_session
                SET 
                    journal_title = $1,
                    journal_body = $2,
                    mood_level = $3,
                    last_edited = NOW()
                WHERE 
                    id = $4 AND user_id = $5
                RETURNING *;
            `;
        const resultSession = await client.query(queryText, [journal_title, journal_body, mood_level, journal_id, user_id]);
        return {
            is_error: false,
            SQLResponse: resultSession,
            error_message: null,
            error: null,
        }
    } catch (error) {

        return {
            is_error: true,
            SQLResponse: null,
            other_error_message: null,
            sql_error_message: error.message,
            error: error,
        }
    } finally {
        client.release()
    }
}

/**
 * @brief update journal baru by id
 */
const SaveJournalAI = async (user_id, ai_response, journal_id) => {
    const client = await db.connect();
    try {
        const queryText = `
                UPDATE journal_session
                SET 
                    ai_response = $1,
                    last_edited = NOW()
                WHERE 
                    id = $2 AND user_id = $3
                RETURNING *;
            `;
        const resultSession = await client.query(queryText, [ai_response, journal_id, user_id]);
        return {
            is_error: false,
            SQLResponse: resultSession,
            error_message: null,
            error: null,
        }
    } catch (error) {

        return {
            is_error: true,
            SQLResponse: null,
            other_error_message: null,
            sql_error_message: error.message,
            error: error,
        }
    } finally {
        client.release()
    }
}

/**
 * @brief delete journal baru by user id and journal id
 */
const DeleteJournal = async (user_id, journal_id) => {
    const client = await db.connect();
    try {
        const queryText = `
                DELETE FROM journal_session
                WHERE id = $1 AND user_id = $2
                RETURNING id;
            `;
        const resultSession = await client.query(queryText, [journal_id,user_id]);
        return {
            is_error: false,
            SQLResponse: resultSession,
            error_message: null,
            error: null,
        }
    } catch (error) {

        return {
            is_error: true,
            SQLResponse: null,
            other_error_message: null,
            sql_error_message: error.message,
            error: error,
        }
    } finally {
        client.release()
    }
}

/**
 * @brief search journal by id user and id journal
 */
const GetJournalByIdQuery = async (user_id, journal_id) => {
    const client = await db.connect();
    try {
        const searchJournal = `
            SELECT * FROM journal_session WHERE user_id = $1 AND id = $2;
        `
        const resultSession = await client.query(searchJournal, [user_id, journal_id]);
        return {
            is_error: false,
            SQLResponse: resultSession,
            error_message: null,
            error: null,
        }
    } catch (error) {

        return {
            is_error: true,
            SQLResponse: null,
            other_error_message: null,
            sql_error_message: error.message,
            error: error,
        }
    } finally {
        client.release()
    }
}

/**
 * @brief search journal by id user
 */
const GetJournalUser = async (user_id) => {
    const client = await db.connect();
    try {
        const searchJournal = `
            SELECT id, journal_title, last_edited FROM journal_session WHERE user_id = $1 ORDER BY last_edited DESC;
        `
        const resultSession = await client.query(searchJournal, [user_id]);
        return {
            is_error: false,
            SQLResponse: resultSession,
            error_message: null,
            error: null,
        }
    } catch (error) {

        return {
            is_error: true,
            SQLResponse: null,
            other_error_message: null,
            sql_error_message: error.message,
            error: error,
        }
    } finally {
        client.release()
    }
}

module.exports = {
    addNewJournal,
    GetJournalByIdQuery,
    GetJournalUser,
    SaveJournal,
    DeleteJournal,
    SaveJournalAI
}