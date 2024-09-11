// import React, { useState, useRef, useEffect } from 'react';
// import { Send, Loader } from 'lucide-react';
// import './Chat.css';

// const Chatbot = () => {
//   const [messages, setMessages] = useState([]);
//   const [inputMessage, setInputMessage] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const messagesEndRef = useRef(null);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(scrollToBottom, [messages]);

//   const handleInputChange = (e) => {
//     setInputMessage(e.target.value);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!inputMessage.trim()) return;

//     const userMessage = { role: 'user', content: inputMessage };
//     setMessages(prevMessages => [...prevMessages, userMessage]);
//     setInputMessage('');
//     setIsLoading(true);

//     try {
//       const response = await fetch('http://127.0.0.1:8000/chat', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ text: inputMessage }),
//       });

//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }

//       const data = await response.json();
//       const botMessage = { role: 'assistant', content: data.model_output };
//       setMessages(prevMessages => [...prevMessages, botMessage]);
//     } catch (error) {
//       console.error('Error:', error);
//       const errorMessage = { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' };
//       setMessages(prevMessages => [...prevMessages, errorMessage]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="chatbot-container">
//       <div className="chatbot-header">
//         <h2>Chatbot</h2>
//       </div>
//       <div className="chatbot-messages">
//         {messages.map((message, index) => (
//           <div key={index} className={`message ${message.role}`}>
//             <div className="message-content">{message.content}</div>
//           </div>
//         ))}
//         {isLoading && (
//           <div className="message assistant">
//             <div className="message-content">
//               {/* <Loader className="icon animate-spin" /> */}
//               {/* Thinking... */}
//               Typing...
//             </div>
//           </div>
//         )}
//         <div ref={messagesEndRef} />
//       </div>
//       <form onSubmit={handleSubmit} className="chatbot-input">
//         <input
//           type="text"
//           value={inputMessage}
//           onChange={handleInputChange}
//           placeholder="Type a message..."
//         />
//         <button type="submit" disabled={isLoading}>
//           <Send className="icon" />
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Chatbot;

import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Chat.css';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userClassifications, setUserClassifications] = useState([]);
  const [modelClassifications, setModelClassifications] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = { role: 'user', content: inputMessage };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputMessage }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const botMessage = { role: 'assistant', content: data.model_output };
      setMessages(prevMessages => [...prevMessages, botMessage]);

      // Update classification data
      setUserClassifications(prevData => [
        ...prevData,
        data.user_classification_score
      ]);

      setModelClassifications(prevData => [
        ...prevData,
        data.model_classification_score
      ]);

    } catch (error) {
      console.error('Error:', error);
      const errorMessage = { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderLineChart = (data, title) => {
    const chartData = data.map((scores, index) => ({
      id: index,
      suicidal: scores[0],
      nonSuicidal: scores[1]
    }));

    return (
      <div className="chart-container">
        <h3>{title}</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="id" />
            <YAxis domain={[0, 1]} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="suicidal" stroke="#8884d8" strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="nonSuicidal" stroke="#82ca9d" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <div className="chatbot-wrapper">
      <div className="chatbot-container">
        <div className="chatbot-header">
          <h2>Chatbot</h2>
        </div>
        <div className="chatbot-messages">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.role}`}>
              <div className="message-content">{message.content}</div>
            </div>
          ))}
          {isLoading && (
            <div className="message assistant">
              <div className="message-content">
                <Loader className="icon animate-spin" />
                Thinking...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSubmit} className="chatbot-input">
          <input
            type="text"
            value={inputMessage}
            onChange={handleInputChange}
            placeholder="Type a message..."
          />
          <button type="submit" disabled={isLoading}>
            <Send className="icon" />
          </button>
        </form>
      </div>
      <div className="graphs-container">
        {renderLineChart(userClassifications, "User Input Classification")}
        {renderLineChart(modelClassifications, "Model Output Classification")}
      </div>
    </div>
  );
};

export default Chatbot;