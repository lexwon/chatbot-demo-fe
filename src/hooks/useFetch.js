import { useState, useCallback } from "react";

export function useFetch() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const postData = useCallback(async ({url, body, options = {}}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        new Request(url, {
          headers: {
            "Content-Type": "application/json",
          },
          body,
          method: "POST",
        }),
        options
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, postData };
}
