import { useCallback } from "react";

const useReports = () => {
  const generateReport = useCallback (async (filters)  => {
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
          .generateReport(filters, token);
    });
  }, []);

  const getPdfUrl = useCallback (async () => {
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
          .getPdfReportUrl(token);
    });
  },[]);

  const getAppsScriptUrl = useCallback (async () => {
    return new Promise((resolve, reject) => {
        google.script.run
          .withSuccessHandler((response) => {
            resolve(response);
          })
          .withFailureHandler((error) => {
            console.error(error);
            reject(error);
          })
          .getAppsScriptUrl();
    });
  }, []);

  return { generateReport, getPdfUrl, getAppsScriptUrl };
}

export default useReports;