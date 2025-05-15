'use client';
import React, { useState } from 'react';

const initialData = {
  today: [],
  yesterday: [],
  past7days: [],
  past30days: [],
};

function Sidebar() {
  const [chatTitles, setChatTitles] = useState(initialData);
  const [currentSessionId, setCurrentSessionId] = useState(null);

  const handleNewChat = () => {
    const newSessionId = crypto.randomUUID();
    setCurrentSessionId(newSessionId);
    // Title gets added after the user sends first message — handled elsewhere
  };

  const handleFirstMessage = async (msg) => {
    const formData = new FormData();
    formData.append("msg", msg);
    formData.append("session_id", currentSessionId);

    // Save message
    await fetch("http://localhost:8080/embedding", {
      method: "POST",
      body: formData,
    });

    // Generate title
    const titleRes = await fetch("http://localhost:8080/title", {
      method: "POST",
      body: formData,
    });
    const titleData = await titleRes.json();
    const title = titleData.title;

    // Add to "Today"
    setChatTitles(prev => ({
      ...prev,
      today: [...prev.today, title],
    }));
  };

  const renderSection = (title, items) => (
    <div className="mb-4">
      <h4 className="text-xs font-semibold text-gray-500 mb-2">{title}</h4>
      {items.map((item, index) => (
        <input
          key={index}
          type="text"
          defaultValue={item}
          className="block w-full mb-2 p-2 rounded border border-black text-sm bg-[#FFFBF2] focus:outline-none focus:ring-2 focus:ring-[#D9D9D9]"
        />
      ))}
    </div>
  );

  return (
    <div className="w-72 p-4 bg-[#FFFBF2] border-r border-gray-300 h-screen font-poppins">
      <h2 className="text-xl font-bold mb-1">Chatbot</h2>
      <p className="text-sm mb-4 text-gray-600">Chat for support, guidance, and self-reflection</p>
      <input
        type="text"
        placeholder="Search"
        className="w-full mb-4 p-2 border border-gray-400 rounded"
      />
      {renderSection("Today", chatTitles.today)}
      {renderSection("Yesterday", chatTitles.yesterday)}
      {renderSection("Previous 7 Days", chatTitles.past7days)}
      {renderSection("Previous 30 Days", chatTitles.past30days)}
      <button
        onClick={handleNewChat}
        className="mt-4 w-full bg-[#FCEEB5] text-black p-2 rounded-full hover:bg-[#ebdfaa] transition font-semibold"
      >
        New Chat
      </button>
    </div>
  );
}

export default Sidebar;
