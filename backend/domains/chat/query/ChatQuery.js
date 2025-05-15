const db = require("../../../configs/dbConfig")
const moment = require("moment-timezone")


// get chat
const selectUserChatSession = async (user_id) => {
    const client = await db.connect();
    try {
        const searchChats = `
            SELECT * from chat_session WHERE user_id = $1;
        `
        const resultSession = await client.query(searchChats, [user_id]);
        return {
            is_error : false,
            SQLResponse : resultSession,
            other_error_message : null,
            is_sql_error : null
        }
    } catch (error) {
        return {
            is_error : true,
            SQLResponse : null,
            other_error_message : null,
            sql_error_message : error.message
        }
    } finally {
        client.release()
    }
}

// get chat session based on user id
const selectSpecificChatSession = async (user_id, chat_session) => {
    const client = await db.connect();
    try {
        const searchChatSession = `
            SELECT * from chat_session WHERE id = $1 AND user_id = $2
        `
        const resultSession = await client.query(searchChatSession, [chat_session, user_id]);
        return {
            is_error : false,
            SQLResponse : resultSession,
            other_error_message : null,
            is_sql_error : null
        }
    } catch (error) {
        return {
            is_error : true,
            SQLResponse : null,
            other_error_message : null,
            sql_error_message : error.message
        }
    } finally {
        client.release()
    }
}

// get chat logs in session
const selectChatLogs = async (cursor = 0, chat_session) => {
    const client = await db.connect();
    try {
        const getChatLogs = `
            SELECT * from chat_logs 
            WHERE fk_chat_id = $1 
            ORDER BY created_at DESC 
            LIMIT 10 OFFSET $2;
        `
        const resultSession = await client.query(getChatLogs, [chat_session, cursor]);
        return {
            is_error : false,
            SQLResponse : resultSession,
            other_error_message : null,
            is_sql_error : null
        }
    } catch (error) {
        return {
            is_error : true,
            SQLResponse : null,
            other_error_message : null,
            sql_error_message : error.message
        }
    } finally {
        client.release()
    }
}

// Insert user and ai respone
const insertUserAndAI = async (ai_response, user_message, chat_session_id) => {
    const client = await db.connect();
    try {
        
        const insertUserAndAIResponse = `
            INSERT INTO chat_logs (fk_chat_id, ai_response, message) VALUES
            ($1, $2, $3) RETURNING *;
        `
        await client.query("BEGIN")
        await client.query(`
            UPDATE chat_session
            SET last_edited = NOW()
            WHERE id = $1;`,
            [chat_session_id]
        
        )
        const resultSession = await client.query(insertUserAndAIResponse, [chat_session_id, ai_response, user_message]);
        await client.query("COMMIT")
        return {
            is_error : false,
            SQLResponse : resultSession,
            other_error_message : null,
            is_sql_error : null
        }
    } catch (error) {
        await client.query("ROLLBACK")
        return {
            is_error : true,
            SQLResponse : null,
            other_error_message : null,
            sql_error_message : error.message
        }
    } finally {
        client.release()
    }
}

// Insert user and ai respone
const insertNewChatSession = async (user_id, chat_title) => {
    const client = await db.connect();
    try {
        await client.query("BEGIN")
        const addNewChatSession = `
            INSERT INTO chat_session (chat_title, user_id) VALUES
            ($1, $2) RETURNING *;
        `
        const resultSession = await client.query(addNewChatSession, [chat_title, user_id]);
        await client.query("COMMIT")
        return {
            is_error : false,
            SQLResponse : resultSession,
            other_error_message : null,
            is_sql_error : null
        }
    } catch (error) {
        await client.query("ROLLBACK")
        return {
            is_error : true,
            SQLResponse : null,
            other_error_message : null,
            sql_error_message : error.message
        }
    } finally {
        client.release()
    }
}

module.exports = {
    selectUserChatSession, 
    selectChatLogs, 
    selectSpecificChatSession,
    insertUserAndAI,
    insertNewChatSession
}