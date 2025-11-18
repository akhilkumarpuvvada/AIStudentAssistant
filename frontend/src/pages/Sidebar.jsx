import React from "react";
import { assets } from "../assets/assets";
import { Trash2 } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

const Sidebar = () => {
  const {
   currentUser,
    conversations,
    fetchConversations,
    logout,
    navigate,
    api,
  } = useAppContext();

  const [searchParams] = useSearchParams();
  const activeId = searchParams.get("conversationId");
console.log(currentUser, "curr");


  const createNewConversation = async () => {
    try {
      const title = `Chat ${new Date().toLocaleTimeString()}`;
      const { data } = await api.post("/conversation/add", { title });
      if (data.success) {
        toast.success("Conversation created successfully!");
        await fetchConversations(); 
        navigate(`/?conversationId=${data.data._id}`);
      }
    } catch (error) {
      console.error("Error creating conversation:", error);
      toast.error("Failed to create conversation!");
    }
  };


  const deleteConversation = async (id) => {
    try {
      const confirm = window.confirm(
        "Are you sure you want to delete this conversation?"
      );
      if (!confirm) return;

      const { data } = await api.delete(`/conversation/${id}`);
      if (data.success) {
        toast.success("Conversation deleted successfully!");
        await fetchConversations();
        navigate("/");
      }
    } catch (error) {
      console.error("Error deleting conversation:", error);
      toast.error("Failed to delete conversation!");
    }
  };

  return (
    <div className="h-screen w-64 bg-black p-5 border-r border-gray-700 flex flex-col text-white">
      <div
        onClick={() => navigate("/")}
        className="flex items-center gap-3 border-b border-gray-700 pb-5 cursor-pointer"
      >
        <img src={assets.homeicon} alt="home" className="w-12 h-12" />
        <p className="text-xl font-bold text-green-600">Student AI Assistant</p>
      </div>

      <div className="flex flex-col space-y-2 mt-5 border-b border-gray-700 pb-4">
        <button
          onClick={() => navigate("/upload")}
          className="px-4 py-2 text-left bg-gray-800 rounded-md hover:bg-green-600 transition-colors"
        >
          Upload Document
        </button>

        <button
          onClick={() => navigate("/documents")}
          className="px-4 py-2 text-left bg-gray-800 rounded-md hover:bg-green-600 transition-colors"
        >
          All Documents
        </button>

        {currentUser.role === "admin" && (
          <>
            <button
              onClick={() => navigate("/dashboard")}
              className="px-4 py-2 text-left bg-gray-800 rounded-md hover:bg-green-600 transition-colors"
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate("/students")}
              className="px-4 py-2 text-left bg-gray-800 rounded-md hover:bg-green-600 transition-colors"
            >
              Students
            </button>
            <button
              onClick={() => navigate("/allusers")}
              className="px-4 py-2 text-left bg-gray-800 rounded-md hover:bg-green-600 transition-colors"
            >
              All Users
            </button>
            <button
              onClick={() => navigate("/admins")}
              className="px-4 py-2 text-left bg-gray-800 rounded-md hover:bg-green-600 transition-colors"
            >
              Admins
            </button>
          </>
        )}

        <button
          onClick={() => navigate("/classes")}
          className="px-4 py-2 text-left bg-gray-800 rounded-md hover:bg-green-600 transition-colors"
        >
          Classes
        </button>
        <button
          onClick={() => navigate("/teachers")}
          className="px-4 py-2 text-left bg-gray-800 rounded-md hover:bg-green-600 transition-colors"
        >
          Teachers
        </button>
      </div>

      <div className="mt-3 flex items-center justify-center">
        <button
          onClick={createNewConversation}
          className="px-12 py-3 bg-green-500 text-white font-medium rounded-xl hover:bg-green-600 transition duration-200 shadow-md"
        >
          New Chat
        </button>
      </div>

      <p className="mt-4 text-gray-500 text-sm font-semibold tracking-wide">
        Recent Conversations
      </p>

      <div className="flex-1 overflow-y-auto mt-2 pr-1">
        {conversations.length === 0 ? (
          <p className="text-gray-400 text-sm mt-2">No conversations yet</p>
        ) : (
          conversations.map((c) => (
            <div
              key={c._id}
              onClick={() => navigate(`/?conversationId=${c._id}`)}
              className={`flex items-center justify-start px-3 py-2 rounded-md mt-2 cursor-pointer transition-colors ${
                activeId === c._id
                  ? "bg-green-700"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              <p className="flex-1 truncate">
                {c.title || "Untitled Chat"}
              </p>
              <Trash2
                className="text-red-500 hover:text-red-700"
                onClick={(e) => {
                  e.stopPropagation(); 
                  deleteConversation(c._id);
                }}
              />
            </div>
          ))
        )}
      </div>

      <div className="mt-auto flex items-center gap-3 p-3 border border-green-700 rounded-md cursor-pointer">
        <p className="flex-1 text-sm truncate">
          {currentUser ? `${currentUser.name}` : "Login your account"}
          <br />
          {currentUser ? currentUser.role : null}
        </p>
        {currentUser && (
          <button
            onClick={logout}
            className="text-red-400 hover:text-red-600 transition"
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
