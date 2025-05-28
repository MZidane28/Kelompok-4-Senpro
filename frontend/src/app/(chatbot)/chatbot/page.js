'use client';
import Sidebar from "@/components/chatbot/Chatbotsidebar";
import dynamic from 'next/dynamic';
import { useState } from "react";

const ChatBot = dynamic(() => import('@/components/chatbot/chatBot'), {
  ssr: false,
});

function Page() {
  const [chatTitles, setChatTitles] = useState({
    today: [],
    yesterday: [],
    past7days: ['Talked about anxiety with the bot 🧠'],
    past30days: [],
  });

  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [presetMessages, setPresetMessages] = useState([]);

  const handleSelectChat = (title) => {
    if (title === 'Talked about anxiety with the bot 🧠') {
      setCurrentSessionId("anxiety-session");
      setPresetMessages([
        { id: 1, text: "I've been feeling anxious a lot lately.", type: 'user' },
        { id: 2, text: "I'm sorry to hear that. Want to talk about what's causing it?", type: 'bot' },
        { id: 3, text: "I think it's school and social stuff...", type: 'user' },
        { id: 4, text: "That's understandable. It can be a lot. You're not alone in this.", type: 'bot' },
        { id: 5, text: "Thanks. It's good to hear that.", type: 'user' },
        { id: 6, text: "You're welcome. I'm here anytime you need to talk 🫂", type: 'bot' },
      ]);
    } else {
      setCurrentSessionId(null);
      setPresetMessages([]);
    }
  };

  const handleNewChat = () => {
    const newId = crypto.randomUUID();
    setCurrentSessionId(newId);
    return newId;
  };

  const handleFirstMessage = async (msg, sessionId, title) => {
    const formData = new URLSearchParams();
    formData.append("msg", msg);
    formData.append("session_id", sessionId);

    await fetch("http://localhost:8080/embedding", {
      method: "POST",
      body: formData,
    });

    const titleRes = await fetch("http://localhost:8080/title", {
      method: "POST",
      body: formData,
    });

    setSessions((prev) =>
      prev.map((s) =>
        s.id === sessionId ? { ...s, title, firstMsg } : s
      ))
      
    setChatTitles((prev) => ({
      ...prev,
      today: [...prev.today, title],
    }));
  };

  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 80px" }}>
      <main className="flex flex-1 h-full overflow-hidden">
      <Sidebar
        chatTitles={chatTitles}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
      />
        <div className="flex flex-col flex-1 h-full overflow-hidden">
          <ChatBot
            sessionId={currentSessionId}
            onFirstMessage={handleFirstMessage}
            presetMessages={presetMessages}
          />
        </div>
      </main>
    </div>
  );
}

export default Page;
