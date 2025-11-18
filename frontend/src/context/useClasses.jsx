import { useCallback, useState } from "react";

const useClasses = (api) => {
  const [classes, setClasses] = useState([]);

  const fetchClasses = useCallback(async () => {
    try {
      const { data } = await api.get("/class");
      if (data.success) setClasses(data.data);
    } catch (err) {
      console.error("Error fetching classes:", err.message);
    }
  }, [api]);

  return { classes, fetchClasses };
};

export default useClasses;
