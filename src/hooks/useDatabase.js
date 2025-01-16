import { useState, useCallback } from 'react';

const useDatabase = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (entity, method = 'GET', body = null) => {
    const token = window.localStorage.getItem('nxtgen.token');
    setLoading(true);
    setError(null);
    
    return new Promise((resolve, reject) => {
      google.script.run
        .withSuccessHandler((response) => {
          setData(response);
          resolve(response);
        })
        .withFailureHandler((error) => {
          console.error("API Error: ", error);
          setError(error.message || "Unknown error occurred.");
          reject(error);
        })
        .apiFetch(entity, method, body, token);
    });
  }, []);

  return { data, loading, error, request };
}

export default useDatabase;