'use client';
import Sidebar from "@/components/chatbot/Chatbotsidebar";
import dynamic from 'next/dynamic';
import { useState, useEffect } from "react";

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

  useEffect(() => {
    const fetchChatTitles = async () => {
      try {
        const res = await fetch("http://localhost:3500/chat/sessions", {
          credentials: 'include'
        });        
        const data = await res.json();
  
        const grouped = {
          today: [],
          yesterday: [],
          past7days: [],
          past30days: [],
        };
  
        data.sessions.forEach((session) => {
          grouped.today.push(session.chat_title); // You can enhance this to categorize by time
        });
  
        setChatTitles(grouped);
      } catch (err) {
        console.error("Failed to fetch chat titles:", err);
      }
    };
  
    fetchChatTitles();
  }, []);
  
  const handleSelectChat = async (chatTitle) => {
    try {
      const res = await fetch("http://localhost:3500/chat/sessions", {
        credentials: 'include'
      });      
      const data = await res.json();
      const session = data.sessions.find(s => s.chat_title === chatTitle);
  
      if (!session) return;
  
      const logsRes = await fetch(`http://localhost:3500/chat/logs?chat_id=${session.id}`);
      const logsData = await logsRes.json();
  
      setCurrentSessionId(session.id);
  
      const loadedMessages = logsData.logs.flatMap((log, index) => ([
        { id: index * 2, text: log.message, type: 'user' },
        { id: index * 2 + 1, text: log.ai_response, type: 'bot' }
      ]));
  
      setPresetMessages(loadedMessages);
  
    } catch (err) {
      console.error("Error loading session:", err);
    }
  };
  

  const handleNewChat = () => {
    setCurrentSessionId(null); // or undefined
  };
  

  const handleFirstMessage = async (msg, sessionId, title) => {
    // Use the actual title returned by the backend
    const finalTitle = title || (msg.length > 20 ? msg.substring(0, 20) + "..." : msg);
  
    setChatTitles((prev) => ({
      ...prev,
      today: [...prev.today, finalTitle],
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
