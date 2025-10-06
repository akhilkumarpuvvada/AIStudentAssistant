import React, { useState, useEffect } from "react";
import axios from "axios";
import DocumentCard from "../components/DocumentCard";

const Documents = () => {
  const [documents, setDocuments] = useState([]);

  const fetchDocuments = async () => {
    const id = "68df9a9a5e21187fbed174e7";
    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/document/user/${id}`
      );
      if (data.success) {
        setDocuments(data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);
  
  return (
    <div className="p-10 min-h-screen">
      <p className="text-3xl font-bold px-6 mb-6">All Documents</p>

      <DocumentCard docs={documents} />
    </div>
  );
};

export default Documents;
