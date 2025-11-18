import { useCallback, useState } from "react";

const useMessages = (api, conversationId) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMessages = useCallback(async () => {
    if (!conversationId) return;
    setLoading(true);
    try {
      const { data } = await api.get(`/message/${conversationId}`);
      if (data.success) setMessages(data.data);
    } catch (err) {
      console.error("Error fetching messages:", err.message);
    } finally {
      setLoading(false);
    }
  }, [api, conversationId]);

  return { messages, fetchMessages, setMessages, loading };
};

export default useMessages;
