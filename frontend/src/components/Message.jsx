import React from "react";

const Message = ({ message }) => {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex items-end gap-3 my-5 w-full ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {!isUser && (
        <div className="bg-blue-400 text-white rounded-full h-10 w-10 flex items-center justify-center font-medium shadow">
          AI
        </div>
      )}

      <div
        className={`max-w-[70%] px-5 py-3 rounded-2xl shadow-md ${
          isUser
            ? "bg-green-500 text-white rounded-br-none"
            : "bg-gray-800 text-white rounded-bl-none"
        }`}
      >
        <p className="text-base leading-relaxed">{message.text}</p>
        <span
          className={`text-xs block mt-1 ${
            isUser ? "text-green-200 text-right" : "text-gray-400 text-left"
          }`}
        >
          {new Date(message.createdAt).toLocaleString()}
        </span>
      </div>

      {isUser && (
        <div className="flex-shrink-0 bg-green-400 text-white rounded-full h-10 w-10 flex items-center justify-center font-medium shadow">
          You
        </div>
      )}
    </div>
  );
};

export default Message;
