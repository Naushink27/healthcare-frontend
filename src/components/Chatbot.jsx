import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const Chatbot = ({ onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const user = useSelector((store) => store.user.user);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { type: 'user', text: input };
    const botMessage = { type: 'bot', text: getBotReply(input) };

    setMessages((prevMessages) => [...prevMessages, userMessage, botMessage]);
    setInput('');
  };

  const getBotReply = (msg) => {
    const lowerMsg = msg.toLowerCase();
    if (user && user.role === 'patient') {
      if (lowerMsg.includes('appointment')) {
        return 'You can check appointments from the Appointments tab.';
      } else if (lowerMsg.includes('profile')) {
        return 'Head over to the Profile section to edit/view your details.';
      } else if (lowerMsg.includes('feedback')) {
        return 'Feedbacks can be viewed from the Feedback tab.';
      } else if (lowerMsg.includes('doctors')) {
        return 'You can view doctors in the Doctors section.';
      } else {
        return 'Hmm... I did not get that. Try asking about appointments, doctors, profile, or feedback.';
      }
    } else {
      if (lowerMsg.includes('appointments')) {
        return 'You can check your appointments in the Appointments section.';
      } else if (lowerMsg.includes('patients')) {
        return 'You can view your patients in the Patients tab.';
      } else if (lowerMsg.includes('profile')) {
        return 'You can edit/view your profile in the Profile section.';
      } else if (lowerMsg.includes('feedback')) {
        return 'Feedbacks can be viewed from the Feedback tab.';
      } else {
        return 'I am not sure about that. Try asking about appointments, patients, feedback, or profile.';
      }
    }
  };

  return (
    <div className="w-full h-full bg-white shadow-2xl rounded-2xl border border-gray-200 flex flex-col max-h-[500px] animate-fade-in overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-teal-400 text-white p-3 rounded-t-2xl flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center">
          <span className="mr-2">🩺</span> Chat Assistant
        </h3>
        <button onClick={onClose} className="text-white hover:text-gray-200 text-xl font-bold">
          ✕
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-gray-100">
        {messages.map((msg, index) => (
          <div key={index} className={`${msg.type === 'user' ? 'text-right' : 'text-left'} animate-fade-in`}>
            <div
              className={`inline-block p-3 rounded-lg shadow-md max-w-[80%] break-words ${
                msg.type === 'user' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
              }`}
            >
              <b>{msg.type === 'user' ? 'You' : 'Bot'}:</b> <span className="ml-1">{msg.text}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Type here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-500"
          />
          <button
            onClick={handleSend}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200 disabled:bg-blue-300"
            disabled={!input.trim()}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
