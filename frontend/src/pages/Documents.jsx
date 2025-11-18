import { useState, useEffect } from "react";
import DocumentCard from "../components/DocumentCard";
import toast from "react-hot-toast";
import { useAppContext } from "../context/AppContext";
import Loader from "../components/Loader";

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const { api } = useAppContext();

  const fetchDocuments = async () => {
    try {
      const { data } = await api.get("/document/user");
      if (data.success) {
        setDocuments(data.data);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchDocuments();
  });

  return (
    <div className="p-10 min-h-screen">
      {documents.length > 0 ? (
        <>
          <p className="text-3xl font-bold px-6 mb-6">All Documents</p>
          <DocumentCard docs={documents} />
        </>
      ) : (
        <Loader text= "documents" />
      )}
    </div>
  );
};

export default Documents;
