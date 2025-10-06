import React from "react";
import { useUsersByRole } from "../hooks/UserByRole";

const Admins = () => {
   const { admins } = useUsersByRole();
  return (
    <div className="p-10 min-h-screen">
      <p className="text-3xl font-bold px-6 mb-6">Admins</p>
      <div className="overflow-x-auto mt-10 bg-white shadow">
        <table className="w-full text-left border">
          <thead>
            <tr className="bg-gray-200 text-gray-700 text-sm uppercase tracking-wider">
              <th className="px-6 py-3 border-b">Name</th>
              <th className="px-6 py-3 border-b">Email</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((s, index) => (
              <tr
                key={index}
                className="hover: bg-gray-50 transition-colors border-t font-medium"
              >
                <td className="px-6 py-3 text-lg">{s.name}</td>
                <td className="px-6 py-3 text-lg">{s.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Admins;
