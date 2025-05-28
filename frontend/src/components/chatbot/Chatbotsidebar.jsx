'use client';
//import React, { useState } from 'react';

function Sidebar({ chatTitles, onNewChat, onSelectChat }) {
  /***const [chatTitles, setChatTitles] = useState(initialData);
  const [currentSessionId, setCurrentSessionId] = useState(null);

  const handleNewChat = () => {
    const newSessionId = crypto.randomUUID();
    setCurrentSessionId(newSessionId);
  };

  const handleFirstMessage = async (msg) => {
    const formData = new FormData();
    formData.append("msg", msg);
    formData.append("session_id", currentSessionId);

    await fetch("http://localhost:8080/embedding", {
      method: "POST",
      body: formData,
    });

    const titleRes = await fetch("http://localhost:8080/title", {
      method: "POST",
      body: formData,
    });
    const title = (await titleRes.json()).title;

    setChatTitles((prev) => ({
      ...prev,
      today: [...prev.today, title],
    }));
  };
  ***/
  const renderSection = (title, items) =>
    items.length > 0 && (
      <div className="mb-2">
        <h4 className="text-xs text-gray-500 font-semibold mb-1">{title}</h4>
        <div className="space-y-1">
          {items.map((item, index) => (
            <input
              key={index}
              type="text"
              defaultValue={item}
              className="w-full p-1 text-xs rounded border border-gray-400 bg-[#FFFBF2] focus:outline-none focus:ring-1 focus:ring-[#D9D9D9]"
              readOnly
              onClick={() => onSelectChat(item)}
            />
          ))}
        </div>
      </div>
    );
  return (
    <div className="w-64 p-3 bg-[#FFFBF2] border-r border-gray-300 h-screen overflow-y-auto font-poppins">
      <h2 className="text-lg font-bold mb-1">Chatbot</h2>
      <p className="text-xs mb-3 text-gray-600 leading-snug">
        Support, guidance, self-reflection.
      </p>
      <input
        type="text"
        placeholder="Search"
        className="w-full mb-3 p-2 text-sm border border-gray-400 rounded"
      />
      {renderSection("Today", chatTitles.today)}
      {renderSection("Yesterday", chatTitles.yesterday)}
      {renderSection("Previous 7 Days", chatTitles.past7days)}
      {renderSection("Previous 30 Days", chatTitles.past30days)}
      <button
        onClick={onNewChat}
        className="mt-3 w-full bg-[#FCEEB5] text-black p-2 text-sm rounded-full hover:bg-[#ebdfaa] transition font-semibold"
      >
        + New Chat
      </button>
    </div>
  );
}

export default Sidebar;
