import React,{useEffect, useState} from "react";
import { Delete, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Classes = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);

    const handleDeleteClass = async (id) => {
      await axios.delete(`http://localhost:5000/api/class/delete/${id}`);
      fetchClasses();
    }
    
  const fetchClasses = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/class`);
      
      
      if (data.success) {
        setClasses(data.data);
      };
    } catch {
      console.log(`Error`);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  return (
    <>
      <div className="p-10 min-h-screen">
        <div className="flex items-center justify-between px-6 mb-6">
          <p className="text-3xl font-bold">Classes</p>
          <button onClick={() => navigate("/add-class")} className="bg-green-600 px-5 py-3 text-white rounded-lg shadow hover:bg-green-700 cursor-pointer transition-colors">Add Class</button>
        </div>
        <div className="overflow-x-auto mt-10">
          <table className="w-full text-left border text-sm uppercase">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="px-6 py-3 border-b">Name</th>
                <th className="px-6 py-3 border-b">Students</th>
                <th className="px-6 py-3 border-b">Teacher</th>
                <th className="px-6 py-3 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
                {classes.map((cls, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors border-b font-medium">
                        <td className="px-6 py-3 text-lg">{cls.name}</td>
                        <td className="px-6 py-3 text-lg">{cls.studentIds.length}</td>
                        <td className="px-6 py-3 text-lg">
                          <div className="flex flex-wrap gap-2">
                            {cls.teacherIds.map((n, index) => {
                              return <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">{n.name}</span>
                            })}
                          </div>
                          </td>
                        <td><button onClick={() => handleDeleteClass(cls._id)} className="p-6 text-red-600 cursor-pointer hover:bg-red-100 rounded-lg transition-colors"><Trash2 className="w-6 h-6" /></button></td>
                    </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Classes;
