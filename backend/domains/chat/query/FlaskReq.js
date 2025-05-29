const axios = require("axios")

const requestChatTitle = async (chat_body) => {
    try {
        const response = await axios.post(process.env.FLASK_URL + "/title-only", {
            chat_body: chat_body
        })

        return {
            title: response.data.title,
            is_error: false,
            error_msg: null
        }
    } catch (error) {
        console.log(error.message)
        return {
            title: null,
            is_error: true,
            error_msg: error.message
        }
    }
}

const getEmbeddedPrompt = async (chat_body) => {
    try {
        const response = await axios.post(process.env.FLASK_URL + "/embed-only", {
            chat_body: chat_body
        })

        return {
            embedded: response.data.embedded,
            is_error: false,
            error_msg: null
        }
    } catch (error) {
        console.log(error.message)
        return {
            title: null,
            is_error: true,
            error_msg: error.message
        }
    }
}

const getAIResponse = async (context, prompt) => {
    try {
        console.log("XONE", context)
        const response = await axios.post(process.env.FLASK_URL + "/response-only", {
            context: context,
            prompt: prompt
        })

        return {
            ai_response: response.data.ai_response,
            embedding: response.data.embedding,
            is_error: false,
            error_msg: null
        }
    } catch (error) {
        //console.log(error)
        return {
            is_error: true,
            error_msg: error.message
        }
    }
}

module.exports = {
    requestChatTitle,
    getEmbeddedPrompt,
    getAIResponse
}