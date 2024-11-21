import { useState, useCallback } from "react";

export function useFetch() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (request, options = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(request, options);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      return result;
      //   setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, fetchData };
}
