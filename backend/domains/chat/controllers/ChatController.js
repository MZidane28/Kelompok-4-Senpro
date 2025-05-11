const asyncHandler = require('express-async-handler')
const bcrypt = require("bcrypt");
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const moment = require('moment-timezone');

const ChatQuery = require("../query/ChatQuery")
const VectorQuery = require("../query/VectorDBQuery")
/**
 * GET /chat/sessions
 * mengambil semua chat session user
*/
const GetChatSessions = asyncHandler(async (req, res, next) => {
    const user_data = req.user;

    // query chat session
    const chatGetAllSessions = await ChatQuery.selectUserChatSession(user_data.id);
    if (chatGetAllSessions.sql_error_message) {
        throw new Error(chatGetAllSessions.sql_error_message);
    }
    const all_chat_sessions = chatGetAllSessions.SQLResponse.rows;


    return res.status(200).json({ message: "Chats retrieved", sessions: [...all_chat_sessions] })
})

/**
 * GET /chat/logs
 * mengambil chat logs tertentu
*/
const GetChatLogs = asyncHandler(async (req, res, next) => {
    const user_data = req.user;
    const { chat_id, cursor } = req.query

    // check if user is in session
    const chatCheckSessionValid = await ChatQuery.selectSpecificChatSession(user_data.id, chat_id);
    if (chatCheckSessionValid.sql_error_message) {
        throw new Error(chatCheckSessionValid.sql_error_message);
    } else if (chatCheckSessionValid.SQLResponse?.rowCount == 0) {
        return res.status(401).json({ message: "Chat session not found" })
    }

    // query chat session
    const chatQueryResponse = await ChatQuery.selectChatLogs(cursor, chat_id);
    if (chatQueryResponse.sql_error_message) {
        throw new Error(chatQueryResponse.sql_error_message);
    }

    const chat_data = chatQueryResponse.SQLResponse.rows;



    return res.status(200).json({ message: "Chat retrieved", logs: [...chat_data] })
})

/**
 * POST /chat
 * post chat baru atau insert chat lagi
*/
const PostChat = asyncHandler(async (req, res, next) => {
    const user_data = req.user;
    const { is_new, chat_id, user_question } = req.body;


    if (user_question) {
        if (typeof user_question === 'string') {
            if (user_question.trim().length == 0) {
                return res.status(400).json({ message: "There has to be a question" })
            }
        } else {
            return res.status(400).json({ message: "Input question must be text" })
        }
    } else {
        return res.status(400).json({ message: "Input question must be filled" })
    }

    let chat_session = null;

    // add chat (jika belum ada)
    const create_new_title = "SOMETHING" // suruh model bikinin title
    if (is_new) {
        responseChatInsert = await ChatQuery.insertNewChatSession(user_data.id, create_new_title)
        console.log(responseChatInsert.SQLResponse.rows)
        if (responseChatInsert.sql_error_message) {
            throw new Error(checkUserResponse.sql_error_message);
        }
        chat_session = responseChatInsert.SQLResponse.rows[0];
    }
    // ambil chat yang sudah ada
    else {
        responseChatSessionSearch = await ChatQuery.selectSpecificChatSession(user_data.id, chat_id)
        if (responseChatSessionSearch.sql_error_message) {
            throw new Error(checkUserResponse.sql_error_message);
        } else if (responseChatSessionSearch.SQLResponse?.rowCount == 0) {
            return res.status(400).json({ message: "Chat session not found" })
        }

        chat_session = responseChatSessionSearch.SQLResponse.rows[0]
    }

    // query 5 konteks dari vectordb
    //let chat_relative_context = VectorQuery.find_relative_conversation(user_question);
    let chat_relative_context = "";
    // kombinasi konteks
    let chat_combined_prompt = `
        QUESTION:
        ${user_question} \n

        PREVIOUS QUESTION (Use only if relevant):
        bla bla \n

        RELATIVE CONTEXT:
        ${chat_relative_context}

        prompt darimu khel ada tambahan??
    `

    // get response from ai dan vector embedding




    // insert response dan chat user ke database
    //console.log(chat_session);
    const chatInsertResponse = await ChatQuery.insertUserAndAI("Test AI", user_question, chat_session.id)
    if (chatInsertResponse.sql_error_message) {
        throw new Error(chatInsertResponse.sql_error_message);
    }

    // insert embedding ke vectordb


    return res.status(200).json({ message: "Chat uploaded", ai_response: "Test AI", error_ai: false, error_response: null })
})

module.exports = {
    GetChatSessions,
    PostChat,
    GetChatLogs
}