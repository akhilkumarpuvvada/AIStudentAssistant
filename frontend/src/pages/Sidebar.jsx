import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import axios from "axios";
import { Trash2 } from "lucide-react";

const Sidebar = () => {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);

  const createNewConversation = async () => {
    try {
      const {data} = await axios.post("http://localhost:5000/api/conversation/add", {userId: "68df9a9a5e21187fbed174e7"});
      if(data.success) {
        alert("Conversation Created")
      }
      fetchConversations();
      navigate(`/?conversationId=${data.data._id}`)
    } catch (error) {
      console.log(error);
    }
  };

  const fetchConversations = async () => {
    try{
    const userId ="68df9a9a5e21187fbed174e7";
    const {data} = await axios.get(`http://localhost:5000/api/conversation/user/${userId}`);    
    if(data.success) {
      setConversations(data.data);
    }
    }
    catch(error) {
      console.log(error);
    }
  }

  const deleteConversation = async(id) => {
    try {
    const confirm = window.confirm("Are you sure want to delete the conversation");
    if(!confirm) return;
    const {data} = await axios.delete(`http://localhost:5000/api/conversation/${id}`);
    if(data.success) {
      alert("Conversation deleted successfully")
    }
    fetchConversations();
    navigate("/")
    }
    catch(error) {
      console.log(error);
    }
  }
  useEffect(() => {
    fetchConversations();
  }, [])
  
  return (
    <div className="h-screen w-64 bg-black p-5 border-r border-gray-700 flex flex-col text-white">
      <div onClick={() => navigate("/")} className="flex items-center gap-3 border-b border-gray-700 pb-5">
        <img
          src={assets.homeicon}
          className="w-12 h-12 cursor-pointer"
        ></img>
        <p className="text-xl font-bold text-green-600">Student AI Assistant</p>
      </div>
      <div className="flex flex-col space-y-2 mt-5  border-b border-gray-700 pb-4">
        <button
          onClick={() => navigate("/upload")}
          className="px-4 py-2 text-left bg-gray-800 active:bg-blue-500 rounded-md cursor-pointer hover:bg-green-600 transition-colors"
        >
          Upload Document
        </button>
                <button
          onClick={() => navigate("/documents")}
          className="px-4 py-2 text-left bg-gray-800 active:bg-blue-500 rounded-md cursor-pointer hover:bg-green-600 transition-colors"
        >
          All Documents
        </button>

          <button
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 text-left bg-gray-800 active:bg-blue-500 rounded-md cursor-pointer hover:bg-green-600"
          >
            Dashboard
          </button>
          <button
            onClick={() => navigate("/classes")}
            className="px-4 py-2 text-left bg-gray-800 active:bg-blue-500 rounded-md cursor-pointer hover:bg-green-600"
          >
            Classes
          </button>
          <button
            onClick={() => navigate("/teachers")}
            className="px-4 py-2 text-left bg-gray-800 active:bg-blue-500 rounded-md cursor-pointer hover:bg-green-600"
          >
            Teachers
          </button>
          <button
            onClick={() => navigate("/students")}
            className="px-4 py-2 text-left bg-gray-800 active:bg-blue-500 rounded-md cursor-pointer hover:bg-green-600"
          >
            Students
          </button>
          <button
            onClick={() => navigate("/allusers")}
            className="px-4 py-2 mb-2 text-left bg-gray-800 active:bg-blue-500 rounded-md cursor-pointer hover:bg-green-600"
          >
            All Users
          </button>
          <button
            onClick={() => navigate("/admins")}
            className="px-4 py-2 mb-2 text-left bg-gray-800 active:bg-blue-500 rounded-md cursor-pointer hover:bg-green-600"
          >
            Admins
          </button>
        
      </div>
      <div className="mt-3 flex items-center justify-center">
        <button
          onClick={() => createNewConversation()}
          className="px-12 py-3 bg-green-500 text-white font-medium rounded-xl hover:bg-green-600 transition duration-200 shadow-md"
        >
          New Chat
        </button>
      </div>

      <p className="mt-4 text-gray-500 text-sm font-semibold tracking-wide">
        Recent Conversations
      </p>
      {conversations.map((c, index) => (
        <div  onClick={() => navigate(`/?conversationId=${c._id}`)}key={index} className=" flex items-center justify-start px-3 py-2 bg-gray-800 rounded-md mt-2 cursor-pointer hover:bg-gray-700">
        <p className="flex-1">{c.title}</p>
        <Trash2 className="text-red-500" onClick={() => deleteConversation(c._id)} />
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
