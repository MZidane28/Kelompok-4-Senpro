const { client } = require("../../../configs/QdrantClient")
const { v4: uuidv4 } = require('uuid');
const find_relative_conversation = async (chat_id, prompt_vector) => {
    try {
        //console.log("CHAT ID", chat_id)
        const results = await client.query('empati', {
            vector: prompt_vector,
            limit: 2,
            filter: {
                must: [
                    {
                        key: 'chat_session_id',
                        match: {
                            value: chat_id
                        }
                    }
                ]
            },
            with_payload: ["chat_session_id", "content"]
        });
        return results
    } catch (error) {
        console.log(error)
        throw error
    }

}

const insert_new_vector = async (chat_id, vector, chat_text) => {
    try {
        const response = await client.upsert('empati', {
            points: [
                {
                    id: uuidv4(), // can be a number or string
                    vector: vector, // must match the dimension defined when creating the collection
                    payload: {
                        chat_session_id: chat_id,
                        content: chat_text,
                    },
                },
            ],
        });
        return {
            status: response.status
        }
    } catch (error) {
        throw error
    }
}

module.exports = {
    find_relative_conversation,
    insert_new_vector
}