const QDrant = require('@qdrant/js-client-rest');

// TO connect to Qdrant running locally
const client = new QDrant.QdrantClient({ url: 'http://127.0.0.1:6333' });
console.log("DB Vector Connected")

async function createCollection() {
    const check_existence = await client.collectionExists('empati')
    if (check_existence.exists) {
        console.log("Empati exist in QDrant")
    } else {
        await client.createCollection("empati", {
            vectors: { size: 384, distance: "Cosine" },
        });

        await client.createPayloadIndex("empati", {
            field_name: "chat_session_id",
            field_schema: "integer",
        });
        console.log("Empati created")

    }
}

createCollection();

module.exports = {
    client
}