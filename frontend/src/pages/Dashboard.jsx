import { Users, BookOpen, GraduationCap, UserCog } from "lucide-react";
import { useUsersByRole } from "../hooks/UserByRole";

const Dashboard = () => {
 
  const { admins, students, teachers, classes} = useUsersByRole();

  return (
    <div className="p-10 min-h-screen">
      <p className="text-3xl font-bold mb-6">Dashboard</p>
      <div className="grid grid-cols-4 gap-6">
        <div className="flex items-center bg-white p-6 rounded-xl shadow hover:shadow-lg transition-shadow gap-4">
          <div className="bg-gray-100 p-4 rounded-xl"><BookOpen className="w-8 h-8 text-blue-500" /></div>
          <div>
            <p className="text-2xl font-semibold px-3">Classes</p>
            <p className="text-2xl font-bold px-3">{classes.length}</p>
          </div>
        </div>
        <div className="flex items-center bg-white p-6 rounded-xl shadow hover:shadow-lg transition-shadow gap-4">
            <div className="bg-gray-100 p-4 rounded-xl"><Users className="w-8 h-8 text-green-500" /></div>
            <div>
                <p className="text-2xl font-semibold px-3">Teachers</p>
                <p className="text-2xl font-bold px-3">{teachers.length}</p>
            </div>
        </div>
        <div className="flex items-center bg-white p-6 rounded-xl shadow hover:shadow-lg transition-shadow gap-4">
            <div className="bg-gray-100 p-4 rounded-xl"><GraduationCap className="w-8 h-8 text-green-500" /></div>
            <div>
                <p className="text-2xl font-semibold px-3">Students</p>
                <p className="text-2xl font-bold px-3">{students.length}</p>
            </div>
        </div>
        <div className="flex items-center bg-white p-6 rounded-xl shadow hover:shadow-lg transition-shadow gap-4">
            <div className="bg-gray-100 p-4 rounded-xl"><UserCog className="w-8 h-8 text-green-500" /></div>
            <div>
                <p className="text-2xl font-semibold px-3">Admins</p>
                <p className="text-2xl font-bold px-3">{admins.length}</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
