import React, { useState } from "react";
import { Upload, LoaderCircle } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const UploadDocument = () => {
  const [file, setFile] = useState(null);
  const { api } = useAppContext();
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!file) {
      toast.error("Please select a file first!");
      return;
    }

    setLoading(true);
    try {
      const baseName = file.name.replace(/\.[^/.]+$/, "");
      const fd = new FormData();
      fd.append("file", file);
      fd.append("ownerType", "student");
      fd.append("ownerId", "68df9a9a5e21187fbed174e7");
      fd.append("uploaderId", "68df9a9a5e21187fbed174e7");
      fd.append("name", baseName);

      const { data } = await api.post("/document/upload", fd);

      if (data.success) {
        toast.success("Document uploaded successfully!");
        setFile(null);
      } else {
        toast.error("Upload failed, please try again!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Document upload failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 min-h-screen flex flex-col items-center justify-center relative">
      <div className="border p-8 max-w-md w-full shadow-lg rounded-xl text-center bg-white relative">
        <h2 className="text-xl font-bold text-center py-2">Upload Document</h2>
        <p className="text-sm text-gray-500 mb-6">
          Select a file to upload. Supported formats: PDF
        </p>

        <label className="border flex flex-col items-center justify-center w-full h-40 border-dashed cursor-pointer rounded-xl border-gray-200 hover:border-green-500 transition">
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
          disabled={loading}
          className={`mt-5 px-5 bg-green-500 w-full py-2 text-sm text-white rounded-lg hover:bg-green-600 cursor-pointer transition ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Uploading..." : "Upload"}
        </button>

        {loading && (
          <div className="absolute top-50 right-20 bg-white/70 flex flex-col items-center justify-center rounded-xl">
            <LoaderCircle className="animate-spin text-green-600 w-10 h-10 mb-2" />
            <p className="text-gray-700 font-medium text-sm">
              Please wait, the document is being uploaded...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadDocument;
