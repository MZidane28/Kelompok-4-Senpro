'use client'
import React, { useState } from 'react'
import axios from 'axios';
import { useRouter } from 'next/navigation';

function Chatbot (){

    const [messages, setMessages] = useState([]);
    
      const [input, setInput] = useState('');
    
      const handleSend = async () => {
        if (input.trim() === '') return;
      
        const userMessage = { id: Date.now(), text: input, type: 'user' };
        setMessages((prev) => [...prev, userMessage]);
      
        const res = await fetch("http://192.168.2.79:8080/get", {
            method: "POST",
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({ msg: input }),
          });          
      
        const data = await res.text(); // Flask returns plain text
      
        const botMessage = { id: Date.now() + 1, text: data, type: 'bot' };
        setMessages((prev) => [...prev, botMessage]);
        setInput('');
      };
      

    return (
        
        <div className="flex flex-col justify-between h-full p-6 bg-[#FFFBF2] font-poppins">


      {/* Chat Bubbles */}
      <div className="flex flex-col gap-3 overflow-y-auto flex-1 pr-1">
        {messages.map(msg => (
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
        <input
          type="text"
          placeholder="Let’s talk, I’m here for you!"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSend();
            }
          }}
          className="flex-1 p-3 rounded border border-gray-300 bg-white placeholder-gray-500"
        />
        <button
          onClick={handleSend}
          className="p-3 rounded-full bg-[#D9D9D9] text-xl hover:bg-[#c7c7c7] transition"
        >
          ↑
        </button>
      </div>
    </div>
    )
}

export default Chatbot