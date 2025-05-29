'use client'
import React, { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { flushSync } from 'react-dom';
import dynamic from 'next/dynamic';

function Chatbot({ sessionId, onFirstMessage, presetMessages = [] }) {
  const [messages, setMessages] = useState(presetMessages);
  const [firstMessageSent, setFirstMessageSent] = useState(false);
  const [input, setInput] = useState('');
  const [userId] = useState(() => {
    return `anonymous-${crypto.randomUUID()}`;
  });

  // In your handleSend function, add validation:

  useEffect(() => {
    setMessages(presetMessages);
  }, [presetMessages]);

  useEffect(() => {
    setFirstMessageSent(false);
  }, [sessionId]);  

  const handleSend = async () => {
    if (input.trim() === '') return;
  
    const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3500';
  
    const userMessage = { id: Date.now(), text: input, type: 'user' };
    const loadingMessageId = Date.now() + 1;
    const loadingMessage = { id: loadingMessageId, text: '.', type: 'bot' };
  
    flushSync(() => {
      setMessages((prev) => [...prev, userMessage, loadingMessage]);
    });
  
    setInput('');
  
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
      const res = await axios.post(`${baseURL}/chat`, {
        is_new: !firstMessageSent,
        chat_id: sessionId,
        user_question: input,
      }, {
        withCredentials: true
      });
  
      clearInterval(loadingInterval);
  
      const aiResponse = res.data.ai_response;
  
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingMessageId ? { ...msg, text: aiResponse } : msg
        )
      );
  
      if (!firstMessageSent && onFirstMessage) {
        const newSessionId = res.data.chat_id; // get from response
        setCurrentSessionId(newSessionId);
      
        await onFirstMessage(input, newSessionId, '');
        setFirstMessageSent(true);
      }
      
  
    } catch (error) {
      clearInterval(loadingInterval);
  
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingMessageId
            ? { ...msg, text: 'Sorry, something went wrong.' }
            : msg
        )
      );
      console.error('Chat error:', error);
    }
  };  

  
  
  

  return (
    <div className="flex flex-col h-full bg-[#FFFBF2] font-poppins">
      <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`inline-block px-4 py-2 rounded-lg break-words border max-w-[75%] ${
              msg.type === 'user'
                ? 'bg-[#FCEEB5] border-[#e6d670] self-end ml-auto'
                : 'bg-[#C5E1A5] border-[#9fc276] self-start mr-auto'
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>
  
      <div className="sticky bottom-0 left-0 w-full bg-[#FFFBF2] px-6 py-4 border-t border-gray-300">
        <div className="flex items-end gap-2">
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
              e.target.style.height = e.target.scrollHeight + 'px'; // Adjust to content height
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
    </div>
  );
  
  
}


export default Chatbot;