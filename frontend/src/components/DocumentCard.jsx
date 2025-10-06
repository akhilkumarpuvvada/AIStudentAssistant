import { FileText, Trash2 } from "lucide-react";
import axios from "axios";
export default function DocumentTable({ docs }) {

  const deleteDocument = async (id) => {
    const confirm = window.confirm("Are you want to delete the document")
    if(!confirm) return;
   try{
    const {data} = await axios.delete(`http://localhost:5000/api/document/delete/${id}`);
    if(data.success) alert("Document deleted Successfully");
   }
   catch(error) {
    console.log(error);
   }
  }
  
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-200 rounded-lg shadow-md bg-white">
        <thead className="bg-gray-100 text-gray-700 text-sm">
          <tr>
            <th className="px-4 py-2 text-left">Document</th>
            <th className="px-4 py-2 text-left">Owner</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody className="text-sm text-gray-600">
          {docs.map((doc) => (
            <tr key={doc._id} className="border-t hover:bg-gray-50 transition">
              <td className="px-4 py-2">
                <a
                  href={doc.filePath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 hover:underline"
                >
                  <FileText className="w-4 h-4" />
                  {doc.name}
                </a>
              </td>

              <td className="px-4 py-2">{doc.ownerType}</td>
              <td className="px-4 py-2">
                <span
                  className={`${
                    doc.status === "ready"
                      ? "text-green-600"
                      : "text-yellow-600"
                  } font-medium`}
                >
                  {doc.status}
                </span>
              </td>
              <td className="px-4 py-2"><Trash2  className="text-red-500" onClick={() =>deleteDocument(doc._id)}/></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
