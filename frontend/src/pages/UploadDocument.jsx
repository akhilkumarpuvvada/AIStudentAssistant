import React, { useState } from "react";
import { Upload } from "lucide-react";
import axios from "axios";

const UploadDocument = () => {
  const [file, setFile] = useState(null);

  const onSubmit = async () => {
    try {
      if (!file) return;
      const baseName = file.name.replace(/\.[^/.]+$/, "")      
      const fd = new FormData();
      
      fd.append("file", file);
      fd.append("ownerType", "student");
      fd.append("ownerId", "68df9a9a5e21187fbed174e7");
      fd.append("uploaderId", "68df9a9a5e21187fbed174e7");
      fd.append("name", baseName);
      

      const { data } = await axios.post(
        "http://localhost:5000/api/document/upload",
        fd
      );

      if (data.success) {
        alert("Document uploaded successfully!");
      }
      setFile(null);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-10 min-h-screen flex flex-col items-center justify-center">
      <div className="border p-8 max-w-md shadow-lg rounded-xl text-center bg-white">
        <h2 className="text-xl font-bold text-center py-2">Upload Document</h2>
        <p className="text-sm text-gray-500 mb-6">
          Select a file to upload. Supported formats: PDF
        </p>

        <label className="border flex flex-col items-center justify-center w-full h-50 border-dashed cursor-pointer rounded-xl border-gray-200 hover:border-green-500 transition">
          <Upload className="h-8 w-8 mb-2 text-gray-400" />
          <span className="text-gray-600">Click to choose file</span>
          <input
            type="file"
            className="hidden"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </label>

        {file && (
          <p className="mt-2 text-sm text-gray-600">Selected: {file.name}</p>
        )}

        <button
          onClick={onSubmit}
          className="mt-5 px-5 bg-green-500 w-full py-2 text-sm text-white rounded-lg hover:bg-green-600 cursor-pointer transition"
        >
          Upload
        </button>
      </div>
    </div>
  );
};

export default UploadDocument;
