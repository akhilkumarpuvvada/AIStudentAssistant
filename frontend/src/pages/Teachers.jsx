import React from "react";
import { useUsersByRole } from "../hooks/UserByRole";

const Teachers = () => {
   const { teachers } = useUsersByRole();
  return (
    <div className="p-10 min-h-screen">
      <p className="text-3xl font-bold px-6 mb-6">Teachers</p>
      <div className="overflow-x-auto mt-10 bg-white shadow">
        <table className="w-full text-left border">
          <thead>
            <tr className="bg-gray-200 text-gray-700 text-sm uppercase tracking-wider">
              <th className="px-6 py-3 border-b">Name</th>
              <th className="px-6 py-3 border-b">Email</th>
              <th className="px-6 py-3 border-b">Classes</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((t, index) => (
              <tr
                key={index}
                className="hover: bg-gray-50 transition-colors border-t font-medium"
              >
                <td className="px-6 py-3 text-lg">{t.name}</td>
                <td className="px-6 py-3 text-lg">{t.email}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    {t.classIds.map((cls, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                      >
                        {cls.name}
                      </span>
                    ))}
                  </div>
                </td>{" "}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Teachers;
