import { useCallback, useState } from "react";
import toast from "react-hot-toast";

const useUser = (api, navigate) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const fetchCurrentUser = useCallback(async () => {
    try {
      const { data } = await api.get("/auth/me");
      if (data.success) {
        setCurrentUser(data.user);
      } else {
        setCurrentUser(null);
      }
    } catch {
      setCurrentUser(null);
    } finally {
      setLoadingUser(false);
    }
  }, [api]);

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
      setCurrentUser(null);
      navigate("/login");
      toast.success("Logged out successfully!");
    } catch (err) {
      toast.error("Logout failed!");
    }
  }, [api, navigate]);

  return {
    currentUser,
    setCurrentUser,
    fetchCurrentUser,
    loadingUser,
    logout,
  };
};

export default useUser;
