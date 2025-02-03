import { useCallback } from 'react';

const useIdCards = () => {
  const generateIds = useCallback (async (entity, ids = []) => {
    console.log(ids);
    const token = window.localStorage.getItem('nxtgen.token');
    return new Promise((resolve, reject) => {
      google.script.run
        .withSuccessHandler((response) => {
          resolve(response);
        })
        .withFailureHandler((error) => {
          console.error(error);
          reject(error);
        })
        .generateIds(entity, ids, token);
    });
  }, []);

  const getPdfUrl = useCallback (async (entity) => {
    const token = window.localStorage.getItem('nxtgen.token');
    return new Promise((resolve, reject) => {
      google.script.run
        .withSuccessHandler((response) => {
          resolve(response);
        })
        .withFailureHandler((error) => {
          console.error(error);
          reject(error);
        })
        .getPdfUrl(entity, token);
    });
  },[]);

  return { generateIds, getPdfUrl };
}

export default useIdCards;
