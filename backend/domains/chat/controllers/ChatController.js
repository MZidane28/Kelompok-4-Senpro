const asyncHandler = require('express-async-handler')
const bcrypt = require("bcrypt");
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const moment = require('moment-timezone');
const axios = require("axios")

const ChatQuery = require("../query/ChatQuery")
const VectorQuery = require("../query/VectorDBQuery")
const FlaskQuery = require("../query/FlaskReq")
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
    let chat_id_context = 0;

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
    let create_new_title = "" // suruh model bikinin title
    if (is_new) {
        const response_title = await FlaskQuery.requestChatTitle(user_question);
        if (response_title.is_error) {
            console.log(response_title.error_msg)
            return res.status(500).json({ message: "Error when generating response" })
        } else {
            create_new_title = response_title.title
        }


        responseChatInsert = await ChatQuery.insertNewChatSession(user_data.id, create_new_title)
        console.log(responseChatInsert.SQLResponse.rows)
        if (responseChatInsert.sql_error_message) {
            throw new Error(checkUserResponse.sql_error_message);
        }
        chat_session = responseChatInsert.SQLResponse.rows[0];
        chat_id_context = chat_session.id
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
        
        chat_id_context = chat_session.id
    }

    // get embedding
    let vector_embed = []
    const response_embed = await FlaskQuery.getEmbeddedPrompt(user_question);
    if (response_embed.is_error) {
        console.log(response_embed.error_msg)
        return res.status(500).json({ message: "Error when generating response" })
    } else {
        vector_embed = response_embed.embedded
    }


    // query 5 konteks dari vectordb
    let chat_relative_context = await VectorQuery.find_relative_conversation(chat_id_context, vector_embed);
    console.log("POINT", chat_relative_context)
    //let chat_relative_context = "";
    let contextText = "EMPTY"
    if (chat_relative_context && chat_relative_context.length > 0) {
        contextText = chat_relative_context.map(result => {
            return result.payload?.chat || result.payload?.content || result.payload?.text || "";
        }).join("\n");
    }

    // kombinasi konteks
    let chat_combined_prompt = `${contextText ?? "EMPTY"}`

    // get response from ai dan vector embedding
    let ai_response = "";
    let new_vector_embed = []
    //console.log("CONTEXT",chat_combined_prompt)
    const response_generate = await FlaskQuery.getAIResponse(chat_combined_prompt, user_question);
    if (response_generate.is_error) {
        console.log(response_generate.error_msg)
        return res.status(500).json({ message: "Error when generating response" })
    } else {
        ai_response = response_generate.ai_response
        new_vector_embed = response_generate.embedding
    }

    // insert response dan chat user ke database
    //console.log(chat_session);
    const chatInsertResponse = await ChatQuery.insertUserAndAI(ai_response, user_question, chat_session.id)
    if (chatInsertResponse.sql_error_message) {
        throw new Error(chatInsertResponse.sql_error_message);
    }

    // insert embedding ke vectordb
    const insertEmbedding = await VectorQuery.insert_new_vector(chat_id, new_vector_embed, chat_combined_prompt)


    return res.status(200).json({ message: "Chat uploaded", ai_response: ai_response, title: create_new_title, error_ai: false, error_response: null })
})

module.exports = {
    GetChatSessions,
    PostChat,
    GetChatLogs
}