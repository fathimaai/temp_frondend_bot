import React, { useState, useEffect, useRef } from 'react';
import './Chat.css'; // Import the CSS file
import { IoSend } from 'react-icons/io5';

const Chat = () => {
  const [userMessage, setUserMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSendMessage = async () => {
    if (!userMessage.trim()) return;

    const newChatHistory = [...chatHistory, { sender: 'User', message: userMessage }];
    setChatHistory(newChatHistory);
    setUserMessage('');
    setIsTyping(true);

    try {
      const response = await fetch('dev-main-restaurant-bot.azurewebsites.net/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_message: userMessage }),
      });

      const data = await response.json();
      setIsTyping(false);
      setChatHistory([...newChatHistory, { sender: 'Bot', message: data.response }]);
    } catch (error) {
      console.error('Error:', error);
      setIsTyping(false);
    }
  };

  return (
    <div className="chat-container">
      <h2 className="chat-title">💬 Restaurant Chatbot</h2>
      <div className="chat-history">
        {chatHistory.map((chat, index) => (
          <div key={index} className={`chat-message ${chat.sender.toLowerCase()}`}>
            <strong>{chat.sender}: </strong> {chat.message}
          </div>
        ))}
        {isTyping && <div className="typing-indicator">Bot is typing...</div>}
        <div ref={chatEndRef} />
      </div>

      <div className="chat-input-container">
        <input
          type="text"
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={handleSendMessage}>
          <IoSend size={18} />
        </button>
      </div>
    </div>
  );
};

export default Chat;
