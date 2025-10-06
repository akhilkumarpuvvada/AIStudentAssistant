import React, { useState } from "react";
import { useUsersByRole } from "../hooks/UserByRole";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddClass = () => {
  const { students, teachers } = useUsersByRole();
const navigate = useNavigate();
  const [name, setName] = useState("");
  const [teacher, setTeacher] = useState("");
  const [student, setStudent] = useState("");

  console.log("Selected teacher ID:", teacher);
  console.log("Selected student ID:", student);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Sending:", { name, teacherId: teacher, studentId: student });

    try {
      const { data } = await axios.post("http://localhost:5000/api/class/add", {
        name,
        teacherId: teacher, 
        studentId: student, 
      });

      if (data.success) {
        alert("Class saved successfully!");
        setName("");
        setTeacher("");
        setStudent("");
        navigate("/classes")
      } else {
        alert(data.message || "Failed to save class");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving class");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 bg-white shadow-lg rounded-lg p-8 max-w-md mx-auto mt-5"
    >
      <h2 className="text-2xl font-semibold text-gray-800">Add Class</h2>

      {/* Class Name */}
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-600">
          Class Name
        </label>
        <input
          className="border border-gray-400 rounded-md p-2 w-full mt-1 outline-purple-600"
          placeholder="Enter class name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="w-full">
        <label className="block text-sm font-medium text-gray-600">
          Add Teacher
        </label>
        <select
          className="w-full px-3 py-2 mt-1 border rounded-md cursor-pointer"
          value={teacher}
          onChange={(e) => setTeacher(e.target.value)}
          required
        >
          <option value="">Select a teacher</option>
          {teachers.map((t) => (
            <option key={t._id} value={t._id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      <div className="w-full">
        <label className="block text-sm font-medium text-gray-600">
          Add Student
        </label>
        <select
          className="w-full px-3 py-2 mt-1 border rounded-md cursor-pointer"
          value={student}
          onChange={(e) => setStudent(e.target.value)}
          required
        >
          <option value="">Select a student</option>
          {students.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition"
      >
        Save Class
      </button>
    </form>
  );
};

export default AddClass;
