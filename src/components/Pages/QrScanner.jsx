import React, { useEffect, useState } from "react";
import Html5Scanner from "../Html5Scanner";
import ManualLog from "../ManualLog";
import RegisterForm from "../RegisterForm";
import Logs from "../Logs";
import ModalYesNo from "../Modal/ModalYesNo";
import { handleQrScan, init } from "../../utils/QrScannerHandler";
import { useNavigate } from "react-router-dom";
import useDatabase from "../../hooks/useDatabase";
import { toast, Toaster } from "sonner";

export const QrScanner = () => {
  const [logs, setLogs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const [services, setServices] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("qr");
  const navigate = useNavigate();
  const { request } = useDatabase(); // Call useDatabase hook here

  useEffect(() => {
    init(request);
  }, []);

  const validateQRCode = (qrCode) => {
    const qrData = qrCode.split('||');
    if (qrData.length !== 4) {
      if (qrCode.startsWith("https://nxtgen.short.gy")) {
        setQrCode(qrCode);
        setShowModal(true);
      }
      return false;
    }
    return true;
  };

  const insertLog = (log) => {
    if (null == log) {
      return;
    }
    setLogs(
      (prevLogs) => [log, ...prevLogs].slice(0, 100)
    );
  }

  const handleScanSuccess = async (qrText) => {
    setLoading(true);
    const timestamp = new Date();
    if (validateQRCode(qrText)) {
      const id = qrText.split('||')[3];
      try {
        var srvs = services;
        if (!srvs) {
          srvs = JSON.parse(await request('services', 'GETALL', {}));
          setServices(srvs);
        }
        insertLog(await handleQrScan(qrText, request, timestamp, srvs));
      } catch (error) {
        toast.error("Failed to fetch data: " + error);
      }
    }
    setLoading(false);
  };

  const handleModalYes = () => {
    const url = new URL(qrCode);
    const paramPath = url.searchParams.toString().replace(/&/g, '/').replace(/=/g, '/');
    navigate(`/${paramPath}`);
    setShowModal(false);
  };

  const handleModalNo = () => {
    setShowModal(false);
  };

  const handleError = (message, type) => {
    toast[type](message);
  }

  return (
    <div className="flex flex-col md:flex-row p-5 min-h-screen bg-gray-100">
      <div className="flex flex-col justify-start items-center">
        <div className="border-b border-gray-200 w-full">
          <ul className="flex nowrap text-sm font-medium text-center text-gray-500">
            <li className="me-2 flex-grow">
              <button onClick={() => setActiveTab('qr')} className={`inline-flex items-center justify-center p-4 text-blue-600 border-b-2 ${activeTab === 'qr' ? 'border-blue-600 active' : 'border-transparent hover:text-gray-600 hover:border-gray-300'} rounded-t-lg group`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75ZM6.75 16.5h.75v.75h-.75v-.75ZM16.5 6.75h.75v.75h-.75v-.75ZM13.5 13.5h.75v.75h-.75v-.75ZM13.5 19.5h.75v.75h-.75v-.75ZM19.5 13.5h.75v.75h-.75v-.75ZM19.5 19.5h.75v.75h-.75v-.75ZM16.5 16.5h.75v.75h-.75v-.75Z" />
                </svg>QR
              </button>
            </li>
            <li className="me-2 flex-grow">
              <button onClick={() => setActiveTab('manual')} className={`inline-flex items-center justify-center p-4 border-b-2 ${activeTab === 'manual' ? 'border-blue-600 active' : 'border-transparent hover:text-gray-600 hover:border-gray-300'} rounded-t-lg group`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>Manual
              </button>
            </li>
            <li className="me-2 flex-grow">
              <button onClick={() => setActiveTab('register')} className={`inline-flex items-center justify-center p-4 border-b-2 ${activeTab === 'register' ? 'border-blue-600 active' : 'border-transparent hover:text-gray-600 hover:border-gray-300'} rounded-t-lg group`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                </svg>Register
              </button>
            </li>
          </ul>
        </div>
        {activeTab === 'qr' && <Html5Scanner onScanSuccess={handleScanSuccess} />}
        {activeTab === 'manual' && <ManualLog onLog={handleScanSuccess} />}
        {activeTab === 'register' && <RegisterForm onLog={handleScanSuccess} setMessage={handleError} />}
      </div>
      <Logs logs={logs} loading={loading} />
      {showModal && (
        <ModalYesNo
          message="Would you like to open kids registration page?"
          onYes={handleModalYes}
          onNo={handleModalNo}
        />
      )}
      <Toaster richColors expand={false} position="top-center" />
    </div>
  );
};