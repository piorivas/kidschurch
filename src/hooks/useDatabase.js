import { useState, useCallback } from 'react';

const useDatabase = () => {

  const request = useCallback(async (entity, method = 'GET', body = null) => {
    const token = window.localStorage.getItem('nxtgen.token');
    
    return new Promise((resolve, reject) => {
      google.script.run
        .withSuccessHandler((response) => {
          resolve(response);
        })
        .withFailureHandler((error) => {
          reject(error);
        })
        .apiFetch(entity, method, body, token);
    });
  }, []);

  return { request };
}

export default useDatabase;