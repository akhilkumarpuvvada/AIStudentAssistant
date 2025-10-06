// src/hooks/useUsersByRole.js
import { useEffect, useState } from "react";
import axios from "axios";

export const useUsersByRole = () => {
  const [admins, setAdmins] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);

  const fetchUsers = async (role, setter) => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/user/role/${role}`);
      
      if (data.success) setter(data.data);
    } catch {
      console.log(`Error fetching ${role}`);
    }
  };


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
    fetchUsers("teacher", setTeachers);
    fetchUsers("student", setStudents);
    fetchUsers("admin", setAdmins);
    fetchClasses();
  }, []);

  return { admins, teachers, students, classes };
};
