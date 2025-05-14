'use client'
import React, { useState } from 'react';
import axios from 'axios';
import { flushSync } from 'react-dom';
import dynamic from 'next/dynamic';

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sessionId] = useState(() => crypto.randomUUID());
  const [userId] = useState(() => {
    return `anonymous-${crypto.randomUUID()}`;
  });
  
  
  const handleSend = async () => {
    if (input.trim() === '') return;
  
    const userMessage = { id: Date.now(), text: input, type: 'user' };
    const loadingMessageId = Date.now() + 1;
    const loadingMessage = { id: loadingMessageId, text: '.', type: 'bot' };
  
    flushSync(() => {
      setMessages((prev) => [...prev, userMessage, loadingMessage]);
    });
    
    // Clear input immediately
    setInput('');
  
    const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    const formData = new URLSearchParams();
    formData.append("msg", input);
    formData.append("session_id", sessionId);
    formData.append("user_id", userId);
  
    try {
      await axios.post(`${baseURL}/embedding`, formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
  
      if (messages.length === 0) {
        const titleRes = await axios.post(`${baseURL}/title`, formData, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        const title = titleRes.data.title;
        console.log("Generated title:", title);
      }
    } catch (err) {
      console.error('Embedding or title generation failed:', err);
    }
  
    // Animate loading message
    const dotPatterns = ['.', '..', '...'];
    let dotIndex = 0;

    const loadingInterval = setInterval(() => {
      dotIndex = (dotIndex + 1) % dotPatterns.length;
      const loadingDots = dotPatterns[dotIndex];

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingMessageId ? { ...msg, text: loadingDots } : msg
        )
      );
    }, 300);

  
    try {
      const res = await axios.post(`${baseURL}/generateresponse`, formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
  
      clearInterval(loadingInterval);
  
      // Replace loading message with actual bot message
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingMessageId
            ? { ...msg, text: res.data.response }
            : msg
        )
      );
    } catch (error) {
      clearInterval(loadingInterval);
  
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingMessageId
            ? { ...msg, text: 'Sorry, something went wrong.' }
            : msg
        )
      );
      console.error('Axios error:', error);
    }
  };
  
  

  return (
    <div className="flex flex-col justify-between h-full p-6 bg-[#FFFBF2] font-poppins">
      {/* Chat Bubbles */}
      <div className="flex flex-col gap-3 overflow-y-auto flex-1 pr-1">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`inline-block px-4 py-2 rounded-lg break-words border ${
              msg.type === 'user'
                ? 'bg-[#FCEEB5] border-[#e6d670] self-end ml-auto'
                : 'bg-[#C5E1A5] border-[#9fc276] self-start mr-auto'
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>
  
      {/* Chat Input */}
      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-300">
        <textarea
          placeholder="Let’s talk, I’m here for you!"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          rows={1}
          className="flex-1 p-3 rounded border border-gray-300 bg-white placeholder-gray-500 resize-none overflow-hidden"
          style={{ minHeight: '3rem' }}
          onInput={(e) => {
            e.target.style.height = 'auto'; // Reset height
            e.target.style.height = e.target.scrollHeight + 'px'; // Set to scroll height
          }}
        />
        <button
          onClick={handleSend}
          className="p-3 rounded-full bg-[#D9D9D9] text-xl hover:bg-[#c7c7c7] transition"
        >
          ↑
        </button>
      </div>
    </div>
  );
  
}


export default Chatbot;