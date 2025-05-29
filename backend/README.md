# Run Express
prasyarat:
- npm i
- docker compose up -d (buat qdrant local)
- pastikan env sudah sesuai
- npm run dev (port 3500)

# Endpoint Chat

## GET /chat/sessions
Endpoint untuk dapatkan semua histori chat buat ditampilkan di sidebar
RESPONSE:
```
{
    message: "Chats retrieved", 
    sessions: [{
        id: int,
        user_id: int,
        chat_title: string,
        last_edited timestamp,
        started_at: timestamp
    }] 
}
```

## GET /chat/logs
Endpoint untuk dapatkan isi dari chat session tertentu
REQUEST:
```
query {
    chat_id: int
}
```

RESPONSE:
```
{
    message: "Chats retrieved", 
    logs: [{
        fk_chat_id: int,
        created_at: timestamp,
        message: string,
        ai_response: string,
    }] 
}
```

## POST /chat
Endpoint untuk dapatkan respon AI
REQUEST:
```
body {
    is_new: bool, 
    chat_id: int, 
    user_question: string
}
```

RESPON:
```
body {
    message: "Chat uploaded", 
    ai_response: "Test AI", 
    error_ai: false, 
    error_response: null,
    title : ""
}
```