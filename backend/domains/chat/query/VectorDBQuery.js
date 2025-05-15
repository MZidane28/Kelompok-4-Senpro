const { client } = require("../../../configs/QdrantClient")

const find_relative_conversation = async (chat_id, prompt_vector) => {
    try {
        const results = await client.search('empati', {
            vector: prompt_vector,
            limit: 5,
            filter: {
                must: [
                    {
                        key: 'category',
                        match: {
                            value: chat_id
                        }
                    }
                ]
            }
        });
        console.log(results);
    } catch (error) {
        throw error
    }

}

const insert_new_vector = async (chat_id, vector) => {
    try {
        const response = await client.upsert('empati', {
            points: [
                {
                    id: 1, // can be a number or string
                    vector: vector, // must match the dimension defined when creating the collection
                    payload: {
                        chat_session_id: chat_id,
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