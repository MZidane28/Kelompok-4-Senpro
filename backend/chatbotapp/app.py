from flask import Flask, request, jsonify
from src.helper import download_hugging_face_embeddings
from langchain_pinecone import PineconeVectorStore
from langchain_groq import ChatGroq
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.documents import Document
from langchain_core.runnables import Runnable
from langchain.prompts import PromptTemplate, ChatPromptTemplate
from langchain.chains.combine_documents.stuff import create_stuff_documents_chain
from flask_cors import CORS
from dotenv import load_dotenv
from src.prompt import *
import uuid
import datetime
import os
import re

app = Flask(__name__)
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:3000"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True,
        "expose_headers": ["Content-Type"]
    }
})

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
    return response
load_dotenv()

PINECONE_API_KEY = os.environ.get('PINECONE_API_KEY')
GROQ_API_KEY = os.environ.get('GROQ_API_KEY')
os.environ["PINECONE_API_KEY"] = PINECONE_API_KEY
os.environ["GROQ_API_KEY"] = GROQ_API_KEY

embeddings = download_hugging_face_embeddings()
index_name = "empati"
docsearch = PineconeVectorStore.from_existing_index(index_name=index_name, embedding=embeddings)
retriever = docsearch.as_retriever(search_type="similarity", search_kwargs={"k": 3})

llm = ChatGroq(model="deepseek-r1-distill-llama-70b", temperature=0.7, max_tokens=200)
prompt = ChatPromptTemplate.from_messages([("system", system_prompt), ("human", "{input}")])
qa_chain = create_stuff_documents_chain(llm, prompt)
rag_chain = create_retrieval_chain(retriever, qa_chain)

@app.route("/embed-only", methods=["POST"])
def embed_only():
    data = request.get_json()
    msg = data.get("chat_body")

    if not msg:
        return jsonify({"error": "Missing 'chat_body' field in JSON"}), 400

    vector = embeddings.embed_query(msg)

    return jsonify({
        "embedded": vector,
    })


@app.route("/response-only", methods=["POST"])
def response_only():
    data = request.get_json()
    msg = data.get("prompt")
    context = data.get("context") 

    if not msg:
        return jsonify({"error": "Missing 'prompt' field in JSON"}), 400
    
    if not context:
        return jsonify({"error": "Missing 'context' field in JSON"}), 400

    combined_input = f"""
        USER QUESTION:
        {msg}

        CONTEXT:
        {context if context else "No additional context provided."}
    """
    temp = create_retrieval_chain(context, qa_chain)
    response = temp.invoke({"input": msg}) 

    raw_answer = response["answer"]

    cleaned_answer = re.sub(r"<think>.*?</think>", "", raw_answer, flags=re.DOTALL).strip()
    print("\n[RAW RESPONSE]:\n", raw_answer)

    embedded_cleaned_answer = embeddings.embed_query(cleaned_answer)

    return jsonify({
        "ai_response": cleaned_answer,
        "embedding": embedded_cleaned_answer,
    })

@app.route("/title-only", methods=["POST"])
def title_only():
    data = request.get_json()
    msg = data.get("chat_body")
    
    title_prompt = PromptTemplate.from_template(
        "Generate a short, clean, human-readable title (max 5 words) for the following message. Don't include extra tags or reasoning:\n\n{context}"
    )
    title_chain = create_stuff_documents_chain(
        llm,
        title_prompt,
        document_variable_name="context"
    )

    documents = [Document(page_content=msg)]
    title_response = title_chain.invoke({"context": documents})
    raw_title = title_response.strip()
    title = re.sub(r"<think>.*?</think>", "", raw_title, flags=re.DOTALL).strip()
    
    print("\n[GENERATED TITLE]:", title, flush=True)
    return jsonify({"title": title})


@app.route("/embedding", methods=["POST"])
def embedding():
    msg = request.form["msg"]
    session_id = request.form.get("session_id", str(uuid.uuid4()))
    user_id = request.form.get("user_id", "anonymous")

    metadata = {
        "session_id": session_id,
        "user_id": user_id,
        "type": "question",
        "timestamp": datetime.datetime.utcnow().isoformat()
    }

    docsearch.add_texts([msg], metadatas=[metadata])
    return jsonify({"status": "success", "session_id": session_id})


@app.route("/generateresponse", methods=["POST"])
def generate_response():
    msg = request.form["msg"]
    session_id = request.form.get("session_id", str(uuid.uuid4()))
    user_id = request.form.get("user_id", "anonymous")

    # Create filtered retriever
    filtered_retriever = docsearch.as_retriever(
        search_type="similarity",
        search_kwargs={
            "k": 3,
            "filter": {
                "session_id": session_id  # or tambahin user id??
            }
        }
    )

    # Use filtered retriever in a new RAG chain
    filtered_chain = create_retrieval_chain(filtered_retriever, qa_chain)
    response = filtered_chain.invoke({"input": msg})

    raw_answer = response["answer"]
    cleaned_answer = re.sub(r"<think>.*?</think>", "", raw_answer, flags=re.DOTALL).strip()
    print("\n[RAW RESPONSE]:\n", raw_answer)

    metadata = {
        "session_id": session_id,
        "user_id": user_id,
        "type": "response",
        "timestamp": datetime.datetime.utcnow().isoformat()
    }

    docsearch.add_texts([cleaned_answer], metadatas=[metadata])
    return jsonify({"response": cleaned_answer})


@app.route("/title", methods=["POST"])
def generate_title():
    msg = request.form["msg"]

    title_prompt = PromptTemplate.from_template(
        "Generate a short, clean, human-readable title (max 5 words) for the following message. Don't include extra tags or reasoning:\n\n{context}"
    )
    title_chain = create_stuff_documents_chain(
        llm,
        title_prompt,
        document_variable_name="context"
    )

    documents = [Document(page_content=msg)]
    title_response = title_chain.invoke({"context": documents})
    raw_title = title_response.strip()
    title = re.sub(r"<think>.*?</think>", "", raw_title, flags=re.DOTALL).strip()
    
    print("\n[GENERATED TITLE]:", title, flush=True)
    return jsonify({"title": title})

@app.route("/journalresponse", methods=["POST"])
def journal_response():
    journal = request.form["journal"]
    user_id = request.form.get("user_id", "anonymous")

    journal_prompt = ChatPromptTemplate.from_messages([
        ("system", "You are a thoughtful and empathetic companion. Respond warmly and insightfully to the user's journal entry."),
        ("human", "{journal}")
    ])

    journal_chain = create_stuff_documents_chain(llm, journal_prompt)
    documents = [Document(page_content=journal)]
    response = journal_chain.invoke({"journal": documents})

    raw_response = response.strip()
    cleaned_response = re.sub(r"<think>.*?</think>", "", raw_response, flags=re.DOTALL).strip()

    print("\n[JOURNAL RESPONSE]:", cleaned_response, flush=True)
    return jsonify({"response": cleaned_response})


@app.route("/")
def home():
    return "Chatbot API is running."


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=True)
