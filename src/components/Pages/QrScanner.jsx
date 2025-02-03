import React, { useEffect, useState } from "react";
import Html5Scanner from "../Html5Scanner";
import Logs from "../Logs";
import ModalYesNo from "../Modal/ModalYesNo";
import { handleQrScan } from "../../utils/QrScannerHandler";
import { useNavigate } from "react-router-dom";
import useDatabase from "../../hooks/useDatabase";
import { toast, Toaster } from "sonner";

export const QrScanner = () => {
  const [logs, setLogs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const [services, setServices] = useState(null);
  const navigate = useNavigate();
  const { request } = useDatabase(); // Call useDatabase hook here

  const validateQRCode = (qrCode) => {
    const qrData = qrCode.split('||');
    if (qrData.length !== 4) {
      if (qrCode.startsWith("https://nxtgen.short.gy/v1?register=")) {
        setQrCode(qrCode);
        setShowModal(true);
      }
      return false;
    }
    return true;
  };

  const insertLog = (log) => {
    if (null == log){
      return;
    }
    setLogs(
      (prevLogs) => [log, ...prevLogs].slice(0, 100)
    );
  }

  const handleScanSuccess = async (qrText) => {
    const timestamp = new Date();
    if (validateQRCode(qrText)) {
      const id = qrText.split('||')[3];
      toast.info("Fetching data for ID: " + id);
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
  };

  const handleModalYes = () => {
    window.location.href = qrCode;
    setShowModal(false);
  };

  const handleModalNo = () => {
    setShowModal(false);
  };

  return (
    <div className="flex flex-col md:flex-row p-5 min-h-screen bg-gray-100">
      <div className="flex justify-center ">
        <Html5Scanner onScanSuccess={(qr) => handleScanSuccess(qr)} />
      </div>
      <Logs logs={logs} />
      {showModal && (
        <ModalYesNo
          message="Would you like to open kids registration page?"
          onYes={handleModalYes}
          onNo={handleModalNo}
        />
      )}
      <Toaster richColors expand={false} position="top-center"/>
    </div>
  );
};