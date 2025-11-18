import React, { useState, useEffect } from "react";
import { assets } from "../assets/assets";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import Message from "./Message";
import { useAppContext } from "../context/AppContext";

const ChatBox = () => {
  const [searchParams] = useSearchParams();
  const conversationId = searchParams.get("conversationId");
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const { messages, setMessages} = useAppContext();


  useEffect(() => {
    const chatArea = document.querySelector(".chat-area");
    if (chatArea) chatArea.scrollTop = chatArea.scrollHeight;
  }, [messages]);

  const onSubmit = async () => {
    if (!prompt.trim()) return;
    try {
      setLoading(true);

      const newMsg = { role: "user", text: prompt, createdAt: Date.now() };
      setMessages((prev) => [...prev, newMsg]);

      const { data } = await axios.post(
        "http://localhost:5000/api/message/add",
        {
          conversationId,
          text: prompt,
          role: "user",
          userId: "68df9a9a5e21187fbed174e7",
        },
         { withCredentials: true }
      );

      if (data.success) {
        setPrompt("");
        setMessages((prev) => [...prev, data.reply]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex flex-col bg-gray-50">
      {!conversationId ? (
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <img src={assets.homeicon} className="w-20 h-20 mb-4" alt="AI" />
          <p className="text-lg md:text-2xl font-bold text-green-600">
            Student AI Assistant
          </p>
          <h1 className="text-3xl md:text-5xl font-semibold text-blue-500 mt-4">
            Ask me anything
          </h1>
        </div>
      ) : (
        <div
          className="
            chat-area
            flex-1 
            overflow-y-auto 
            px-6 py-8 
            flex flex-col 
            items-stretch 
            justify-start
            space-y-4
          "
        >
          {loading && messages.length === 0 ? (
            <p className="text-gray-500 text-lg text-center">
              Loading messages...
            </p>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 text-center">
              <img src={assets.homeicon} className="w-20 h-20 mb-4" alt="AI" />
              <p className="text-lg md:text-2xl font-bold text-green-600">
                Student AI Assistant
              </p>
              <p className="text-gray-600 text-xl mt-5">
                No messages yet — start the conversation!
              </p>
            </div>
          ) : (
            messages.map((msg) => (
              <Message message={msg} key={msg._id || msg.createdAt} />
            ))
          )}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="w-full flex justify-center px-4 pb-6"
      >
        <div className="w-full lg:w-[70%] flex items-center bg-white border border-gray-300 rounded-2xl shadow-md px-3 py-2">
          <input
            type="text"
            placeholder="Ask your question here..."
            className="flex-1 h-12 px-4 text-base md:text-lg text-gray-700 rounded-lg focus:outline-none"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <button
            disabled={loading}
            className="ml-2 h-12 px-4 md:px-6 rounded-xl bg-pink-500 hover:bg-pink-600 text-white transition cursor-pointer disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatBox;
