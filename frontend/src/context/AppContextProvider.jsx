import { useMemo, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useUser from "./useUser";
import useClasses from "./useClasses";
import useConversations from "./useConversations";
import useMessages from "./useMessages";
import { AppContext } from "./AppContext";
import { api } from "../utils/api";


export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const conversationId = searchParams.get("conversationId");

  const {
    currentUser,
    setCurrentUser,
    fetchCurrentUser,
    loadingUser,
    logout,
  } = useUser(api, navigate);

  const { classes, fetchClasses } = useClasses(api);
  const { conversations, fetchConversations } = useConversations(api);
  const { messages, fetchMessages, setMessages, loading } = useMessages(api, conversationId);

  useEffect(() => {
    Promise.allSettled([fetchCurrentUser(), fetchClasses(), fetchConversations()]);
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [conversationId, fetchMessages]);

  const value = useMemo(
    () => ({
      api,
      navigate,
      currentUser,
      setCurrentUser,
      loadingUser,
      logout,
      classes,
      fetchClasses,
      conversations,
      fetchConversations,
      messages,
      fetchMessages,
      setMessages,
      loading,
    }),
    [navigate, currentUser, setCurrentUser, loadingUser, logout, classes, fetchClasses, conversations, fetchConversations, messages, fetchMessages, setMessages, loading]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
