import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";

export const useUsersByRole = () => {
  const [admins, setAdmins] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const { api } = useAppContext();

  const fetchUsers = async (role, setter) => {
    try {
      const { data } = await api.get(`/user/role/${role}`);
      if (data.success) setter(data.data);
    } catch (error) {
      console.error(`Error fetching ${role}:`, error.message);
    }
  };

  useEffect(() => {
    Promise.all([
      fetchUsers("teacher", setTeachers),
      fetchUsers("student", setStudents),
      fetchUsers("admin", setAdmins),
    ]);
  }, []);

  return { admins, teachers, students };
};
