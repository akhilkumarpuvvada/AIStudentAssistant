import { Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import DateDisplay from "../utils/DateDisplay";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("http://localhost:5000/api/user");
      if (data.success) {
        setUsers(data.data);
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      await axios.put(`http://localhost:5000/api/user/update/${id}`, { role: newRole });
      fetchUsers();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/user/delete/${id}`);
      fetchUsers();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const roles = ["student", "teacher", "admin"];

  return (
    <div className="p-10 min-h-screen bg-gray-100">
      <p className="text-3xl font-bold mb-6">All Users</p>
      {loading ? (
        <p>Loading ....</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-xl">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-200 text-gray-700 text-sm uppercase tracking-wider">
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Joined At</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr
                  key={u._id}
                  className="hover:bg-gray-50 border-t transition-colors"
                >
                  <td className="px-6 py-4 font-medium">{u.name}</td>
                  <td className="px-6 py-4">{u.email}</td>
                  <td className="px-6 py-4">
                    <select
                      onChange={(e) => handleRoleChange(u._id, e.target.value)}
                      value={u.role}
                      className="px-3 py-2 border rounded-md text-sm bg-green-100 hover:bg-green-200 cursor-pointer"
                    >
                      {roles.map((role) => (
                        <option key={role} value={role}>
                          {role.charAt(0).toUpperCase() + role.slice(1)}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <DateDisplay value={u.createdAt} />
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDeleteUser(u._id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllUsers;
