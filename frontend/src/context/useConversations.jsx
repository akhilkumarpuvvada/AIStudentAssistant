import { useCallback, useState } from "react";

const useConversations = (api) => {
  const [conversations, setConversations] = useState([]);

  const fetchConversations = useCallback(async () => {
    try {
      const { data } = await api.get("/conversation");
      if (data.success) setConversations(data.data);
    } catch (err) {
      console.error("Error fetching conversations:", err.message);
    }
  }, [api]);

  return { conversations, fetchConversations };
};

export default useConversations;
