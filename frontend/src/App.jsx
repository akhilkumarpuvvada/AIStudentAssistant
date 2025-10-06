import React from "react";
import Sidebar from "./pages/Sidebar";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ChatBox from "./components/ChatBox";
import Classes from "./pages/Classes";
import Teachers from "./pages/Teachers";
import Students from "./pages/Students";
import AllUsers from "./pages/AllUsers";
import UploadDocument from "./pages/UploadDocument";
import AddClass from "./pages/AddClass";
import Admins from "./pages/Admins";
import Message from "./components/Message";
import Documents from "./pages/Documents";

export const App = () => {
  return (
    <div className="h-screen w-screen flex">
      {/* Sidebar on the left */}
      <Sidebar />

      {/* Main content on the right */}
      <div className="flex-1 p-4 overflow-auto bg-gray-100">
        <Routes>
          <Route path="/" element={<ChatBox />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/classes" element={<Classes />} />
          <Route path="/teachers" element={<Teachers />} />
          <Route path="/students" element={<Students />} />
          <Route path="/admins" element={<Admins />} />
          <Route path="/allusers" element={<AllUsers />} />
          <Route path="/upload" element={<UploadDocument />} />
          <Route path="/add-class" element={<AddClass />} />
          <Route path="/message" element={<Message />} />
          <Route path="/documents" element={<Documents />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
